import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Check if a value is a valid RFC-4122 UUID
 */
export function isUUID(val) {
  if (!val || typeof val !== 'string') return false;
  return UUID_REGEX.test(val);
}

/**
 * Returns the value if it's already a valid UUID, otherwise generates a fresh UUID v4
 */
export function ensureUUID(val) {
  if (isUUID(val)) return val;
  return uuidv4();
}

/**
 * Automatically sync any locally stored squad, member, or submission data to Supabase PostgreSQL
 */
export async function syncLocalDataToSupabase() {
  try {
    // Purge legacy global keys to prevent data contamination across users
    try {
      localStorage.removeItem('haxlr8_teams_db');
      localStorage.removeItem('haxlr8_members_db');
      localStorage.removeItem('haxlr8_submissions_db');
    } catch (e) {}

    // Find any active session user
    const sessionRaw = localStorage.getItem('haxlr8_leader_session');
    let userId = null;
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        userId = parsed?.user?.id || parsed?.id;
      } catch (e) {}
    }

    if (!userId) return { synced: false, message: 'No authenticated user session to sync' };

    const rawTeam = localStorage.getItem(`haxlr8_team_${userId}`);
    const rawMembers = localStorage.getItem(`haxlr8_members_${userId}`);
    const rawSubs = localStorage.getItem(`haxlr8_subs_${userId}`);

    if (!rawTeam) return { synced: false, message: 'No local team to sync' };

    const localTeam = JSON.parse(rawTeam);
    if (!localTeam?.team_name) return { synced: false, message: 'Invalid local team' };

    // 1. Ensure valid UUID for Team & Leader
    const teamId = ensureUUID(localTeam.id);
    const leaderId = ensureUUID(localTeam.leader_id);

    // Upsert Team into Supabase
    const { data: dbTeam, error: teamErr } = await supabase.from('teams').upsert({
      id: teamId,
      leader_id: leaderId,
      team_name: localTeam.team_name,
      score: localTeam.score || 0
    }).select().single();

    if (teamErr) {
      console.warn('Sync team error:', teamErr);
    } else if (dbTeam) {
      localTeam.id = dbTeam.id;
      localTeam.leader_id = dbTeam.leader_id;
      localStorage.setItem(`haxlr8_team_${userId}`, JSON.stringify(localTeam));
    }

    // 2. Sync Members
    if (rawMembers) {
      const localMembers = JSON.parse(rawMembers);
      if (Array.isArray(localMembers) && localMembers.length > 0) {
        const payloadMembers = localMembers.map(m => {
          const clean = {
            team_id: teamId,
            full_name: m.full_name || 'Crewmate',
            email: (m.email || '').toLowerCase(),
            phone_number: m.phone_number || '',
            location: m.location || '',
            college_name: m.college_name || '',
            reg_no: m.reg_no || '',
            dept: m.dept || 'Engineering',
            year: m.year || '3rd Year',
            id_card_front_url: m.id_card_front_url || null,
            id_card_back_url: m.id_card_back_url || null,
            is_leader: !!m.is_leader
          };
          if (isUUID(m.id)) clean.id = m.id;
          return clean;
        });

        const { data: dbMembers, error: memErr } = await supabase.from('team_members').upsert(payloadMembers).select();
        if (memErr) {
          console.warn('Sync members error:', memErr);
        } else if (dbMembers) {
          localStorage.setItem(`haxlr8_members_${userId}`, JSON.stringify(dbMembers));
        }
      }
    }

    // 3. Sync Submissions
    if (rawSubs) {
      const localSubs = JSON.parse(rawSubs);
      const subsList = Array.isArray(localSubs) ? localSubs : [localSubs];
      if (subsList.length > 0) {
        const payloadSubs = subsList.map(s => {
          const clean = {
            team_id: teamId,
            project_title: s.project_title || localTeam.team_name + ' Project',
            sdg_goal: s.sdg_goal || 'Open Innovation',
            category: s.category || 'General',
            project_description: s.project_description || '',
            pdf_url: s.pdf_url || null
          };
          if (isUUID(s.id)) clean.id = s.id;
          return clean;
        });

        const { data: dbSubs, error: subErr } = await supabase.from('submissions').upsert(payloadSubs).select();
        if (subErr) {
          console.warn('Sync submissions error:', subErr);
        } else if (dbSubs) {
          localStorage.setItem(`haxlr8_subs_${userId}`, JSON.stringify(dbSubs));
        }
      }
    }

    return { synced: true, teamId };
  } catch (err) {
    console.warn('syncLocalDataToSupabase exception:', err);
    return { synced: false, error: err.message };
  }
}
