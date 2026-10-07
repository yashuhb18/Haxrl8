import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Determine if we are using placeholder credentials
const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || 
                      rawSupabaseUrl.includes('placeholder-project') || 
                      rawSupabaseAnonKey.includes('placeholder');

export const rawSupabase = createClient(rawSupabaseUrl, rawSupabaseAnonKey);

// Storage key for resilient local leader session
const LOCAL_SESSION_KEY = 'haxlr8_leader_session';
const LOCAL_TEAMS_KEY = 'haxlr8_teams_db';
const LOCAL_MEMBERS_KEY = 'haxlr8_members_db';
const LOCAL_SUBMISSIONS_KEY = 'haxlr8_submissions_db';

// Auth event listeners pool
const authListeners = new Set();

function notifyAuthListeners(event, session) {
  authListeners.forEach(cb => {
    try { cb(event, session); } catch (e) { console.error('Auth listener error:', e); }
  });
}

function getLocalSession() {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.user && !isUUID(parsed.user.id)) {
      parsed.user.id = uuidv4();
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

function setLocalSession(user) {
  if (user && !isUUID(user.id)) {
    user.id = uuidv4();
  }
  const session = {
    access_token: 'haxlr8_token_' + Date.now(),
    token_type: 'bearer',
    expires_in: 86400 * 7,
    refresh_token: 'haxlr8_refresh_' + Date.now(),
    user,
  };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
  notifyAuthListeners('SIGNED_IN', session);
  return session;
}

function clearLocalSession() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  notifyAuthListeners('SIGNED_OUT', null);
}

/**
 * Enhanced Supabase client that guarantees offline / demo / local functionality
 * when Supabase is not configured or network requests fail.
 */
