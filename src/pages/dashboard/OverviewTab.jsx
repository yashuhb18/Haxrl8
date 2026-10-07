import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import EventTimeline from '../../components/EventTimeline';
import { motion, AnimatePresence } from 'framer-motion';
import OfficialPPT from '../../assets/PPT/SRCAS HACKATHON 3.0.pptx';
import ProblemStatementPDF from '../../assets/PS_example/Hackathon Problem Statement 2026.pdf';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

const TIMELINE_STEPS = [
  { title: 'Registration', date: 'Oct 09' },
  { title: 'Team Lock', date: 'Oct 28' },
  { title: 'Idea Paper', date: 'Oct 28' },
  { title: 'Shortlist', date: 'Nov 02' },
  { title: 'Grand Finale', date: 'Nov 06–07' },
];

const card = (extra = {}) => ({
  background: '#ffffff',
  borderRadius: 22,
  padding: '24px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
  border: '2px solid #fed7aa',
  color: '#0f172a',
  ...extra,
});

const CheckItem = ({ label, status }) => {
  let icon, style, color;
  if (status === 'done') {
    icon = <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>;
    style = { width: 20, height: 20, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)' };
    color = '#15803d';
  } else if (status === 'active') {
    icon = null;
    style = { width: 20, height: 20, borderRadius: '50%', border: '2px dashed #0284c7', flexShrink: 0, background: '#e0f2fe' };
    color = '#0284c7';
  } else {
    icon = null;
    style = { width: 20, height: 20, borderRadius: '50%', border: '2px solid #cbd5e1', flexShrink: 0, background: '#f8fafc' };
    color = '#94a3b8';
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={style}>{icon}</div>
      <span style={{ fontSize: 13.5, fontWeight: status === 'active' ? 800 : 700, color }}>{label}</span>
    </div>
  );
};

