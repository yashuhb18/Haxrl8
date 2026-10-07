import React from 'react';
import { Link } from 'react-router-dom';
import haxlr8Logo from '../../assets/logo/haxlr8-logo-transparent.png';

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const FOOTER_NAV_LINKS = [
  { label: 'Home', path: '/', hash: '#hero' },
  { label: 'About', path: '/', hash: '#mission' },
  { label: 'Domains', path: '/', hash: '#domains' },
  { label: 'Timeline', path: '/', hash: '#timeline' },
  { label: 'Prizes', path: '/', hash: '#reward' },
  { label: 'FAQ', path: '/faq', hash: '' },
];

export default function Footer() {
  const handleNavClick = (item) => {
    if (item.hash) {
      const el = document.getElementById(item.hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#05070d',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '50px 24px 30px',
        color: '#94a3b8',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
        }}
      >
        {/* Top Row: Logo & Slogan | Nav Links | Social Icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
          className="footer-top-row"
        >
          {/* Left: HAXLR8 3.0 Logo + BUILD. SOLVE. SURVIVE. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ textDecoration: 'none', display: 'inline-flex' }}
            >
              <img
                src={haxlr8Logo}
                alt="HAXLR8 3.0"
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.35))',
                }}
              />
            </Link>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: '#e2e8f0',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              BUILD. SOLVE. SURVIVE.
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              flexWrap: 'wrap',
            }}
            className="footer-nav-links"
          >
            {FOOTER_NAV_LINKS.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                onClick={() => handleNavClick(item)}
                style={{
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Social Media Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://www.instagram.com/mitmysore_official/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              aria-label="Instagram"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href="https://www.linkedin.com/school/maharaja-institute-of-technology-mysore/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Line: Organizer Information & Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: '#64748b',
          }}
          className="footer-bottom-line"
        >
          <div>
            Department of Electronics & Communication Engineering, Maharaja Institute of Technology, Mysore
          </div>
          <div>
            © 2026 HAXLR8 3.0 · All Rights Reserved
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-top-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .footer-nav-links {
            gap: 16px !important;
          }
          .footer-bottom-line {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </footer>
  );
}
