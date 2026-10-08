import { supabase } from '../../lib/supabaseClient';

export const ORGANIZER_SESSION_KEY = 'haxlr8_organizer_session';
export const ORGANIZER_TIMESTAMP_KEY = 'haxlr8_organizer_timestamp';
export const ADMIN_IDLE_TIMEOUT_MS = 60 * 1000; // 1-minute security auto-logout

export const isOrganizerAuthorized = async () => {
  // Purge any legacy indefinite localStorage tokens
  localStorage.removeItem(ORGANIZER_SESSION_KEY);
  localStorage.removeItem(ORGANIZER_TIMESTAMP_KEY);

  const hasToken = sessionStorage.getItem(ORGANIZER_SESSION_KEY) === 'active';
  const timestamp = parseInt(sessionStorage.getItem(ORGANIZER_TIMESTAMP_KEY) || '0', 10);
  
  if (!hasToken || !timestamp) return false;
  
  // If idle for more than 1 minute, auto-logout
  if (Date.now() - timestamp >= ADMIN_IDLE_TIMEOUT_MS) {
    await organizerLogout();
    return false;
  }
  
  // Update timestamp to maintain active state
  sessionStorage.setItem(ORGANIZER_TIMESTAMP_KEY, Date.now().toString());
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