export default function OverviewTab({ hasTeam, teamData, teamMembers, submissions, user, setActiveTab, announcements = [] }) {
  const [totalTeams, setTotalTeams] = useState(245);
  const [showRulebook, setShowRulebook] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const fetchTeamCount = async () => {
      const cachedCount = localStorage.getItem('total_teams_count');
      const cacheTime = localStorage.getItem('total_teams_time');
      
      if (cachedCount && cacheTime && (Date.now() - cacheTime < 300000)) {
        setTotalTeams(Number(cachedCount));
      } else {
        const { count } = await supabase.from('teams').select('id', { count: 'exact', head: true });
        if (count !== null) {
          localStorage.setItem('total_teams_count', count);
          localStorage.setItem('total_teams_time', Date.now());
          setTotalTeams(count);
        }
      }
    };
    fetchTeamCount();
  }, []);

  useEffect(() => {
    if (showRulebook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showRulebook]);

  const memberCount = teamMembers?.length || 1;
  const hasSubmitted = submissions?.length > 0;
  const overallProgress = hasTeam ? (hasSubmitted ? 60 : 40) : 20; 
  const currentStepIndex = hasSubmitted ? 2 : (hasTeam ? 1 : 0);

  const now = new Date();
  const milestones = [
    { title: 'Registration & Idea Submission', dateStr: '2026-10-28T23:59:59', icon: '💡', desc: 'Submit team details & idea paper' },
    { title: 'Shortlist Announced', dateStr: '2026-11-02T12:00:00', icon: '🚩', desc: 'Top teams announced for offline finale' },
    { title: 'Grand Finale (MIT Mysore)', dateStr: '2026-11-06T09:00:00', icon: '🏆', desc: '24-hour hackathon & ₹30,000 bounty' }
  ];

  const upcomingMilestones = milestones.filter(m => new Date(m.dateStr) > now);
  const nextMilestone = upcomingMilestones.length > 0 ? upcomingMilestones[0] : milestones[milestones.length - 1];

  const getDaysLeft = (targetDate) => {
    const diff = new Date(targetDate) - now;
    if (diff < 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const daysToNext = getDaysLeft(nextMilestone.dateStr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Priority Mission Broadcast Banner */}
      {showNotification && (
        <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)' }}>
          <AmongUsCrewmate color="red" size={32} speechText="Deadline approaching!" />
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0369a1', flex: 1, letterSpacing: '0.01em', lineHeight: 1.5 }}>
            <strong>STARSHIP MISSION ADVISORY:</strong> Registration &amp; Idea Abstract Paper lock on <strong>October 28, 2026 at 11:59 PM IST</strong>. Confirm your 3–4 crew members before lock!
          </div>
          <button onClick={() => setShowNotification(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#0369a1', opacity: 0.7 }} onMouseEnter={e => e.currentTarget.style.opacity='1'} onMouseLeave={e => e.currentTarget.style.opacity='0.7'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Cosmic Event Timeline */}
      <EventTimeline steps={TIMELINE_STEPS} currentStepIndex={currentStepIndex} />

      {/* Stats Grid */}
      <div className="dash-overview-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        
        {/* Rulebook Card */}
        <div
          style={card({
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            cursor: 'pointer',
            border: '2px solid #bae6fd',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          })}
          onClick={() => setShowRulebook(true)}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(2, 132, 199, 0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.04)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)' }}>📄</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>Flight Rulebook</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mandatory Protocols</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 12.5, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            View flight protocols →
          </div>
        </div>

        {/* Days to Next Milestone Card */}
        <div style={card({ display: 'flex', flexDirection: 'column', padding: '24px', background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)', border: '2px solid #fef08a' })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fef08a', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 12px rgba(202, 138, 4, 0.15)' }}>⏳</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#a16207', lineHeight: 1 }}>{daysToNext} Days</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#854d0e', marginTop: 4 }}>Time to Milestone</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 12.5, fontWeight: 800, color: '#713f12' }}>{nextMilestone.title}</div>
        </div>

        {/* Teams Participating Card */}
        <div style={card({ display: 'flex', flexDirection: 'column', padding: '24px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '2px solid #bbf7d0' })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>⭐</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#15803d', lineHeight: 1 }}>{totalTeams}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginTop: 4 }}>Crew Squadrons</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 12.5, fontWeight: 800, color: '#14532d' }}>National Participants</div>
        </div>

      </div>

      {/* Main Grid: Comms, Readiness, Milestones */}
      <div className="dash-overview-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        
        {/* Starship Comms */}
        <div style={card({ display: 'flex', flexDirection: 'column' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📡</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>Starship Comms</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '24px 0', fontSize: 13.5, background: '#f8fafc', borderRadius: 14, border: '1px dashed #cbd5e1' }}>
                No active broadcasts. All telemetry nominal.
              </div>
            ) : announcements.slice(0, 3).map(a => (
              <div key={a.id} style={{ display: 'flex', gap: 12, background: '#f8fafc', padding: '14px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 18, color: '#0284c7', flexShrink: 0 }}>📢</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{a.title}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 4, lineHeight: 1.4 }}>{a.message || a.content}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, fontWeight: 600 }}>{new Date(a.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} • Starfleet Admin</div>
                </div>
              </div>
            ))}
          </div>
          <div onClick={() => setActiveTab('announcements')} style={{ marginTop: 20, textAlign: 'center', fontSize: 12.5, fontWeight: 800, color: '#0284c7', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            View all broadcasts →
          </div>
        </div>

        {/* Mission Readiness */}
        <div style={card({ display: 'flex', flexDirection: 'column' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🎯</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>Mission Readiness</h3>
            </div>
          </div>
          <div className="readiness-container" style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1 }}>
            {/* Circular Gauge */}
            <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 36 36" style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1e7db" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0284c7" strokeWidth="4" strokeDasharray={`${overallProgress}, 100`} />
              </svg>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#0284c7', lineHeight: 1 }}>{overallProgress}%</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Readiness</div>
              </div>
            </div>
            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              <CheckItem label="Registration" status="done" />
              <CheckItem label="Crew Manifest" status={hasTeam ? 'done' : 'active'} />
              <CheckItem label="Idea Deck" status={hasSubmitted ? 'done' : (hasTeam ? 'active' : 'pending')} />
              <CheckItem label="Shortlist Clearance" status={hasSubmitted ? 'active' : 'pending'} />
              <CheckItem label="Grand Finale" status="pending" />
            </div>
          </div>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#64748b' }}>
            {hasTeam ? 'Roster locked! Prepare abstract paper for submission.' : 'Assemble 3–4 crew members in "My Team" to advance.'}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div style={card({ display: 'flex', flexDirection: 'column' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🗓️</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>Upcoming Milestones</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>{m.title}</div>
                    <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>{m.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '3px 8px', borderRadius: 100 }}>
                    {getDaysLeft(m.dateStr)}d left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── ARTIFACTS & MISSION RESOURCES QUICK PANEL ── */}
      <div style={card({ display: 'flex', flexDirection: 'column', gap: 16 })}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
              📦 Official Mission Artifacts &amp; Downloads
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0, fontWeight: 500 }}>
              Essential templates, guidelines, and problem statements for your squad.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {/* PPT Template */}
          <a
            href={OfficialPPT}
            download="HAXLR8_3.0_Template.pptx"
            style={{
              textDecoration: 'none',
              background: '#f0f9ff',
              border: '1.5px solid #bae6fd',
              borderRadius: 16,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: 28 }}>📊</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0369a1' }}>Official PPT Deck</div>
              <div style={{ fontSize: 11, color: '#0284c7', fontWeight: 600 }}>Required PPTX Format</div>
            </div>
          </a>

          {/* Problem Statement PDF */}
          <a
            href={ProblemStatementPDF}
            download="HAXLR8-Problem-Statements-2026.pdf"
            style={{
              textDecoration: 'none',
              background: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: 16,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: 28 }}>📑</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1e40af' }}>Problem Statements</div>
              <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>Download PDF Tracks</div>
            </div>
          </a>

          {/* Leader vs Impostor Protocol */}
          <div
            onClick={() => setActiveTab('resources')}
            style={{
              cursor: 'pointer',
              background: '#fdf4ff',
              border: '1.5px solid #f5d0fe',
              borderRadius: 16,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: 28 }}>👑</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#86198f' }}>Leader vs Impostor</div>
              <div style={{ fontSize: 11, color: '#a21caf', fontWeight: 600 }}>Flight Security Briefing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Rulebook Modal */}
      {showRulebook && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', border: '2px solid #fed7aa', borderRadius: 24, width: '100%', maxWidth: 620, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', position: 'relative' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #f1e7db', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffaf3' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>📜 HAXLR8 3.0 Flight Rulebook</div>
              <button onClick={() => setShowRulebook(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto', fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
              <h4 style={{ color: '#0f172a', fontWeight: 900, margin: '0 0 6px' }}>1. Team Composition &amp; Eligibility</h4>
              <p>Squads must consist of 3 to 4 undergraduate students. Inter-college and inter-branch teams are 100% permitted. All participants must carry official college identity cards.</p>

              <h4 style={{ color: '#0f172a', fontWeight: 900, margin: '0 0 6px' }}>2. 24-Hour Offline Hackathon</h4>
              <p>The finale will be conducted live on campus at Maharaja Institute of Technology Mysore on November 06–07, 2026. High-speed Wi-Fi, power workstations, meals, and midnight snacks are provided.</p>

              <h4 style={{ color: '#0f172a', fontWeight: 900, margin: '0 0 6px' }}>3. Evaluation &amp; Judging (100 Points)</h4>
              <ul style={{ paddingLeft: 20 }}>
                <li>Innovation &amp; Originality (25%)</li>
                <li>Technical Feasibility &amp; Depth (25%)</li>
                <li>Real-world Impact &amp; Scalability (25%)</li>
                <li>Live Pitch &amp; Working Demonstration (25%)</li>
              </ul>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1.5px solid #f1e7db', display: 'flex', justifyContent: 'flex-end', background: '#fafafa' }}>
              <button onClick={() => setShowRulebook(false)} style={{ padding: '10px 20px', borderRadius: 12, background: '#0284c7', color: '#fff', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
                Close Protocol Window
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .dash-overview-stats {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .dash-overview-main {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .readiness-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
