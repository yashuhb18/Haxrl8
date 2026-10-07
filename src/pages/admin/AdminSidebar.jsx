import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Users, Flag, CheckSquare, Bell, LayoutDashboard, LogOut, FileText, TrendingUp, Shield } from 'lucide-react';
import haxlr8LogoDark from '../../assets/logo/haxlr8-logo-dark.png';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

const S = {
  card: '#FFFFFF', border: '#FED7AA', primary: '#0284C7',
  t1: '#0F172A', t2: '#64748B', t3: '#94A3B8', activeBg: '#E0F2FE',
  activeBorder: '#7DD3FC',
};

const navItems = [
  { icon: Home, label: 'Dashboard', subPath: '' },
  { icon: Users, label: 'Users & Leads', subPath: '/users' },
  { icon: Flag, label: 'Squads & Teams', subPath: '/teams' },
  { icon: FileText, label: 'Submissions', subPath: '/submissions' },
  { icon: CheckSquare, label: 'Evaluations', subPath: '/evaluations' },
  { icon: FileText, label: 'Jury Export (XLSX)', subPath: '/jury' },
  { icon: TrendingUp, label: 'Analytics', subPath: '/analytics' },
  { icon: Bell, label: 'Announcements', subPath: '/announcements' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/udview';

  return (
    <aside style={{ width: 250, minWidth: 250, background: S.card, borderRight: '2px solid ' + S.border, display: 'flex', flexDirection: 'column', flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ height: 68, padding: '0 20px', borderBottom: '1.5px solid #F1E7DB', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={haxlr8LogoDark} alt="HAXLR8 3.0" style={{ height: 26, objectFit: 'contain' }} />
        <div style={{ marginLeft: 'auto', background: '#E0F2FE', border: '1.5px solid #BAE6FD', padding: '3px 8px', borderRadius: 8, fontSize: 10, fontWeight: 900, color: '#0369A1', letterSpacing: '0.04em' }}>
          ORGANIZER
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const fullPath = `${basePath}${item.subPath}`;
          const isActive = item.subPath === ''
            ? (location.pathname === basePath || location.pathname === `${basePath}/`)
            : location.pathname.startsWith(fullPath);

          return (
            <Link
              key={i}
              to={fullPath}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? S.primary : S.t2,
                background: isActive ? S.activeBg : 'transparent',
                border: isActive ? '1px solid ' + S.activeBorder : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all .15s'
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F0F9FF'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={17} color={isActive ? S.primary : '#94A3B8'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Among Us Crewmate Indicator */}
      <div style={{ padding: '10px 12px', margin: '0 12px 10px', background: '#F0F9FF', borderRadius: 14, border: '1.5px solid #BAE6FD', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AmongUsCrewmate color="red" size={38} hat="cap" speechText="Admin Terminal Active" />
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Admin Room</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0284C7' }}>● Clearance Verified</div>
        </div>
      </div>

      <div style={{ padding: '16px 12px', borderTop: '1.5px solid #F1E7DB', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            color: S.t2,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            cursor: 'pointer'
          }}
        >
          <LayoutDashboard size={16} /> Back to Site
        </button>

        <button
          onClick={() => {
            sessionStorage.removeItem('haxlr8_organizer_session');
            localStorage.removeItem('haxlr8_organizer_session');
            navigate('/admin');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            color: '#B91C1C',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            cursor: 'pointer'
          }}
        >
          <LogOut size={16} /> Exit Organizer Deck
        </button>
      </div>
    </aside>
  );
}