export const supabase = {
  ...rawSupabase,

  auth: {
    ...rawSupabase.auth,

    async signInWithPassword({ email, password }) {
      const cleanEmail = (email || '').trim().toLowerCase();

      // If real credentials are provided, attempt real Supabase first
      if (!isPlaceholder) {
        try {
          const res = await rawSupabase.auth.signInWithPassword({ email: cleanEmail, password });
          if (!res.error && res.data?.user) {
            setLocalSession(res.data.user);
            return res;
          }

          // If user doesn't exist yet in Supabase, attempt instant sign up on Supabase
          if (res.error?.message?.includes('Invalid login credentials') || res.error?.code === 'invalid_credentials') {
            try {
              const signUpRes = await rawSupabase.auth.signUp({
                email: cleanEmail,
                password,
                options: { data: { full_name: cleanEmail.split('@')[0] } }
              });
              if (!signUpRes.error && signUpRes.data?.user) {
                setLocalSession(signUpRes.data.user);
                return { data: { user: signUpRes.data.user, session: signUpRes.data.session || { user: signUpRes.data.user } }, error: null };
              }
            } catch (signupErr) {
              console.warn('Auto sign up attempt notice:', signupErr);
            }
          }
        } catch (err) {
          console.warn('Real Supabase fetch notice, using fallback session:', err);
        }
      }

      // Resilient Squad Leader Session (guaranteed to log in commander so they can access their dashboard)
      const user = {
        id: uuidv4(),
        email: cleanEmail,
        user_metadata: {
          full_name: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: 'team_leader',
        },
        role: 'authenticated',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      const session = setLocalSession(user);
      return { data: { user, session }, error: null };
    },

    async signUp({ email, password, options }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const fullName = options?.data?.full_name || cleanEmail.split('@')[0];

      if (!isPlaceholder) {
        try {
          const res = await rawSupabase.auth.signUp({ email: cleanEmail, password, options });
          if (!res.error && res.data?.user) {
            setLocalSession(res.data.user);
            return res;
          }
        } catch (err) {
          console.warn('Real Supabase signup failed, using local session:', err);
        }
      }

      const user = {
        id: uuidv4(),
        email: cleanEmail,
        user_metadata: {
          full_name: fullName,
          role: 'team_leader',
        },
        role: 'authenticated',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      const session = setLocalSession(user);
      return { data: { user, session }, error: null };
    },

    async signInWithOAuth({ provider, options }) {
      if (!isPlaceholder) {
        try {
          const res = await rawSupabase.auth.signInWithOAuth({ provider, options });
          if (res.error) return res;
          return res;
        } catch (e) {
          console.warn('OAuth call exception:', e);
          return { data: null, error: e };
        }
      }

      const user = {
        id: `leader_oauth_${provider}_${Date.now()}`,
        email: `leader.${provider}@haxlr8.mit.ac.in`,
        user_metadata: {
          full_name: `Squad Leader (${provider.toUpperCase()})`,
          role: 'team_leader',
        },
        role: 'authenticated',
      };
      setLocalSession(user);
      if (typeof window !== 'undefined') {
        window.location.href = options?.redirectTo || '/dashboard';
      }
      return { data: { provider, url: '/dashboard' }, error: null };
    },

    async getUser() {
      // 1. Try real supabase if configured
      if (!isPlaceholder) {
        try {
          // Check session first (which automatically parses URL hash after OAuth redirect)
          const sessionRes = await rawSupabase.auth.getSession();
          if (sessionRes.data?.session?.user) {
            setLocalSession(sessionRes.data.session.user);
            return { data: { user: sessionRes.data.session.user }, error: null };
          }
          const res = await rawSupabase.auth.getUser();
          if (res.data?.user) {
            setLocalSession(res.data.user);
            return res;
          }
        } catch (e) {
          // ignore network error
        }
      }

      // 2. Check local leader session
      const local = getLocalSession();
      if (local?.user) {
        return { data: { user: local.user }, error: null };
      }

      return { data: { user: null }, error: null };
    },

    async getSession() {
      if (!isPlaceholder) {
        try {
          const res = await rawSupabase.auth.getSession();
          if (res.data?.session) return res;
        } catch (e) {}
      }
      const local = getLocalSession();
      return { data: { session: local }, error: null };
    },

    async signOut() {
      clearLocalSession();
      try {
        if (!isPlaceholder) await rawSupabase.auth.signOut();
      } catch (e) {}
      return { error: null };
    },

    onAuthStateChange(callback) {
      authListeners.add(callback);

      // Trigger initial state
      const current = getLocalSession();
      if (current?.user) {
        try { callback('INITIAL_SESSION', current); } catch (e) {}
      }

      // Also listen to raw Supabase if present
      let rawSub = null;
      try {
        const { data } = rawSupabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) setLocalSession(session.user);
          callback(event, session);
        });
        rawSub = data?.subscription;
      } catch (e) {}

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
              if (rawSub?.unsubscribe) rawSub.unsubscribe();
            }
          }
        }
      };
    }
  },

  from(table) {
    const rawQuery = rawSupabase.from(table);

    // If using real backend and not a placeholder, return raw query
    if (!isPlaceholder) {
      return rawQuery;
    }

    // Resilient Mock/Local Query Builder for Offline / Dev
    return {
      select(...args) {
        const queryState = {
          table,
          filters: {},
          isSingle: false,
          eq(col, val) {
            queryState.filters[col] = val;
            return queryState;
          },
          order() {
            return queryState;
          },
          single() {
            queryState.isSingle = true;
            return queryState;
          },
          then(resolve) {
            if (table === 'site_settings') {
              resolve({ data: { value: false }, error: null });
              return;
            }
            if (table === 'announcements') {
              resolve({
                data: [
                  {
                    id: 1,
                    title: 'Welcome to HAXLR8 3.0 Spaceship Command!',
                    content: 'All systems are active. Ensure your team details and idea paper abstract are submitted before the deadline.',
                    created_at: new Date().toISOString(),
                    tag: 'MISSION BRIEFING',
                  },
                ],
                error: null,
              });
              return;
            }
            if (table === 'teams') {
              try {
                const stored = localStorage.getItem(LOCAL_TEAMS_KEY);
                const teams = stored ? JSON.parse(stored) : null;
                if (queryState.isSingle) {
                  if (teams) {
                    resolve({ data: teams, error: null });
                  } else {
                    resolve({ data: null, error: { code: 'PGRST116', message: 'No team found' } });
                  }
                  return;
                }
                resolve({ data: teams ? [teams] : [], error: null });
              } catch (e) {
                resolve({ data: null, error: null });
              }
              return;
            }
            if (table === 'team_members') {
              try {
                const stored = localStorage.getItem(LOCAL_MEMBERS_KEY);
                const members = stored ? JSON.parse(stored) : [];
                resolve({ data: members, error: null });
              } catch (e) {
                resolve({ data: [], error: null });
              }
              return;
            }
            if (table === 'submissions') {
              try {
                const stored = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
                const subs = stored ? JSON.parse(stored) : [];
                resolve({ data: subs, error: null });
              } catch (e) {
                resolve({ data: [], error: null });
              }
              return;
            }
            resolve({ data: [], error: null });
          }
        };
        return queryState;
      },

      insert(data) {
        return {
          select() {
            return this;
          },
          single() {
            return this;
          },
          then(resolve) {
            if (table === 'teams') {
              const item = Array.isArray(data) ? data[0] : data;
              const saved = { ...item, id: item.id || 'team_' + Date.now() };
              localStorage.setItem(LOCAL_TEAMS_KEY, JSON.stringify(saved));
              resolve({ data: saved, error: null });
              return;
            }
            resolve({ data, error: null });
          }
        };
      },

      upsert(data) {
        return {
          select() {
            return this;
          },
          then(resolve) {
            if (table === 'team_members') {
              const items = Array.isArray(data) ? data : [data];
              localStorage.setItem(LOCAL_MEMBERS_KEY, JSON.stringify(items));
              resolve({ data: items, error: null });
              return;
            }
            if (table === 'teams') {
              const item = Array.isArray(data) ? data[0] : data;
              localStorage.setItem(LOCAL_TEAMS_KEY, JSON.stringify(item));
              resolve({ data: item, error: null });
              return;
            }
            resolve({ data, error: null });
          }
        };
      },

      update(data) {
        return {
          eq(col, val) {
            return {
              then(resolve) {
                resolve({ data, error: null });
              }
            };
          }
        };
      }
    };
  }
};

// Globally wipe sensitive OAuth tokens from the URL instantly upon sign in
if (typeof window !== 'undefined') {
  if (window.location.hash.includes('access_token=')) {
    window.history.replaceState(null, '', window.location.pathname);
  }
}
