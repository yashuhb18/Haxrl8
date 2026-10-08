import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminAuthGate, { useAdminAuth } from './AdminAuthGate';
import haxlr8LogoDark from '../../assets/logo/haxlr8-logo-dark.png';
import { Menu, LogOut } from 'lucide-react';
import { organizerLogout } from './adminAuth';

export const AdminLayoutContext = createContext({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

function AdminLayoutInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const { logout } = useAdminAuth();

  const handleMobileExit = async () => {
    if (logout) {
      await logout();
    } else {
      await organizerLogout();
    }
  };

  return (
    <AdminLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: '#fffaf3',
          position: 'fixed',
          top: 0,
          left: 0,
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          color: '#0f172a',
        }}
      >
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 9990,
            }}
          />
        )}

        {/* Sidebar (Desktop static, Mobile slide-over drawer) */}
        <AdminSidebar />

        {/* Main Content Workspace */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#fffaf3',
            minWidth: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {/* Mobile Top App Bar (Only visible on screens <= 900px) */}
          <div
            className="admin-mobile-topbar"
            style={{
              height: 56,
              background: '#ffffff',
              borderBottom: '1.5px solid #fed7aa',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              flexShrink: 0,
              zIndex: 100,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            }}
          >
            <button
              type="button"
              onClick={toggleSidebar}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                width: 38,
                height: 38,
                cursor: 'pointer',
                color: '#0f172a',
              }}
              aria-label="Toggle Organizer Sidebar Menu"
            >
              <Menu size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src={haxlr8LogoDark} alt="HAXLR8 3.0" style={{ height: 22, objectFit: 'contain' }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  background: '#e0f2fe',
                  border: '1px solid #bae6fd',
                  color: '#0369a1',
                  padding: '2px 7px',
                  borderRadius: 6,
                  letterSpacing: '0.04em',
                }}
              >
                ORGANIZER
              </span>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  padding: '2px 6px',
                  borderRadius: 6,
                }}
              >
                🔒 1m Lock
              </span>
            </div>

            <button
              type="button"
              onClick={handleMobileExit}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                borderRadius: 10,
                width: 38,
                height: 38,
                cursor: 'pointer',
                color: '#dc2626',
              }}
              title="Exit Organizer Deck"
              aria-label="Exit Organizer Deck"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              minWidth: 0,
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-mobile-topbar {
            display: flex !important;
          }
        }
      `}</style>
    </AdminLayoutContext.Provider>
  );
}

export default function AdminLayout() {
  return (
    <AdminAuthGate>
      <AdminLayoutInner />
    </AdminAuthGate>
  );
}
