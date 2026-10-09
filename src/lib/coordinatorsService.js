import { supabase } from './supabaseClient';
import { isCloudinaryConfigured, uploadToCloudinary } from './cloudinaryService';
import balakrishnaImg from '../assets/humans/balakrishna.png';
import sandeshImg from '../assets/humans/sandesh.jpg';
import yashwanthImg from '../assets/humans/yashwanth.png';

export const DEFAULT_FACULTY_COORDINATORS = [
  {
    id: 'fac_1',
    name: 'Balakrishna K',
    role: 'Faculty Coordinator',
    type: 'faculty',
    designation: 'Associate Prof & HoD, Dept of ECE',
    station: 'Flight Director // Mission Advisor',
    org: 'Maharaja Institute of Technology Mysore',
    phone: '+91 98864 78574',
    badge: 'HOD & ASSOCIATE PROFESSOR',
    color: 'lime',
    hat: 'crown',
    crewColor: '#16a34a',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    defaultPhoto: balakrishnaImg,
    photo: null, // will fall back to defaultPhoto if null
  },
  {
    id: 'fac_2',
    name: 'Sandesh NG',
    role: 'Faculty Coordinator',
    type: 'faculty',
    designation: 'Assistant Professor, Dept of ECE',
    station: 'Flight Director // Mission Advisor',
    org: 'Maharaja Institute of Technology Mysore',
    phone: '+91 94813 36585',
    badge: 'ASSISTANT PROFESSOR',
    color: 'purple',
    hat: 'crown',
    crewColor: '#9333ea',
    bg: '#faf5ff',
    border: '#e9d5ff',
    defaultPhoto: sandeshImg,
    photo: null,
  },
];

export const DEFAULT_STUDENT_COORDINATORS = [
  {
    id: 'stu_1',
    name: 'Yashwanth H B',
    role: 'Student Coordinator',
    type: 'student',
    station: 'Chief Flight Engineer & Tech Lead',
    org: 'HAXLR8 3.0 · MIT Mysore',
    phone: '+91 80506 14849',
    badge: 'CHIEF COORDINATOR & TECH LEAD',
    color: 'cyan',
    hat: 'pilot',
    crewColor: '#0284c7',
    bg: '#e0f2fe',
    border: '#7dd3fc',
    defaultPhoto: yashwanthImg,
    photo: null,
  },
  {
    id: 'stu_2',
    name: 'Chethan Kumar B',
    role: 'Student Coordinator',
    type: 'student',
    station: 'Mission Operations Lead',
    org: 'HAXLR8 3.0 · MIT Mysore',
    phone: '+91 99455 07099',
    badge: 'STUDENT COORDINATOR',
    color: 'yellow',
    hat: 'pilot',
    crewColor: '#16a34a',
    bg: '#dcfce7',
    border: '#86efac',
    defaultPhoto: null,
    photo: null,
  },
];

const STORAGE_KEY = 'haxlr8_dynamic_coordinators';
const ANNOUNCEMENT_TAG = 'COORDINATORS_CONFIG';

/**
 * Returns merged coordinators synchronously from localStorage or defaults
 */
export function getLocalCoordinators() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (Array.isArray(parsed.faculty) || Array.isArray(parsed.students))) {
        return {
          faculty: (parsed.faculty || []).map(mergeFacultyDefaults),
          students: (parsed.students || []).map(mergeStudentDefaults),
        };
      }
    }
  } catch (e) {
    console.warn('Error reading local coordinators:', e);
  }

  return {
    faculty: DEFAULT_FACULTY_COORDINATORS.map(c => ({ ...c })),
    students: DEFAULT_STUDENT_COORDINATORS.map(c => ({ ...c })),
  };
}

function resolvePhotoField(photo, defaultPhoto) {
  if (photo === null) return null;
  if (typeof photo === 'string') {
    if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:')) {
      return photo;
    }
    // Stale hashed build assets fallback to current active imported image
    if (photo.startsWith('/assets/')) {
      return defaultPhoto || photo;
    }
  }
  return photo !== undefined ? photo : (defaultPhoto || null);
}

