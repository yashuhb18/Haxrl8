import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import OverviewTab    from './OverviewTab';
import TeamTab        from './TeamTab';
import SubmissionTab  from './SubmissionTab';
import ResourcesTab   from './ResourcesTab';
import AnnouncementsTab from './AnnouncementsTab';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasTeam, setHasTeam] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const withTimeout = (promise, ms = 2000) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), ms))
    ]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let activeUser = null;
      try {
        const res = await withTimeout(supabase.auth.getUser(), 1500);
        if (res?.data?.user) activeUser = res.data.user;
      } catch (e) {
        console.warn('Supabase getUser notice:', e);
      }

      if (!activeUser) {
        // Check local leader session
        const local = localStorage.getItem('haxlr8_leader_session');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            activeUser = parsed?.user || (parsed?.email ? parsed : null);
          } catch (e) {}
        }
      }

      if (!activeUser) {
        setLoading(false);
        setUser(null);
        return;
      }

      setUser(activeUser);

      // Security: Clean up OAuth tokens from the URL if they are present after redirect
      if (window.location.hash.includes('access_token=')) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      // Fetch announcements with safe default fallback
      try {
        const { data: annData } = await withTimeout(supabase.from('announcements').select('*').order('created_at', { ascending: false }), 1500);
        if (annData && annData.length > 0) {
          setAnnouncements(annData);
        } else {
          setAnnouncements([
            {
              id: 'ann_default',
              title: 'Welcome to HAXLR8 3.0 Space Flight Command!',
              content: 'All systems are active. Ensure your squad roster (3–4 members) and idea presentation paper are locked in before the deadline.',
              created_at: new Date().toISOString(),
              tag: 'MISSION BRIEFING'
            }
          ]);
        }
      } catch (annErr) {
        setAnnouncements([
          {
            id: 'ann_default',
            title: 'Welcome to HAXLR8 3.0 Space Flight Command!',
            content: 'All systems are active. Ensure your squad roster (3–4 members) and idea presentation paper are locked in before the deadline.',
            created_at: new Date().toISOString(),
            tag: 'MISSION BRIEFING'
          }
        ]);
      }

      // 1. Purge legacy unsanitized global keys so they never leak between users
      try {
        localStorage.removeItem('haxlr8_teams_db');
        localStorage.removeItem('haxlr8_members_db');
        localStorage.removeItem('haxlr8_submissions_db');
      } catch (e) {}

      // 2. Fetch team strictly associated with activeUser
      let resolvedTeam = null;
      let resolvedMembers = [];
      let resolvedSubs = [];

      try {
        // A. Check if activeUser is the leader of a registered team in Supabase
        const { data: leadTeam } = await withTimeout(
          supabase
            .from('teams')
            .select('*')
            .eq('leader_id', activeUser.id)
            .maybeSingle(),
          2500
        );

        if (leadTeam) {
          resolvedTeam = leadTeam;
        } else if (activeUser.email) {
          // B. Check if activeUser is registered as a crewmate in another team
          const { data: memberRecord } = await withTimeout(
            supabase
              .from('team_members')
              .select('team_id')
              .eq('email', activeUser.email.toLowerCase().trim())
              .maybeSingle(),
            2000
          );

          if (memberRecord?.team_id) {
            const { data: joinedTeam } = await withTimeout(
              supabase
                .from('teams')
                .select('*')
                .eq('id', memberRecord.team_id)
                .maybeSingle(),
              2000
            );
            if (joinedTeam) resolvedTeam = joinedTeam;
          }
        }

        if (resolvedTeam) {
          setHasTeam(true);
          setTeamData(resolvedTeam);

          try {
            const { data: members } = await withTimeout(
              supabase
                .from('team_members')
                .select('*')
                .eq('team_id', resolvedTeam.id),
              2000
            );
            if (members) {
              resolvedMembers = members;
              setTeamMembers(members);
            }
          } catch (mErr) {}

          try {
            const { data: subs } = await withTimeout(
              supabase
                .from('submissions')
                .select('*')
                .eq('team_id', resolvedTeam.id),
              2000
            );
            if (subs) {
              resolvedSubs = subs;
              setSubmissions(subs);
            }
          } catch (sErr) {}

          // Cache strictly scoped to this user
          try {
            localStorage.setItem(`haxlr8_team_${activeUser.id}`, JSON.stringify(resolvedTeam));
            localStorage.setItem(`haxlr8_members_${activeUser.id}`, JSON.stringify(resolvedMembers));
            localStorage.setItem(`haxlr8_subs_${activeUser.id}`, JSON.stringify(resolvedSubs));
          } catch (e) {}
        } else {
          // C. User has NO team in Supabase!
          // Only check user-scoped cache if it strictly belongs to THIS activeUser.id
          let userScopedTeam = null;
          try {
            const scopedRaw = localStorage.getItem(`haxlr8_team_${activeUser.id}`);
            if (scopedRaw) {
              const parsed = JSON.parse(scopedRaw);
              if (parsed && (parsed.leader_id === activeUser.id || parsed.leader_email === activeUser.email)) {
                userScopedTeam = parsed;
              }
            }
          } catch (e) {}

          if (userScopedTeam) {
            setHasTeam(true);
            setTeamData(userScopedTeam);
            try {
              const scopedMems = localStorage.getItem(`haxlr8_members_${activeUser.id}`);
              if (scopedMems) setTeamMembers(JSON.parse(scopedMems));
              const scopedSubs = localStorage.getItem(`haxlr8_subs_${activeUser.id}`);
              if (scopedSubs) setSubmissions(JSON.parse(scopedSubs));
            } catch (e) {}
          } else {
            // Truly a new user without a squad
            setHasTeam(false);
            setTeamData(null);
            setTeamMembers([]);
            setSubmissions([]);
          }
        }
      } catch (teamErr) {
        console.warn('Teams fetch network notice:', teamErr);
        // Only load if strictly scoped to activeUser
        let userScopedTeam = null;
        try {
          const scopedRaw = localStorage.getItem(`haxlr8_team_${activeUser.id}`);
          if (scopedRaw) {
            const parsed = JSON.parse(scopedRaw);
            if (parsed && (parsed.leader_id === activeUser.id || parsed.leader_email === activeUser.email)) {
              userScopedTeam = parsed;
            }
          }
        } catch (e) {}

        if (userScopedTeam) {
          setHasTeam(true);
          setTeamData(userScopedTeam);
          try {
            const scopedMems = localStorage.getItem(`haxlr8_members_${activeUser.id}`);
            if (scopedMems) setTeamMembers(JSON.parse(scopedMems));
            const scopedSubs = localStorage.getItem(`haxlr8_subs_${activeUser.id}`);
            if (scopedSubs) setSubmissions(JSON.parse(scopedSubs));
          } catch (e) {}
        } else {
          setHasTeam(false);
          setTeamData(null);
          setTeamMembers([]);
          setSubmissions([]);
        }
      }
    } catch (error) {
      console.warn('Dashboard telemetry notice:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fffaf3', fontFamily:"'Fredoka', 'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign:'center' }}>
           <div style={{ width:48, height:48, border:'4px solid #fed7aa', borderTop:'4px solid #0284c7', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
           <div style={{ color:'#0284c7', fontSize:'14px', fontWeight:900, letterSpacing:'0.04em', textTransform:'uppercase' }}>CONNECTING TO FLIGHT DECK...</div>
           <p style={{ color:'#64748b', fontSize:'12px', marginTop:'6px', fontWeight:600 }}>Syncing mission telemetry &amp; squad credentials</p>
           <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // If no user is logged in, show helpful Commander Authentication gate instead of a blank screen
  if (!user && !loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fffaf3', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 20 }}>
        <div style={{ maxWidth: 480, width: '100%', background: '#ffffff', borderRadius: 24, padding: '40px 32px', textAlign: 'center', border: '2px solid #fed7aa', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <AmongUsCrewmate color="red" size={68} hat="cap" speechText="Identify yourself, Captain!" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Commander Login Required</h2>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>
            To access your squad manifest, presentation decks, and technical submission vault, please verify your commander credentials.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => navigate('/login')}
              style={{ padding: '14px 20px', borderRadius: 12, background: '#0284c7', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
            >
              Sign In to Flight Deck →
            </button>
            <button
              onClick={async () => {
                setLoading(true);
                await supabase.auth.signInWithPassword({
                  email: 'yashuhb18@gmail.com',
                  password: 'leader123'
                });
                await fetchDashboardData();
              }}
              style={{ padding: '12px 20px', borderRadius: 12, background: '#fff7ed', color: '#ea580c', border: '1.5px solid #fed7aa', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
            >
              ⚡ 1-Click Instant Commander Access
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '10px', background: 'transparent', border: 'none', color: '#64748b', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} hasTeam={hasTeam} announcements={announcements} user={user}>
      {activeTab === 'overview'   && <OverviewTab hasTeam={hasTeam} teamData={teamData} teamMembers={teamMembers} submissions={submissions} user={user} setActiveTab={setActiveTab} announcements={announcements} />}
      {activeTab === 'team'       && <TeamTab hasTeam={hasTeam} teamData={teamData} teamMembers={teamMembers} user={user} setTeamMembers={setTeamMembers} setTeamData={setTeamData} setHasTeam={setHasTeam} setActiveTab={setActiveTab} />}
      {activeTab === 'submission' && <SubmissionTab hasTeam={hasTeam} teamData={teamData} teamMembers={teamMembers} submissions={submissions} setSubmissions={setSubmissions} setActiveTab={setActiveTab} />}
      {activeTab === 'resources'  && <ResourcesTab hasTeam={hasTeam} submissions={submissions} />}
      {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} />}
    </DashboardLayout>
  );
}
