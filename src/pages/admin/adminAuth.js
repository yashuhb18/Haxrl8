import { supabase } from '../../lib/supabaseClient';

export const ORGANIZER_SESSION_KEY = 'haxlr8_organizer_session';
export const ORGANIZER_TIMESTAMP_KEY = 'haxlr8_organizer_timestamp';

export const isOrganizerAuthorized = async () => {
  // Check localStorage and sessionStorage for persistent admin login
  try {
    const lToken = localStorage.getItem(ORGANIZER_SESSION_KEY);
    if (lToken === 'active') return true;
  } catch (e) {}

  try {
    const sToken = sessionStorage.getItem(ORGANIZER_SESSION_KEY);
    if (sToken === 'active') return true;
  } catch (e) {}
  
  return false;
};

export const organizerLogout = async () => {
  try { sessionStorage.removeItem(ORGANIZER_SESSION_KEY); } catch (e) {}
  try { sessionStorage.removeItem(ORGANIZER_TIMESTAMP_KEY); } catch (e) {}
  try { localStorage.removeItem(ORGANIZER_SESSION_KEY); } catch (e) {}
  try { localStorage.removeItem(ORGANIZER_TIMESTAMP_KEY); } catch (e) {}
  try {
    await supabase.auth.signOut();
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('haxlr8_organizer_logout'));
  }
};

