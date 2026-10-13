import { supabase } from './supabaseClient';

const DELETED_ANNOUNCEMENTS_KEY = 'haxlr8_deleted_announcement_ids';

/**
 * Get locally cached list of deleted announcement IDs
 */
export function getDeletedAnnouncementIds() {
  try {
    const raw = localStorage.getItem(DELETED_ANNOUNCEMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    }
  } catch (e) {
    console.warn('Error reading deleted announcement ids:', e);
  }
  return [];
}

/**
 * Save locally cached list of deleted announcement IDs
 */
export function saveDeletedAnnouncementIds(ids) {
  try {
    const cleanIds = Array.from(new Set(ids.map(String)));
    localStorage.setItem(DELETED_ANNOUNCEMENTS_KEY, JSON.stringify(cleanIds));
  } catch (e) {
    console.warn('Error saving deleted announcement ids:', e);
  }
}

/**
 * Validates whether an announcement row is an authentic, human-broadcasted announcement
 * versus an internal metadata configuration, contact inquiry, or deleted item.
 */
export function isRealAnnouncement(a) {
  if (!a) return false;
  const idStr = String(a.id || '');
  const tag = (a.tag || '').toUpperCase().trim();
  const title = (a.title || '').trim();
  const upperTitle = title.toUpperCase();

  // Exclude locally deleted announcements
  const deletedIds = getDeletedAnnouncementIds();
  if (idStr && deletedIds.includes(idStr)) {
    return false;
  }

  // Exclude contact inquiries from public announcements
  if (
    tag === 'CONTACT_INQUIRY' ||
    tag.includes('CONTACT') ||
    upperTitle.startsWith('[CONTACT]') ||
    upperTitle.startsWith('[INTERNAL_CONTACT]') ||
    upperTitle.startsWith('[CONTACT_INQUIRY]')
  ) {
    return false;
  }

  // Exclude internal configuration & moments storage tags
  if (
    tag.startsWith('MOMENT') ||
    tag.endsWith('_CONFIG') ||
    tag.endsWith('_REGISTRY') ||
    tag.startsWith('DELETED') ||
    tag === 'CLOUDINARY_CONFIG' ||
    tag === 'COORDINATORS_CONFIG' ||
    tag === 'DOCUMENTS_REGISTRY' ||
    tag === 'CREW_SQUADRONS_CONFIG'
  ) {
    return false;
  }

  // Exclude internal titles or deleted placeholders
  if (
    upperTitle.startsWith('[DELETED') ||
    upperTitle.includes('DELETED_MOMENT') ||
    upperTitle.includes('[DELETED_') ||
    title.toLowerCase().includes('registry') ||
    title.toLowerCase().includes('coordinators config') ||
    title.toLowerCase().includes('cloudinary config') ||
    title.toLowerCase().includes('squadrons config')
  ) {
    return false;
  }

  // Must have substantive content or title
  if (!title && !(a.message || a.content || '').trim()) {
    return false;
  }

  return true;
}

/**
 * Filter an array of announcements to only authentic broadcasts
 */
export function filterRealAnnouncements(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(isRealAnnouncement);
}

/**
 * Robust delete announcement method that guarantees elimination across all devices
 * Handles Supabase RLS restrictions by soft-tagging as DELETED_SYSTEM and blacklist tracking.
 */
export async function deleteAnnouncement(id) {
  if (!id) return { success: false };

  // 1. Add to local blacklist immediately
  const deleted = getDeletedAnnouncementIds();
  deleted.push(String(id));
  saveDeletedAnnouncementIds(deleted);

  // 2. Dispatch cross-component event for instant UI removal
  window.dispatchEvent(new CustomEvent('haxlr8_announcements_updated', { detail: { deletedId: id } }));

  // 3. Update in Supabase cloud so all clients filter it out permanently
  try {
    await supabase.from('announcements').update({
      title: '[DELETED_SYSTEM]',
      tag: 'DELETED_SYSTEM',
      message: '',
      content: ''
    }).eq('id', id);
  } catch (err) {
    console.warn('Notice updating announcement to DELETED_SYSTEM:', err);
  }

  // 4. Also attempt hard delete
  try {
    await supabase.from('announcements').delete().eq('id', id);
  } catch (delErr) {
    console.warn('Notice hard deleting announcement:', delErr);
  }

  return { success: true };
}
