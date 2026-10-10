import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import {
  Users, FileText, Activity, Clock, MapPin, BookOpen, GraduationCap,
  Calendar, Info, Trophy,
  Monitor, Cpu, Database, Zap, Briefcase, Award, PieChart as PieChartIcon,
  Globe, Building2
} from 'lucide-react';
import analyticsData from './analytics.json';

/* ─── colour palettes ──────────────────────────────────────────── */
const BAR_COLORS  = ['#8b5cf6','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#6366f1','#14b8a6','#f97316','#84cc16'];
const SDG_COLORS  = ['#f59e0b','#10b981','#ef4444','#3b82f6','#7c3aed','#f59e0b','#ec4899','#ef4444','#f97316','#8b5cf6'];
const GENDER_CLR  = { Male: '#3b82f6', Female: '#ec4899' };
const YEAR_CLR    = ['#10b981','#ec4899','#8b5cf6','#3b82f6','#f59e0b'];

/* ─── tiny helpers ─────────────────────────────────────────────── */
const getDeptIcon = (n) => {
  const l = n.toLowerCase();
  if (l.includes('computer'))   return { Icon: Monitor,  color: '#3b82f6', bg: '#eff6ff' };
  if (l.includes('artificial')) return { Icon: Cpu,      color: '#10b981', bg: '#ecfdf5' };
  if (l.includes('information'))return { Icon: Database, color: '#8b5cf6', bg: '#f5f3ff' };
  if (l.includes('electronic')) return { Icon: Zap,      color: '#f59e0b', bg: '#fffbeb' };
  if (l.includes('data'))       return { Icon: Activity, color: '#ec4899', bg: '#fdf2f8' };
  return                                { Icon: Briefcase,color: '#14b8a6', bg: '#f0fdfa' };
};

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  // Prefer the actual data field name over the index-based label Recharts sends for PieCharts
  const title = payload[0].payload?.year
    || payload[0].payload?.fullName
    || payload[0].name
    || label;
  return (
    <div style={{ background:'rgba(10, 16, 30, 0.95)', border:'1px solid rgba(56, 254, 220, 0.3)', borderRadius:10, padding:'10px 14px', boxShadow:'0 4px 20px rgba(0,0,0,.5)' }}>
      <p style={{ fontSize:11, color:'#38fedc', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4 }}>
        {title}
      </p>
      <p style={{ fontSize:16, fontWeight:800, color:'#ffffff' }}>
        {payload[0].value} <span style={{ fontSize:11, fontWeight:500, color:'#94a3b8' }}>count</span>
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const { summary_metrics: sm, demographics: demo, submission_details: sub } = analyticsData;

  /* ── responsive breakpoint ── */
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const totalGender = sm.estimated_gender_breakdown.male + sm.estimated_gender_breakdown.female;
  const genderData  = [
    { name: 'Female', value: sm.estimated_gender_breakdown.female },
    { name: 'Male',   value: sm.estimated_gender_breakdown.male   },
  ];

  const yearData = demo.year_of_study.slice(0, 4);
  const totalYrs = yearData.reduce((a, c) => a + c.count, 0);

  const sdgData = sub.by_sdg_goal.map(d => ({
    name: d.sdg.replace(/SDG (\d+) -.*/, 'SDG $1'),
    fullName: d.sdg,
    count: d.count,
  }));

  /* stat card data */
  const stats = [
    { title:'Total Participants',   value: sm.total_participants.toLocaleString(),    sub:'Registered individuals',                           Icon:Users,        color:'#3b82f6', bg:'#eff6ff' },
    { title:'Teams Registered',     value: sm.total_teams_registered.toLocaleString(), sub:`Avg ${sm.average_team_size_submitted} members/team`, Icon:Users,        color:'#10b981', bg:'#ecfdf5' },
    { title:'Total Submissions',    value: sm.total_submissions.toLocaleString(),      sub:'Projects submitted',                               Icon:FileText,     color:'#8b5cf6', bg:'#f5f3ff' },
    { title:'Submission Rate',      value:`${sm.team_submission_rate_pct}%`,           sub:'Teams that submitted',                             Icon:PieChartIcon, color:'#f97316', bg:'#fff7ed' },
  ];

  const card = {
    background: 'rgba(15, 23, 42, 0.85)',
    border: '1.5px solid rgba(56, 254, 220, 0.2)',
    borderRadius: 18,
    padding: isMobile ? '18px 16px' : '28px 32px',
    boxShadow: '0 4px 20px rgba(0,0,0,.3), 0 0 15px rgba(56, 254, 220, 0.08)',
    color: '#ffffff',
  };

  return (
    <div style={{ minHeight:'100vh', background:'#070a13', color:'#ffffff', fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth:'100%', padding: isMobile ? '80px 14px 40px' : isTablet ? '90px 24px 48px' : '100px 60px 60px' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent:'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap:12, marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ background:'linear-gradient(135deg, #0284c7, #38fedc)', borderRadius:12, padding:10, display:'flex', flexShrink:0 }}>
              <Activity size={isMobile ? 18 : 22} color="#070a13" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight:900, color:'#ffffff', margin:0, letterSpacing:'-.4px' }}>HAXLR8 3.0 Telemetry</h1>
              <p style={{ fontSize:12, color:'#38fedc', margin:'3px 0 0', fontWeight:600 }}>Maharaja Institute of Technology Mysore • Star Base Analytics</p>
            </div>
          </div>
          <span style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(15, 23, 42, 0.8)', border:'1px solid rgba(56, 254, 220, 0.3)', color:'#38fedc', fontSize:11, fontWeight:700, padding:'6px 14px', borderRadius:10, alignSelf: isMobile ? 'flex-start' : 'auto' }}>
            <Calendar size={12} color="#38fedc" /> Nov 06–07, 2026 Finale
          </span>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 10 : 20, marginBottom:20 }}>
          {stats.map(({ title, value, sub: subtitle, Icon, color, bg }) => (
            <div key={title} style={{ ...card, borderRadius:16, padding: isMobile ? '14px 12px' : '24px 22px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap: isMobile ? 10 : 14 }}>
                <div style={{ background:bg, borderRadius:12, padding: isMobile ? 8 : 11, flexShrink:0 }}>
                  <Icon size={isMobile ? 18 : 24} color={color} strokeWidth={2} />
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize: isMobile ? 10 : 12, color:'#94a3b8', fontWeight:700, margin:'0 0 3px', textTransform:'uppercase', letterSpacing:'0.04em' }}>{title}</p>
                  <p style={{ fontSize: isMobile ? 20 : 28, fontWeight:900, color:'#ffffff', margin:'0 0 2px', lineHeight:1 }}>{value}</p>
                  <p style={{ fontSize: isMobile ? 10 : 11, color:'#38fedc', fontWeight:600, margin:0 }}>{subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── REACH BANNER ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 10 : 16, marginBottom:20 }}>
          <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', borderRadius:16, padding: isMobile ? '16px 18px' : '22px 28px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 4px 20px rgba(0,0,0,.15)' }}>
            <Globe size={isMobile ? 24 : 32} color="#60a5fa" strokeWidth={1.8} style={{ flexShrink:0 }} />
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 4px' }}>States / UTs Represented</p>
              <p style={{ fontSize: isMobile ? 24 : 30, fontWeight:900, color:'#fff', margin:0, lineHeight:1 }}>{demo.total_states_uts_represented}</p>
            </div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', borderRadius:16, padding: isMobile ? '16px 18px' : '22px 28px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 4px 20px rgba(0,0,0,.15)' }}>
            <Building2 size={isMobile ? 24 : 32} color="#a78bfa" strokeWidth={1.8} style={{ flexShrink:0 }} />
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 4px' }}>Unique Colleges</p>
              <p style={{ fontSize: isMobile ? 24 : 30, fontWeight:900, color:'#fff', margin:0, lineHeight:1 }}>{demo.total_unique_colleges}</p>
            </div>
          </div>
          <div style={{ background:'linear-gradient(135deg,#0d2137 0%,#0a3d2b 100%)', borderRadius:16, padding: isMobile ? '16px 18px' : '22px 28px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 4px 20px rgba(0,0,0,.15)' }}>
            <Calendar size={isMobile ? 24 : 32} color="#34d399" strokeWidth={1.8} style={{ flexShrink:0 }} />
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 4px' }}>Busiest Submission Day</p>
              <p style={{ fontSize: isMobile ? 14 : 18, fontWeight:900, color:'#fff', margin:0, lineHeight:1.2 }}>{sub.busiest_submission_day}</p>
            </div>
          </div>
        </div>

        {/* ── ROW 2 : COLLEGES + GENDER ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '3fr 2fr', gap:20, marginBottom:20 }}>

          {/* colleges */}
          <div style={card}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <GraduationCap size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>Top 10 Colleges</span>
            </div>
            <div style={{ height: isMobile ? 360 : 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demo.top_10_colleges} layout="vertical" margin={{ top:0, right: isMobile ? 38 : 44, left:0, bottom:0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={isMobile ? 130 : 200}
                    tick={{ fontSize: isMobile ? 10 : 12, fill:'#374151', fontWeight:600 }}
                    tickLine={false} axisLine={false} interval={0} />
                  <Tooltip cursor={{ fill:'#f9fafb' }} content={<ChartTip />} />
                  <Bar dataKey="count" radius={[0,5,5,0]} barSize={isMobile ? 18 : 22} maxBarSize={28}>
                    {demo.top_10_colleges.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                    <LabelList dataKey="count" position="right" style={{ fontSize: isMobile ? 10 : 12, fontWeight:700, fill:'#374151' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* gender */}
          <div style={{ ...card, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <Users size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>Gender Breakdown</span>
            </div>
            <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center', minHeight: isMobile ? 200 : 260 }}>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%"
                    innerRadius={isMobile ? 58 : 90} outerRadius={isMobile ? 86 : 125}
                    paddingAngle={3} dataKey="value" stroke="none">
                    {genderData.map((g, i) => <Cell key={i} fill={GENDER_CLR[g.name]} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                <span style={{ fontSize: isMobile ? 24 : 34, fontWeight:900, color:'#111827', lineHeight:1 }}>{totalGender.toLocaleString()}</span>
                <span style={{ fontSize:12, color:'#6b7280', fontWeight:600, marginTop:4 }}>Participants</span>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:16, marginTop:14 }}>
              {genderData.map(g => (
                <div key={g.name} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:GENDER_CLR[g.name], display:'inline-block' }}/>
                  <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{g.name}</span>
                  <span style={{ fontSize:12, color:'#6b7280', fontWeight:500 }}>{g.value.toLocaleString()} ({(g.value/totalGender*100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 3 : YEAR + DEPTS + CITIES ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap:20, marginBottom:20 }}>

          {/* Year of Study */}
          <div style={card}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <BookOpen size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>Year of Study</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, height:220 }}>
              <div style={{ width:'45%', height:'100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={yearData} cx="50%" cy="50%" innerRadius={28} outerRadius={76} dataKey="count" nameKey="year" stroke="#fff" strokeWidth={3}>
                      {yearData.map((_, i) => <Cell key={i} fill={YEAR_CLR[i % YEAR_CLR.length]} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                {yearData.map((y, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <span style={{ width:9, height:9, borderRadius:'50%', background:YEAR_CLR[i % YEAR_CLR.length], display:'inline-block', flexShrink:0 }}/>
                      <span style={{ fontWeight:700, color:'#374151' }}>{y.year}</span>
                    </div>
                    <span style={{ color:'#6b7280', fontWeight:600 }}>
                      {(y.count/totalYrs*100).toFixed(1)}%
                      <span style={{ color:'#9ca3af', fontWeight:400 }}> ({y.count})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Departments */}
          <div style={{ ...card, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <Users size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>Top Departments</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {demo.top_10_departments.slice(0,6).map((d, i) => {
                const { Icon: DI, color, bg } = getDeptIcon(d.department);
                return (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 10px', borderRadius:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, overflow:'hidden' }}>
                      <div style={{ background:bg, borderRadius:8, padding:6, flexShrink:0 }}>
                        <DI size={14} color={color} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:'#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.department}</span>
                    </div>
                    <span style={{ fontSize:13, fontWeight:900, color, flexShrink:0, marginLeft:8 }}>{d.count.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Cities */}
          <div style={{ ...card, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <MapPin size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>Top Cities</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {demo.top_10_cities.slice(0,6).map((c, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 8px', borderBottom: i < 5 ? '1px solid #f3f4f6' : 'none' }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{c.city}</span>
                  <span style={{ fontSize:14, fontWeight:900, color:'#10b981' }}>{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 4 : COLLEGE TYPE + TOP STATES ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '3fr 2fr', gap:20, marginBottom:20 }}>

          {/* College type breakdown */}
          <div style={card}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <Building2 size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>College Type Breakdown</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {demo.college_type_breakdown.map((c, i) => {
                const total = demo.college_type_breakdown.reduce((a, x) => a + x.participant_count, 0);
                const pct   = (c.participant_count / total * 100).toFixed(1);
                return (
                  <div key={i}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, flexWrap:'wrap', gap:4 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{c.type}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:'#6b7280' }}>
                        {c.participant_count.toLocaleString()} <span style={{ color:'#9ca3af', fontWeight:500 }}>({pct}%) · {c.unique_colleges} colleges</span>
                      </span>
                    </div>
                    <div style={{ background:'#f3f4f6', borderRadius:99, height:8, overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:BAR_COLORS[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 5 States */}
          <div style={{ ...card, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <Globe size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>Top States / UTs</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {demo.top_5_states.map((s, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 8px', borderBottom: i < demo.top_5_states.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ width:22, height:22, borderRadius:6, background:BAR_COLORS[i], display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#fff', flexShrink:0 }}>{i+1}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{s.state}</span>
                  </div>
                  <span style={{ fontSize:14, fontWeight:900, color:'#3b82f6' }}>{s.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 5 : SDG CHART + HIGHLIGHTS ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '3fr 2fr', gap:20, marginBottom:24 }}>

          {/* SDG chart — horizontal bars on mobile, vertical bars on desktop */}
          <div style={card}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <Activity size={17} color="#6366f1" strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:'#111827' }}>Submissions by UN SDG Goal</span>
            </div>

            {isMobile ? (
              /* ── MOBILE: horizontal bar chart (like colleges) ── */
              <div style={{ height: sdgData.length * 38 + 20 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sdgData} layout="vertical" margin={{ top:0, right:44, left:0, bottom:0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="fullName" type="category" width={160}
                      tick={{ fontSize:10, fill:'#374151', fontWeight:600 }}
                      tickLine={false} axisLine={false} interval={0}
                      tickFormatter={(v) => v.replace(/SDG \d+ - /, 'SDG: ').substring(0,24)}
                    />
                    <Tooltip cursor={{ fill:'#f9fafb' }} content={<ChartTip />} />
                    <Bar dataKey="count" radius={[0,5,5,0]} barSize={20}>
                      {sdgData.map((_, i) => <Cell key={i} fill={SDG_COLORS[i % SDG_COLORS.length]} />)}
                      <LabelList dataKey="count" position="right" style={{ fontSize:10, fontWeight:700, fill:'#374151' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              /* ── DESKTOP: vertical bar chart ── */
              <div style={{ height:310 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sdgData} margin={{ top:24, right:8, left:-16, bottom:36 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize:10, fill:'#6b7280', fontWeight:600 }} angle={-45} textAnchor="end" height={48} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill:'#f9fafb' }} content={<ChartTip />} />
                    <Bar dataKey="count" radius={[4,4,0,0]} barSize={26}>
                      {sdgData.map((_, i) => <Cell key={i} fill={SDG_COLORS[i % SDG_COLORS.length]} />)}
                      <LabelList dataKey="count" position="top" style={{ fontSize:10, fontWeight:700, fill:'#374151' }} offset={5} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* peak time + top category — on mobile these stack below SDG chart */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* peak time */}
            <div style={{ background:'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)', borderRadius:16, padding: isMobile ? '22px 20px' : '28px 30px', flex:1, position:'relative', overflow:'hidden', boxShadow:'0 8px 32px rgba(79,70,229,.25)' }}>
              <svg style={{ position:'absolute', bottom:0, left:0, right:0, width:'100%', opacity:.2 }} viewBox="0 0 400 60" preserveAspectRatio="none">
                <path d="M0,30 C50,0 100,60 150,30 C200,0 250,60 300,30 C350,0 400,60 400,30 L400,60 L0,60 Z" fill="white"/>
              </svg>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <Clock size={15} color="rgba(255,255,255,.8)" />
                  <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.8)', textTransform:'uppercase', letterSpacing:'.08em' }}>Peak Submission Time</span>
                </div>
                <p style={{ fontSize: isMobile ? 20 : 22, fontWeight:900, color:'#fff', margin:'0 0 6px', lineHeight:1.3 }}>{sub.peak_submission_time}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,.65)', fontWeight:500, margin:0 }}>Highest traffic window</p>
              </div>
            </div>

            {/* top category */}
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:16, padding: isMobile ? '22px 20px' : '28px 30px', flex:1, position:'relative', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
              <Trophy size={60} color="#86efac" style={{ position:'absolute', right:10, bottom:6, opacity:.5 }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <Award size={15} color="#15803d" />
                  <span style={{ fontSize:10, fontWeight:700, color:'#15803d', textTransform:'uppercase', letterSpacing:'.08em' }}>Top Category</span>
                </div>
                <p style={{ fontSize: isMobile ? 22 : 24, fontWeight:900, color:'#14532d', margin:'0 0 8px' }}>{sub.by_category[0]?.category}</p>
                <p style={{ fontSize:13, fontWeight:700, color:'#16a34a', margin:0 }}>
                  {sub.by_category[0]?.count} submissions ({(sub.by_category[0]?.count/sm.total_submissions*100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent:'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap:8, background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'14px 20px', fontSize:12, color:'#6b7280', fontWeight:600 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, color:'#ff3b69' }}>
            <Info size={14} />
            <span>Official live analytics for HAXLR8 3.0</span>
          </div>
          <span>Grand Finale: Nov 6 – 7, 2026 • MIT Mysore Campus</span>
        </div>

      </div>
    </div>
  );
}
