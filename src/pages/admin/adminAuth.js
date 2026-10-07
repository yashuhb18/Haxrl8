import { supabase } from '../../lib/supabaseClient';

export const isOrganizerAuthorized = async () => {
  // 1. Check local / session master token
  const hasToken = sessionStorage.getItem('haxlr8_organizer_session') === 'active' ||
                   localStorage.getItem('haxlr8_organizer_session') === 'active';
  if (hasToken) return true;

  // 2. Check Supabase user
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    if (user.email === 'yashuhb18@gmail.com') {
      sessionStorage.setItem('haxlr8_organizer_session', 'active');
      return true;
    }
    const { data: adminList } = await supabase.from('admins').select('email').eq('email', user.email);
    if (adminList && adminList.length > 0) {
      sessionStorage.setItem('haxlr8_organizer_session', 'active');
      return true;
    }
  } catch (err) {
    console.warn('Admin check error:', err);
  }
  return false;
};
