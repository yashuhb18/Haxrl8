import { supabase } from '../../lib/supabaseClient';

export const ORGANIZER_SESSION_KEY = 'haxlr8_organizer_session';
export const ORGANIZER_TIMESTAMP_KEY = 'haxlr8_organizer_timestamp';
export const ADMIN_IDLE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8-hour session window for mobile & desktop organizers

export const isOrganizerAuthorized = async () => {
  // Check sessionStorage first, then fallback to localStorage (essential for mobile browser tab switching)
  let hasToken = false;
  let timestamp = 0;

  try {
    const sToken = sessionStorage.getItem(ORGANIZER_SESSION_KEY);
    const sTime = parseInt(sessionStorage.getItem(ORGANIZER_TIMESTAMP_KEY) || '0', 10);
    if (sToken === 'active' && sTime) {
      hasToken = true;
      timestamp = sTime;
    }
  } catch (e) {}

  if (!hasToken) {
    try {
      const lToken = localStorage.getItem(ORGANIZER_SESSION_KEY);
      const lTime = parseInt(localStorage.getItem(ORGANIZER_TIMESTAMP_KEY) || '0', 10);
      if (lToken === 'active' && lTime) {
        hasToken = true;
        timestamp = lTime;
      }
    } catch (e) {}
  }
  
  if (!hasToken || !timestamp) return false;
  
  // If session expired beyond window, auto-logout
  if (Date.now() - timestamp >= ADMIN_IDLE_TIMEOUT_MS) {
    await organizerLogout();
    return false;
  }
  
  // Update timestamp to maintain active state across storage
  const nowStr = Date.now().toString();
  try { sessionStorage.setItem(ORGANIZER_TIMESTAMP_KEY, nowStr); } catch (e) {}
  try { localStorage.setItem(ORGANIZER_TIMESTAMP_KEY, nowStr); } catch (e) {}
  return true;
};

export const organizerLogout = async () => {
  sessionStorage.removeItem(ORGANIZER_SESSION_KEY);
  sessionStorage.removeItem(ORGANIZER_TIMESTAMP_KEY);
  localStorage.removeItem(ORGANIZER_SESSION_KEY);
  localStorage.removeItem(ORGANIZER_TIMESTAMP_KEY);
  try {
    await supabase.auth.signOut();
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('haxlr8_organizer_logout'));
  }
};

