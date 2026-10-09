import { supabase } from './supabaseClient';
import { isCloudinaryConfigured, uploadToCloudinary } from './cloudinaryService';

const LOCAL_MOMENTS_KEY = 'haxlr8_dynamic_moments';
const STORAGE_BUCKET = 'id-cards';

/**
 * Get locally cached moments
 */
export function getLocalMoments() {
  try {
    const raw = localStorage.getItem(LOCAL_MOMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Error reading local moments:', e);
    return [];
  }
}

/**
 * Save moments to local cache
 */
export function setLocalMoments(moments) {
  try {
    localStorage.setItem(LOCAL_MOMENTS_KEY, JSON.stringify(moments));
    window.dispatchEvent(new CustomEvent('haxlr8_moments_updated', { detail: moments }));
  } catch (e) {
    console.warn('Error saving local moments:', e);
  }
}

/**
 * Get set of all deleted moment IDs and URLs (tombstones)
 */
export function getDeletedMomentIds() {
  try {
    const rawDel = localStorage.getItem('haxlr8_deleted_moments');
    const list = rawDel ? JSON.parse(rawDel) : [];
    return new Set(list);
  } catch (e) {
    return new Set();
  }
}

/**
 * Helper to compress image to base64 fallback if storage is unavailable
 */
export async function fileToBase64(file, maxWidth = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(elem.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload an image file to Supabase Storage
 */
export async function uploadMomentImage(file) {
  if (!file) throw new Error('No image file provided');
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file (JPG, PNG, WebP)');
  }

  // 1. Try Cloudinary first if configured (prevents Supabase from getting overwhelmed)
  if (isCloudinaryConfigured()) {
    try {
      const cloudRes = await uploadToCloudinary(file, { folder: 'haxlr8_moments' });
      if (cloudRes?.secureUrl) {
        return {
          url: cloudRes.secureUrl,
          path: cloudRes.publicId,
          storageType: 'cloudinary'
        };
      }
    } catch (cloudErr) {
      console.warn('Cloudinary upload notice, falling back to Supabase:', cloudErr);
    }
  }

  // 2. Supabase Storage fallback
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
  const path = `moments/${timestamp}_${randomStr}_${cleanName}`;

  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);

      if (urlData?.publicUrl) {
        return {
          url: urlData.publicUrl,
          path,
          storageType: 'supabase_storage'
        };
      }
    }
  } catch (storageErr) {
    console.warn('Storage upload error, falling back to compressed data URL:', storageErr);
  }

  // 3. Fallback to compressed base64 if storage calls fail
  const base64Url = await fileToBase64(file);
  return {
    url: base64Url,
    path,
    storageType: 'base64_fallback'
  };
}

/**
 * Fetch all moments from database + cache
 */
export async function fetchMoments() {
  const local = getLocalMoments();

  // Load persistent tombstone list so deleted moments never resurrect
  let deletedList = [];
  try {
    const rawDel = localStorage.getItem('haxlr8_deleted_moments');
    deletedList = rawDel ? JSON.parse(rawDel) : [];
  } catch (e) {}
  const deletedSet = new Set(deletedList);

  try {
    // 1. Try public.moments table if available
    const { data: momentsData, error: mErr } = await supabase
      .from('moments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!mErr && momentsData && Array.isArray(momentsData)) {
      const filteredMoments = momentsData.filter(m => !deletedSet.has(m.id) && !deletedSet.has(m.src));
      setLocalMoments(filteredMoments);
      return filteredMoments;
    }

    // 2. Fetch announcements with tag 'MOMENT'
    const { data: annData, error: aErr } = await supabase
      .from('announcements')
      .select('*')
      .eq('tag', 'MOMENT')
      .order('created_at', { ascending: false });

    if (!aErr && annData && Array.isArray(annData)) {
      const parsed = annData.map(item => {
        try {
          const detail = item.content ? JSON.parse(item.content) : {};
          if (detail.isDeleted) return null;
          return {
            id: detail.id || `moment_${item.id}`,
            dbId: item.id,
            title: item.title || detail.title || 'HAXLR8 Hackathon Moment',
            subtitle: detail.subtitle || item.message || 'Maharaja Institute of Technology Mysore',
            category: detail.category || 'ceremony',
            tag: detail.tag || 'MOMENT',
            src: detail.src || '',
            storagePath: detail.storagePath || '',
            description: item.message || detail.description || '',
            rotate: detail.rotate || 0,
            bg: detail.bg || '#ffffff',
            border: detail.border || '#fed7aa',
            created_at: item.created_at || detail.created_at || new Date().toISOString()
          };
        } catch (e) {
          return null;
        }
      }).filter(m => Boolean(m && m.src && !deletedSet.has(m.id) && !deletedSet.has(m.src) && !deletedSet.has(String(m.dbId))));

      // Combine with any local-only moments not yet synced and not deleted
      const syncedIds = new Set(parsed.map(p => p.id));
      const unSynced = local.filter(l => !syncedIds.has(l.id) && l.isLocalOnly && !deletedSet.has(l.id) && !deletedSet.has(l.src));
      const combined = [...parsed, ...unSynced];

      setLocalMoments(combined);
      return combined;
    }
  } catch (err) {
    console.warn('Network error fetching moments, returning local cache:', err);
  }

  const cleanLocal = local.filter(l => !deletedSet.has(l.id) && !deletedSet.has(l.src));
  return cleanLocal;
}

/**
 * Add a new moment to the gallery
 */
