import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import DomainWheel from '../../components/ui/DomainWheel';
import haxlr8LogoDark from '../../assets/logo/haxlr8-logo-dark.png';
import emitersSeal from '../../assets/logo/emiters-seal.png';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

export { DomainWheel };
export const SDGWheel = DomainWheel;

const NAV = [
  { id:'overview',     icon:'⊞',   label:'Overview'      },
  { id:'team',         icon:'◎',   label:'My Team'       },
  { id:'submission',   icon:'↑',   label:'Submission'    },
  { id:'resources',    icon:'≡',   label:'Resources'     },
  { id:'announcements',icon:'⚑',   label:'Announcements' },
];

export default function DashboardLayout({ activeTab, setActiveTab, children, hasTeam, announcements, user }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Plus Jakarta Sans', sans-serif", background:'#fffaf3', color:'#0f172a' }}>
      {/* Sidebar */}
      <aside className="dash-sidebar" style={{ width: collapsed ? 68 : 240, background:'#ffffff', borderRight:'2px solid #fed7aa', display:'flex', flexDirection:'column', transition:'width 0.25s ease', flexShrink:0, position:'sticky', top:0, height:'100vh', overflow:'hidden', zIndex:10, boxShadow:'4px 0 20px rgba(251, 146, 60, 0.05)' }}>
        {/* Logo */}
        <div onClick={() => setCollapsed(!collapsed)} style={{ padding:'16px 14px', borderBottom:'1.5px solid #f1e7db', display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, cursor:'pointer', minHeight:64 }}>
          {!collapsed ? (
            <Link to="/" style={{ display:'flex', alignItems:'center', gap: 8, textDecoration:'none' }}>
              <img src={haxlr8LogoDark} alt="HAXLR8 3.0" style={{ height: 28, width:'auto', objectFit:'contain' }} />
            </Link>
          ) : (
            <img src={emitersSeal} alt="EMITERS" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:'16px 10px', display:'flex', flexDirection:'column', gap:6 }}>
          {NAV.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display:'flex',
                  alignItems:'center',
                  gap:12,
                  padding:'11px 14px',
                  borderRadius:14,
                  border: active ? '1.5px solid #7dd3fc' : '1.5px solid transparent',
                  cursor:'pointer',
                  textAlign:'left',
                  width:'100%',
                  background: active ? '#e0f2fe' : 'transparent',
                  outline:'none',
                  transition:'all 0.15s',
                  boxShadow: active ? '0 4px 12px rgba(2, 132, 199, 0.15)' : 'none',
                }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.background='#f0f9ff'; }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.background='transparent'; }}
              >
                <span style={{ fontSize:18, flexShrink:0, color: active ? '#0284c7' : '#94a3b8', fontWeight:900 }}>{item.icon}</span>
                {!collapsed && (
                  <span style={{ fontSize:13.5, fontWeight: active ? 800 : 600, color: active ? '#0284c7' : '#475569', whiteSpace:'nowrap', letterSpacing:'0.01em' }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && active && (
                  <div style={{ marginLeft:'auto', width:7, height:7, borderRadius:'50%', background:'#0284c7', boxShadow:'0 0 8px #0284c7' }}/>
                )}
              </button>
            );
          })}
        </nav>

        {/* Crewmate Mascot */}
        <div style={{ padding:'12px', margin:'0 10px 12px', background:'#f0f9ff', borderRadius:16, border:'1.5px solid #bae6fd', display:'flex', alignItems:'center', gap:10, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <AmongUsCrewmate color="cyan" size={collapsed ? 36 : 42} speechText="Ready for launch, Crewmate!" />
          {!collapsed && (
            <div>
              <div style={{ fontSize:11.5, fontWeight:900, color:'#0369a1', textTransform:'uppercase', letterSpacing:'0.04em' }}>Flight Deck</div>
              <div style={{ fontSize:10, fontWeight:700, color:'#0284c7' }}>● All Tasks Nominal</div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div style={{ padding:'12px 10px', borderTop:'1.5px solid #f1e7db' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display:'flex',
              alignItems:'center',
              gap:10,
              padding:'10px 14px',
              borderRadius:12,
              border:'1px solid #e2e8f0',
              cursor:'pointer',
              width:'100%',
              background:'#ffffff',
              textAlign:'left',
              outline:'none',
              marginBottom:8,
              color:'#475569',
              fontWeight:700,
              fontSize:12.5,
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.color='#ff3b69'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#ffffff'; e.currentTarget.style.color='#475569'; }}
          >
            <span style={{ fontSize:14 }}>←</span>
            {!collapsed && <span>Back to Base Site</span>}
          </button>

          <button
            onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
            style={{
              display:'flex',
              alignItems:'center',
              gap:10,
              padding:'10px 14px',
              borderRadius:12,
              border:'1.5px solid #fecaca',
              cursor:'pointer',
              width:'100%',
              background:'#fef2f2',
              textAlign:'left',
              outline:'none',
              color:'#b91c1c',
              fontWeight:800,
              fontSize:13,
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#fee2e2'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#fef2f2'; }}
          >
            <span style={{ fontSize:16 }}>🚪</span>
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="dash-main-wrapper" style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, background:'#fffaf3' }}>
        {/* Topbar */}
        <header className="dash-header" style={{ background:'#ffffff', borderBottom:'2px solid #fed7aa', padding:'0 32px', height:66, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:9, boxShadow:'0 2px 10px rgba(251, 146, 60, 0.04)' }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:900, color:'#0f172a', margin:0, letterSpacing:'-0.02em' }}>
              {NAV.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="dash-subtitle" style={{ fontSize:11.5, color:'#ea580c', margin:0, fontWeight:700, letterSpacing:'0.02em' }}>
              HAXLR8 3.0 · ECE Department · Maharaja Institute of Technology Mysore
            </p>
          </div>
          <div className="dash-header-right" style={{ display:'flex', alignItems:'center', gap:14 }}>
            {/* Notification Icon */}
            <button
              onClick={() => setShowAnnouncements(true)}
              title="Broadcasts & Updates"
              style={{
                background:'#fff7ed',
                border:'1.5px solid #fed7aa',
                borderRadius:'12px',
                cursor:'pointer',
                position:'relative',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                padding:9,
                color:'#ea580c',
                transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#ffedd5'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff7ed'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <div style={{ position:'absolute', top:2, right:2, width:8, height:8, borderRadius:'50%', background:'#0284c7', boxShadow:'0 0 8px #0284c7' }}/>
            </button>

            {/* Profile Avatar with Leader Crown */}
            <div
              onClick={() => setShowProfile(true)}
              title="Commander Profile"
              style={{
                cursor:'pointer',
                display:'flex',
                alignItems:'center',
                gap:'8px',
                background:'#f0fdf4',
                border:'1.5px solid #bbf7d0',
                borderRadius:'100px',
                padding:'4px 12px 4px 6px',
                transition:'all 0.2s',
              }}
            >
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg, #0284c7, #06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ffffff', fontSize:'13px', fontWeight:900, boxShadow:'0 2px 8px rgba(2, 132, 199, 0.3)' }}>
                👑
              </div>
              <span style={{ fontSize:12, fontWeight:800, color:'#15803d' }}>
                {user?.user_metadata?.full_name?.split(' ')[0] || 'Leader'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="dash-content" style={{ flex:1, padding:'32px', overflow:'auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="dash-bottom-nav">
        {NAV.map(item => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              style={{ 
                display:'flex', alignItems:'center', justifyContent:'center', gap:6, 
                background: active ? '#e0f2fe' : 'transparent', 
                border: active ? '1.5px solid #7dd3fc' : 'none', outline:'none', 
                padding: active ? '10px 16px' : '10px 0', 
                borderRadius: '100px',
                flex: active ? '0 0 auto' : '1 1 0', 
                cursor:'pointer',
                transition: 'all 0.25s',
                minWidth: 0,
                overflow: 'hidden'
              }}
            >
              <span style={{ fontSize: active ? 18 : 20, color: active ? '#0284c7' : '#94a3b8', fontWeight: active ? 900 : 500, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              {active && (
                <span style={{ fontSize:13, color: '#0284c7', fontWeight: 800, whiteSpace: 'nowrap' }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Announcements Modal */}
      {showAnnouncements && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(15, 23, 42, 0.4)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#ffffff', border:'2px solid #fed7aa', borderRadius:24, width:'100%', maxWidth:540, overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.15)', position:'relative' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1.5px solid #f1e7db', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fffaf3' }}>
              <div style={{ fontSize:18, fontWeight:900, color:'#0f172a' }}>🛰️ Flight Broadcasts & Updates</div>
              <button onClick={() => setShowAnnouncements(false)} style={{ background:'none', border:'none', fontSize:24, cursor:'pointer', color:'#94a3b8' }}>&times;</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:16, maxHeight:'70vh', overflowY:'auto' }}>
              {announcements && announcements.length > 0 ? announcements.map((a, i, arr) => (
                <div key={a.id || i} style={{ padding:'16px', background:'#f8fafc', borderRadius:16, border:'1px solid #e2e8f0' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    {a.tag && <span style={{ fontSize:10.5, fontWeight:800, color:'#c2410c', background:'#ffedd5', padding:'3px 10px', borderRadius:20, border:'1px solid #fed7aa' }}>{a.tag}</span>}
                    <span style={{ fontSize:11.5, color:'#64748b', fontWeight:600 }}>{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:'0 0 6px 0' }}>{a.title}</h4>
                  <p style={{ fontSize:13.5, color:'#475569', lineHeight:1.55, margin:0 }}>{a.message || a.content}</p>
                </div>
              )) : (
                <p style={{ fontSize:13.5, color:'#64748b', fontStyle:'italic', textAlign:'center', padding:'20px' }}>No broadcast updates yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(15, 23, 42, 0.4)', backdropFilter:'blur(8px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#ffffff', border:'2px solid #fed7aa', borderRadius:24, width:'100%', maxWidth:520, overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.15)', position:'relative' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1.5px solid #f1e7db', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fffaf3' }}>
              <div style={{ fontSize:18, fontWeight:900, color:'#0f172a' }}>👑 Squad Commander Profile</div>
              <button onClick={() => setShowProfile(false)} style={{ background:'none', border:'none', fontSize:24, cursor:'pointer', color:'#94a3b8' }}>&times;</button>
            </div>
            <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:16, maxHeight:'75vh', overflowY:'auto' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:800, color:'#64748b', textTransform:'uppercase' }}>Leader Full Name</label>
                <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e2e8f0', borderRadius:12, padding:'10px 14px', gap:10, background:'#f8fafc' }}>
                  <span style={{ color:'#0284c7' }}>👤</span>
                  <input type="text" defaultValue={user?.user_metadata?.full_name || ''} placeholder="Full Name" readOnly style={{ border:'none', outline:'none', width:'100%', fontSize:13.5, background:'transparent', color:'#0f172a', fontWeight:600, cursor:'not-allowed' }}/>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:800, color:'#64748b', textTransform:'uppercase' }}>Leader College Email</label>
                <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e2e8f0', borderRadius:12, padding:'10px 14px', gap:10, background:'#f8fafc' }}>
                  <span style={{ color:'#0284c7' }}>✉️</span>
                  <input type="email" defaultValue={user?.email || ''} readOnly style={{ border:'none', outline:'none', width:'100%', fontSize:13.5, background:'transparent', color:'#0f172a', fontWeight:600, cursor:'not-allowed' }}/>
                </div>
              </div>
            </div>
            
            <div style={{ padding:'20px 24px', borderTop:'1.5px solid #f1e7db', display:'flex', flexDirection:'column', gap:10, background:'#fafafa' }}>
              <button onClick={() => navigate('/')} style={{ padding:'12px 18px', borderRadius:12, border:'1.5px solid #cbd5e1', background:'#ffffff', fontWeight:800, color:'#334155', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', transition:'all 0.2s' }}>
                <span>← Return to Mothership</span>
              </button>
              <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} style={{ padding:'12px 18px', borderRadius:12, border:'1.5px solid #fecaca', background:'#fef2f2', fontWeight:800, color:'#b91c1c', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', transition:'all 0.2s' }}>
                <span>🚪 Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button, input, textarea { font-family: inherit; }
        .dash-bottom-nav { display: none; }
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-bottom-nav { 
            display: flex; position: fixed; bottom: 0; left: 0; right: 0; 
            background: #ffffff; border-top: 2px solid #fed7aa; z-index: 50; 
            justify-content: space-between; align-items: center; 
            padding: 8px 12px;
            padding-bottom: calc(8px + env(safe-area-inset-bottom));
            gap: 4px;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
          }
          .dash-main-wrapper { padding-bottom: calc(68px + env(safe-area-inset-bottom)) !important; }
          .dash-header { padding: 18px 16px 22px !important; min-height: 70px !important; height: auto !important; flex-direction: column; align-items: flex-start !important; justify-content: center; gap: 4px; }
          .dash-subtitle { display: none !important; }
          .dash-header-right { position: absolute; right: 16px; top: 18px; }
          .dash-content { padding: 16px !important; }
          .dash-grid-2 { grid-template-columns: 1fr !important; }
          .dash-grid-4 { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .dash-card { padding: 16px !important; }
          .dash-hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
