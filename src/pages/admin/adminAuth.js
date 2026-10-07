import { supabase } from '../../lib/supabaseClient';

export const ORGANIZER_SESSION_KEY = 'haxlr8_organizer_session';

export const isOrganizerAuthorized = async () => {
  // Check explicit active session in sessionStorage or localStorage
  const hasToken = sessionStorage.getItem(ORGANIZER_SESSION_KEY) === 'active' ||
                   localStorage.getItem(ORGANIZER_SESSION_KEY) === 'active';
  return hasToken;
};

export const organizerLogout = async () => {
  sessionStorage.removeItem(ORGANIZER_SESSION_KEY);
  localStorage.removeItem(ORGANIZER_SESSION_KEY);
  try {
    await supabase.auth.signOut();
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('haxlr8_organizer_logout'));
  }
};

