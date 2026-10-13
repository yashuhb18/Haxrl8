import { supabase } from './supabaseClient';

const SQUADRONS_STORAGE_KEY = 'haxlr8_crew_squadrons_config';
const SQUADRONS_TAG = 'CREW_SQUADRONS_CONFIG';

export const DEFAULT_SQUADRONS_CONFIG = {
  mode: 'auto', // 'auto' | 'custom' | 'boost'
  customCount: 0,
  boostOffset: 0,
  updatedAt: null,
  updatedBy: 'Admin',
};

/**
 * Read locally cached squadrons configuration
 */
export function getLocalSquadronsConfig() {
  try {
    const raw = localStorage.getItem(SQUADRONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_SQUADRONS_CONFIG,
          ...parsed,
        };
      }
    }
  } catch (e) {
    console.warn('Error reading local squadrons config:', e);
  }
  return DEFAULT_SQUADRONS_CONFIG;
}

/**
 * Save squadrons configuration to local storage and dispatch cross-tab event
 */
export function setLocalSquadronsConfig(config) {
  try {
    const safeConfig = {
      ...DEFAULT_SQUADRONS_CONFIG,
      ...config,
      updatedAt: config?.updatedAt || new Date().toISOString(),
    };
    localStorage.setItem(SQUADRONS_STORAGE_KEY, JSON.stringify(safeConfig));
    window.dispatchEvent(new CustomEvent('haxlr8_squadrons_config_updated', { detail: safeConfig }));
    return safeConfig;
  } catch (e) {
    console.warn('Error saving local squadrons config:', e);
    return config;
  }
}

/**
 * Resolves the final displayed number of crew squadrons
 * @param {number} rawDbCount - Actual teams count from database
 * @param {object} config - Configuration object
 * @returns {number}
 */
export function resolveDisplaySquadrons(rawDbCount = 0, config = null) {
  const cfg = config || getLocalSquadronsConfig();
  const dbCount = Number(rawDbCount) || 0;

  if (cfg.mode === 'custom' && typeof cfg.customCount === 'number') {
    return Math.max(0, cfg.customCount);
  }

  if (cfg.mode === 'boost' && typeof cfg.boostOffset === 'number') {
    return Math.max(0, dbCount + cfg.boostOffset);
  }

  // If customCount was manually set > 0, respect it if mode is not strictly auto
  if (cfg.mode !== 'auto' && cfg.customCount > 0) {
    return cfg.customCount;
  }

  return dbCount;
}

/**
 * Fetch squadrons configuration from Supabase announcements cloud registry
 */
export async function fetchSquadronsConfig() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, content, created_at')
      .eq('tag', SQUADRONS_TAG)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && data && data[0]?.content) {
      try {
        const parsed = JSON.parse(data[0].content);
        if (parsed && typeof parsed === 'object') {
          return setLocalSquadronsConfig(parsed);
        }
      } catch (parseErr) {
        console.warn('Error parsing cloud squadrons config content:', parseErr);
      }
    }
  } catch (err) {
    console.warn('Supabase fetchSquadronsConfig notice:', err);
  }

  return getLocalSquadronsConfig();
}

/**
 * Realtime subscription to squadrons config updates across all devices
 */
export function subscribeToSquadronsConfig(onUpdate) {
  try {
    const channel = supabase
      .channel('public:crew_squadrons_config_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
          filter: `tag=eq.${SQUADRONS_TAG}`
        },
        (payload) => {
          if (payload.new && payload.new.content) {
            try {
              const parsed = JSON.parse(payload.new.content);
              if (parsed && typeof parsed === 'object') {
                const saved = setLocalSquadronsConfig(parsed);
                if (typeof onUpdate === 'function') onUpdate(saved);
              }
            } catch (err) {
              console.warn('Error parsing realtime squadrons payload:', err);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Failed to subscribe to squadrons config realtime:', err);
    return () => {};
  }
}

/**
 * Save & publish squadrons configuration to Supabase cloud and broadcast to all users
 */
export async function saveSquadronsConfig(config) {
  const safeConfig = {
    ...DEFAULT_SQUADRONS_CONFIG,
    ...config,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save locally first for instant UI response
  setLocalSquadronsConfig(safeConfig);

  // 2. Persist to Supabase cloud
  try {
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('tag', SQUADRONS_TAG)
      .limit(1);

    const payloadStr = JSON.stringify(safeConfig);

    if (existing && existing.length > 0) {
      const { error } = await supabase
        .from('announcements')
        .update({
          title: 'HAXLR8 Crew Squadrons Config',
          message: 'Public telemetry count for user dashboard',
          content: payloadStr,
        })
        .eq('id', existing[0].id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('announcements')
        .insert([{
          title: 'HAXLR8 Crew Squadrons Config',
          tag: SQUADRONS_TAG,
          message: 'Public telemetry count for user dashboard',
          content: payloadStr,
        }]);

      if (error) throw error;
    }

    return { success: true, config: safeConfig };
  } catch (cloudErr) {
    console.warn('Cloud saveSquadronsConfig error (local cached):', cloudErr);
    // Still succeeded locally
    return { success: true, config: safeConfig, warning: 'Saved locally. Cloud sync will retry on next connection.' };
  }
}