export async function addMoment({ title, subtitle, category, tag, description, imageFile, imageUrl }) {
  let finalSrc = imageUrl;
  let storagePath = '';

  if (imageFile) {
    const uploadRes = await uploadMomentImage(imageFile);
    finalSrc = uploadRes.url;
    storagePath = uploadRes.path;
  }

  if (!finalSrc) {
    throw new Error('Please select an image to upload.');
  }

  const id = 'moment_' + Date.now();
  const rotateValues = [-1.5, -1.2, -0.8, 0, 0.8, 1.2, 1.5, 1.8];
  const randomRotate = rotateValues[Math.floor(Math.random() * rotateValues.length)];

  const colors = [
    { bg: '#fff7ed', border: '#fed7aa' },
    { bg: '#eff6ff', border: '#bfdbfe' },
    { bg: '#fdf2f8', border: '#fbcfe8' },
    { bg: '#f0fdf4', border: '#bbf7d0' },
    { bg: '#faf5ff', border: '#e9d5ff' },
    { bg: '#fefce8', border: '#fef08a' },
  ];
  const chosenColor = colors[Math.floor(Math.random() * colors.length)];

  const momentRecord = {
    id,
    title: (title || 'HAXLR8 Hackathon Moment').trim(),
    subtitle: (subtitle || 'Maharaja Institute of Technology Mysore • ECE Department').trim(),
    category: category || 'ceremony',
    tag: (tag || 'HAXLR8 MOMENT').toUpperCase().trim(),
    src: finalSrc,
    storagePath,
    description: (description || 'Special memory captured during HAXLR8 3.0 at MIT Mysore.').trim(),
    rotate: randomRotate,
    bg: chosenColor.bg,
    border: chosenColor.border,
    created_at: new Date().toISOString()
  };

  // 1. Optimistically save to local cache
  const current = getLocalMoments();
  const updatedLocal = [{ ...momentRecord, isLocalOnly: true }, ...current];
  setLocalMoments(updatedLocal);

  // 2. Persist to Supabase
  try {
    // Try public.moments table first
    const { data: mData, error: mErr } = await supabase
      .from('moments')
      .insert([momentRecord])
      .select()
      .single();

    if (!mErr && mData) {
      momentRecord.dbId = mData.id;
      delete momentRecord.isLocalOnly;
      setLocalMoments([momentRecord, ...current]);
      return momentRecord;
    }

    // Fallback: save to announcements with tag 'MOMENT'
    const { data: aData, error: aErr } = await supabase
      .from('announcements')
      .insert([{
        title: momentRecord.title,
        message: momentRecord.description,
        content: JSON.stringify(momentRecord),
        tag: 'MOMENT'
      }])
      .select()
      .single();

    if (!aErr && aData) {
      momentRecord.dbId = aData.id;
      delete momentRecord.isLocalOnly;
      setLocalMoments([momentRecord, ...current]);
      return momentRecord;
    }
  } catch (err) {
    console.warn('Network error saving moment to database, kept in local cache:', err);
  }

  return momentRecord;
}

/**
 * Delete a moment from gallery
 */
export async function deleteMoment(moment) {
  if (!moment) return;

  const momentId = moment.id;
  const dbId = moment.dbId;
  const storagePath = moment.storagePath;

  // 1. Maintain persistent tombstone list in localStorage
  try {
    const deletedRaw = localStorage.getItem('haxlr8_deleted_moments');
    const deletedList = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (momentId && !deletedList.includes(momentId)) deletedList.push(momentId);
    if (moment.src && !deletedList.includes(moment.src)) deletedList.push(moment.src);
    if (dbId && !deletedList.includes(String(dbId))) deletedList.push(String(dbId));
    localStorage.setItem('haxlr8_deleted_moments', JSON.stringify(deletedList));
  } catch (e) {}

  // 2. Remove immediately from local cache
  const current = getLocalMoments();
  const filtered = current.filter(m => m.id !== momentId && m.src !== moment.src && m.dbId !== dbId);
  setLocalMoments(filtered);

  // 3. Update Supabase backend:
  // Note: Supabase RLS policies may disallow DELETE for anon, but permit UPDATE.
  // By updating the tag to 'MOMENT_DELETED', queries searching for tag='MOMENT' will never return it!
  try {
    if (dbId) {
      await supabase
        .from('announcements')
        .update({
          tag: 'MOMENT_DELETED',
          title: '[DELETED_MOMENT]',
          message: 'DELETED',
          content: JSON.stringify({ isDeleted: true, id: momentId, deletedAt: new Date().toISOString() })
        })
        .eq('id', dbId);
      
      // Also try hard delete in case policy allows
      await supabase.from('announcements').delete().eq('id', dbId);
    }

    // Also scan all announcements tagged MOMENT to catch this item by ID, src, or title
    const { data: rows } = await supabase
      .from('announcements')
      .select('id, content, title')
      .eq('tag', 'MOMENT');

    if (rows && rows.length > 0) {
      for (const r of rows) {
        const matchesId = Boolean(momentId && r.content && r.content.includes(momentId));
        const matchesSrc = Boolean(moment.src && r.content && r.content.includes(moment.src));
        const matchesDbId = Boolean(dbId && r.id === dbId);

        if (matchesId || matchesSrc || matchesDbId) {
          await supabase
            .from('announcements')
            .update({
              tag: 'MOMENT_DELETED',
              title: '[DELETED_MOMENT]',
              message: 'DELETED',
              content: JSON.stringify({ isDeleted: true, id: momentId, deletedAt: new Date().toISOString() })
            })
            .eq('id', r.id);
          await supabase.from('announcements').delete().eq('id', r.id);
        }
      }
    }

    // Try deleting from storage
    if (storagePath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    } else if (moment.src && moment.src.includes('/moments/')) {
      const extractedPath = moment.src.split('/moments/')[1];
      if (extractedPath) {
        await supabase.storage.from(STORAGE_BUCKET).remove([`moments/${extractedPath}`]);
      }
    }
  } catch (err) {
    console.warn('Error deleting moment from backend:', err);
  }
}
