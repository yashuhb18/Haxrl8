import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import OverviewTab    from './OverviewTab';
import TeamTab        from './TeamTab';
import SubmissionTab  from './SubmissionTab';
import ResourcesTab   from './ResourcesTab';

import AnnouncementsTab from './AnnouncementsTab';

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setLoading(false);
          if (window.location.hash.includes('error=')) {
            navigate('/register' + window.location.hash);
          } else {
            navigate('/register');
          }
          return;
        }

        setUser(user);

        // Security: Clean up OAuth tokens from the URL if they are present after redirect
        if (window.location.hash.includes('access_token=')) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // Fetch announcements
        const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (annData) setAnnouncements(annData);

        const { data: team, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('leader_id', user.id)
          .single();

        if (teamError && teamError.code !== 'PGRST116') {
          throw teamError;
        }

        if (team) {
          setHasTeam(true);
          setTeamData(team);

          const { data: members, error: membersError } = await supabase
            .from('team_members')
            .select('*')
            .eq('team_id', team.id);      
          
          if (membersError) throw membersError;
          setTeamMembers(members);

          const { data: subs, error: subsError } = await supabase
            .from('submissions')
            .select('*')
            .eq('team_id', team.id);
            
          if (subsError) throw subsError;
          setSubmissions(subs);
        } else {
          setHasTeam(false);
        }
      } catch (error) {
        // Error fetching dashboard data
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fffaf3', fontFamily:"'Fredoka', 'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign:'center' }}>
           <div style={{ width:48, height:48, border:'4px solid #fed7aa', borderTop:'4px solid #ff3b69', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
           <div style={{ color:'#ff3b69', fontSize:'14px', fontWeight:900, letterSpacing:'0.04em', textTransform:'uppercase' }}>CONNECTING TO FLIGHT DECK...</div>
           <p style={{ color:'#64748b', fontSize:'12px', marginTop:'6px', fontWeight:600 }}>Syncing mission telemetry & squad credentials</p>
           <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