function mergeFacultyDefaults(item) {
  const def = DEFAULT_FACULTY_COORDINATORS.find(d => d.id === item.id) || {};
  return {
    ...def,
    ...item,
    photo: resolvePhotoField(item.photo, def.defaultPhoto),
  };
}

function mergeStudentDefaults(item) {
  const def = DEFAULT_STUDENT_COORDINATORS.find(d => d.id === item.id) || {};
  return {
    ...def,
    ...item,
    photo: resolvePhotoField(item.photo, def.defaultPhoto),
  };
}

/**
 * Fetch coordinators configuration from Supabase and sync with localStorage
 */
export async function fetchCoordinators() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('tag', ANNOUNCEMENT_TAG)
      .limit(1);

    if (!error && data && data.length > 0) {
      const row = data[0];
      let config = null;
      try {
        config = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
      } catch (e) {
        console.warn('Failed to parse coordinators row content:', e);
      }

      if (config && (Array.isArray(config.faculty) || Array.isArray(config.students))) {
        const merged = {
          faculty: (config.faculty || []).map(mergeFacultyDefaults),
          students: (config.students || []).map(mergeStudentDefaults),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (_) {}
        return merged;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch coordinators failed, using local cache:', err);
  }

  return getLocalCoordinators();
}

/**
 * Save faculty and student coordinators to Supabase and localStorage
 */
export async function saveCoordinators({ faculty, students }) {
  const payload = { faculty, students };

  // Save locally first
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {}

  // Dispatch live update event
  window.dispatchEvent(new CustomEvent('haxlr8_coordinators_updated', {
    detail: payload
  }));

  // Sync to Supabase
  try {
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('tag', ANNOUNCEMENT_TAG)
      .limit(1);

    const contentStr = JSON.stringify(payload);

    if (existing && existing.length > 0) {
      const { error: updateError } = await supabase
        .from('announcements')
        .update({
          title: 'HAXLR8 Coordinators Registry',
          message: 'Registry config for website faculty and student coordinators',
          content: contentStr,
        })
        .eq('id', existing[0].id);

      if (updateError) {
        console.warn('Supabase coordinators update error:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('announcements')
        .insert([{
          title: 'HAXLR8 Coordinators Registry',
          tag: ANNOUNCEMENT_TAG,
          message: 'Registry config for website faculty and student coordinators',
          content: contentStr,
        }]);

      if (insertError) {
        console.warn('Supabase coordinators insert error:', insertError);
        throw insertError;
      }
    }
  } catch (err) {
    console.warn('Supabase cloud sync failed, but localStorage is saved:', err);
  }

  return payload;
}

/**
 * Upload a coordinator's photo to Supabase Storage and get public URL
 */
export async function uploadCoordinatorPhoto(file, coordinatorId) {
  if (!file) throw new Error('No file provided');

  // 1. Prioritize Cloudinary if configured
  if (isCloudinaryConfigured()) {
    try {
      const cloudRes = await uploadToCloudinary(file, { folder: 'haxlr8_coordinators' });
      if (cloudRes?.secureUrl) {
        return cloudRes.secureUrl;
      }
    } catch (cErr) {
      console.warn('Cloudinary coordinator photo upload notice, falling back to Supabase:', cErr);
    }
  }

  // 2. Supabase Storage fallback
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanId = String(coordinatorId || 'coord').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `coord_${cleanId}_${Date.now()}.${fileExt}`;
  const filePath = `coordinators/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('id-cards')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error, falling back to base64:', error);
      return await fileToBase64(file);
    }

    const { data: pubData } = supabase.storage
      .from('id-cards')
      .getPublicUrl(data.path);

    if (pubData && pubData.publicUrl) {
      return pubData.publicUrl;
    }
  } catch (err) {
    console.warn('Storage upload exception, falling back to base64:', err);
  }

  return await fileToBase64(file);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Reset coordinators back to default setup
 */
export async function resetCoordinatorsToDefault() {
  const def = {
    faculty: DEFAULT_FACULTY_COORDINATORS.map(c => ({ ...c })),
    students: DEFAULT_STUDENT_COORDINATORS.map(c => ({ ...c })),
  };
  return await saveCoordinators(def);
}
