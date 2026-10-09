import { supabase } from './supabaseClient';

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

  // Fallback to compressed base64 if storage call failed
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

  try {
    // 1. Try public.moments table if available
    const { data: momentsData, error: mErr } = await supabase
      .from('moments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!mErr && momentsData && Array.isArray(momentsData)) {
      setLocalMoments(momentsData);
      return momentsData;
    }

    // 2. Fallback to announcements with tag 'MOMENT'
    const { data: annData, error: aErr } = await supabase
      .from('announcements')
      .select('*')
      .eq('tag', 'MOMENT')
      .order('created_at', { ascending: false });

    if (!aErr && annData && Array.isArray(annData)) {
      const parsed = annData.map(item => {
        try {
          const detail = item.content ? JSON.parse(item.content) : {};
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
          return {
            id: `moment_${item.id}`,
            dbId: item.id,
            title: item.title,
            subtitle: item.message || 'MIT Mysore',
            category: 'ceremony',
            tag: 'MOMENT',
            src: '',
            description: item.message || '',
            created_at: item.created_at
          };
        }
      }).filter(m => Boolean(m.src));

      // Combine with any local-only moments not yet synced
      const syncedIds = new Set(parsed.map(p => p.id));
      const unSynced = local.filter(l => !syncedIds.has(l.id) && l.isLocalOnly);
      const combined = [...parsed, ...unSynced];

      setLocalMoments(combined);
      return combined;
    }
  } catch (err) {
    console.warn('Network error fetching moments, returning local cache:', err);
  }

  return local;
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

  // 1. Remove from local cache
  const current = getLocalMoments();
  const filtered = current.filter(m => m.id !== moment.id);
  setLocalMoments(filtered);

  // 2. Remove from Supabase
  try {
    if (moment.dbId) {
      // Try deleting from announcements
      await supabase.from('announcements').delete().eq('id', moment.dbId);
      // Also try moments table if it was saved there
      await supabase.from('moments').delete().eq('id', moment.dbId);
    }

    // Try deleting from storage
    if (moment.storagePath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([moment.storagePath]);
    }
  } catch (err) {
    console.warn('Error deleting moment from backend:', err);
  }
}
