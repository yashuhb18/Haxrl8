import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { Menu, X, ArrowRight } from 'lucide-react';
import { playCrewmatePopSound } from '../amongus/AmongUsSound';
import haxlr8LogoDark from '../../assets/logo/haxlr8-logo-dark.png';
import emitersSeal from '../../assets/logo/emiters-seal.png';
import mitMysoreBanner from '../../assets/logo/mit-mysore-banner.png';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/', hash: '#hero' },
  { id: 'partners', label: 'Partners', path: '/partners', hash: '' },
  { id: 'highlights', label: 'Highlights', path: '/highlights', hash: '' },
  { id: 'domains', label: 'Domains', path: '/', hash: '#domains' },
  { id: 'prizes', label: 'Prizes', path: '/prizes', hash: '' },
  { id: 'humans', label: 'Humans', path: '/humans', hash: '' },
  { id: 'faq', label: 'FAQ', path: '/faq', hash: '' },
  { id: 'contact', label: 'Contact', path: '/contact', hash: '' },
];

export default function PlayfulNavbar() {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // On subpages, match by pathname
      const pathMap = {
        '/partners': 'partners',
        '/highlights': 'highlights',
        '/prizes': 'prizes',
        '/humans': 'humans',
        '/faq': 'faq',
        '/contact': 'contact',
      };
      if (pathMap[location.pathname]) {
        setActiveItem(pathMap[location.pathname]);
        return;
      }

      // On home page, match by scroll position
      if (location.pathname === '/') {
        const sections = ['hero', 'about', 'domains', 'timeline', 'prizes-preview'];
        let current = 'home';
        for (const id of sections) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = id === 'hero' ? 'home' : id;
          }
        }
        setActiveItem(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (item) => {
    playCrewmatePopSound();
    setMobileOpen(false);

    if (item.path !== location.pathname) {
      navigate(item.path);
      if (item.hash) {
        setTimeout(() => {
          const el = document.getElementById(item.hash.replace('#', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else if (item.hash) {
      const el = document.getElementById(item.hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isActive = (item) => {
    if (location.pathname === item.path && !item.hash) return true;
    if (location.pathname === '/' && activeItem === item.id) return true;
    return false;
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: scrolled ? 'rgba(255, 250, 243, 0.94)' : 'rgba(255, 250, 243, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1.5px solid rgba(226, 232, 240, 0.8)' : '1.5px solid transparent',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.04)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ═══ OFFICIAL INSTITUTIONAL TOP MASTHEAD (MIT Mysore & Dept. of ECE) ═══ */}
        <div
          className="institutional-top-masthead"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderBottom: '1.5px solid rgba(226, 232, 240, 0.95)',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
            maxHeight: scrolled ? '0px' : '90px',
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? 'translateY(-12px)' : 'translateY(0)',
          }}
        >
          <div
            style={{
              maxWidth: '1360px',
              margin: '0 auto',
              padding: '8px clamp(16px, 3.5vw, 36px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left: Maharaja Institute of Technology Mysore Banner - Big & Crisp */}
            <a
              href="https://mitmysore.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
              title="Maharaja Institute of Technology Mysore"
            >
              <img
                src={mitMysoreBanner}
                alt="Maharaja Institute of Technology Mysore"
                className="institutional-banner-img"
                style={{
                  height: 'clamp(38px, 4.5vw, 52px)',
                  width: 'auto',
                  maxWidth: 'clamp(260px, 45vw, 420px)',
                  objectFit: 'contain',
                  userSelect: 'none',
                }}
              />
            </a>

            {/* Vertical Divider */}
            <div
              className="masthead-divider"
              style={{ width: '1.5px', height: '36px', background: '#cbd5e1' }}
            />

            {/* Right: Department of ECE & EMITERS Seal - Big & Prominent */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <img
                src={emitersSeal}
                alt="EMITERS - Department of ECE"
                className="institutional-seal-img"
                style={{
                  width: 'clamp(44px, 5vw, 56px)',
                  height: 'clamp(44px, 5vw, 56px)',
                  borderRadius: '50%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(147, 51, 234, 0.25))',
                  flexShrink: 0,
                  userSelect: 'none',
                }}
              />
              <div className="masthead-dept-text" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  style={{
                    fontSize: 'clamp(11.5px, 1.1vw, 13.5px)',
                    fontWeight: 900,
                    color: '#0f172a',
                    letterSpacing: '0.02em',
                    lineHeight: 1.25,
                  }}
                >
                  Department of Electronics & Communication Engineering
                </span>
                <span
                  style={{
                    fontSize: 'clamp(10px, 0.95vw, 11px)',
                    fontWeight: 800,
                    color: '#ff3b69',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    lineHeight: 1.25,
                  }}
                >
                  EMITERS Student Forum · Maharaja Institute of Technology Mysore
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PRIMARY HACKATHON NAVIGATION BAR ═══ */}
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '10px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo: Extracted HAXLR8 3.0 Official Logotype */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              aria-label="HAXLR8 3.0 Home"
            >
              <motion.img
                src={haxlr8LogoDark}
                alt="HAXLR8 3.0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  height: '38px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(255, 59, 105, 0.2))',
                }}
              />
            </Link>
          </div>

          {/* Desktop Links (all 8 items) */}
          <nav
            className="playful-nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  style={{
                    background: active ? 'rgba(255, 59, 105, 0.12)' : 'transparent',
                    color: active ? '#ff3b69' : '#334155',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '8px 14px',
                    fontSize: '14px',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#ff3b69';
                      e.currentTarget.style.background = 'rgba(255, 59, 105, 0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#334155';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="navPillIndicator"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255, 59, 105, 0.12)',
                        borderRadius: '100px',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Register Now Button */}
          <div className="playful-nav-cta">
            <Link
              to={user ? '/dashboard' : '/register'}
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
                  transition: 'all 0.25s ease',
                  fontFamily: "'Fredoka', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.boxShadow = '0 8px 22px rgba(15, 23, 42, 0.28)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#0f172a';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.18)';
                }}
              >
                <span>{user ? 'Dashboard' : 'Register Now'}</span>
                <ArrowRight size={16} strokeWidth={2.4} />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="playful-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#0f172a',
              padding: '6px',
            }}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={26} color="#ff3b69" /> : <Menu size={26} color="#0f172a" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: '#fffaf3',
                borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
                padding: '16px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  style={{
                    background: isActive(item) ? 'rgba(255, 59, 105, 0.12)' : 'transparent',
                    color: isActive(item) ? '#ff3b69' : '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: 700,
                    fontFamily: "'Fredoka', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}

              <div style={{ paddingTop: '12px', marginTop: '6px', borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <Link
                  to={user ? '/dashboard' : '/register'}
                  onClick={() => setMobileOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    style={{
                      width: '100%',
                      background: '#ff3b69',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '100px',
                      padding: '12px',
                      fontSize: '15px',
                      fontWeight: 700,
                      fontFamily: "'Fredoka', sans-serif",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(255, 59, 105, 0.35)',
                    }}
                  >
                    <span>{user ? 'Dashboard' : 'Register Now'}</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        @media (max-width: 960px) {
          .playful-nav-links,
          .playful-nav-cta {
            display: none !important;
          }
          .playful-mobile-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .masthead-divider {
            display: none !important;
          }
          .masthead-dept-text {
            display: none !important;
          }
          .institutional-top-masthead {
            padding: 6px 0 !important;
          }
          .institutional-top-masthead > div {
            padding: 4px 14px !important;
            gap: 12px !important;
          }
          .institutional-banner-img {
            height: 32px !important;
            max-width: calc(100vw - 78px) !important;
          }
          .institutional-seal-img {
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>
    </>
  );
}
