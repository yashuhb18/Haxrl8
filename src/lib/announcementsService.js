import { supabase } from './supabaseClient';

/**
 * Validates whether an announcement row is an authentic, human-broadcasted announcement
 * versus an internal metadata configuration or deleted moment.
 */
export function isRealAnnouncement(a) {
  if (!a) return false;
  const tag = (a.tag || '').toUpperCase().trim();
  const title = (a.title || '').trim();

  // Exclude internal configuration & moments storage tags
  if (
    tag.startsWith('MOMENT') ||
    tag.endsWith('_CONFIG') ||
    tag.endsWith('_REGISTRY') ||
    tag.startsWith('DELETED') ||
    tag === 'CLOUDINARY_CONFIG' ||
    tag === 'COORDINATORS_CONFIG' ||
    tag === 'DOCUMENTS_REGISTRY'
  ) {
    return false;
  }

  // Exclude internal titles or deleted placeholders
  if (
    title.startsWith('[DELETED') ||
    title.includes('DELETED_MOMENT') ||
    title.includes('[DELETED_') ||
    title.toLowerCase().includes('registry') ||
    title.toLowerCase().includes('coordinators config') ||
    title.toLowerCase().includes('cloudinary config')
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
