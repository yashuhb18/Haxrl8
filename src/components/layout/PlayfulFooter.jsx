import React from 'react';
import { Link } from 'react-router-dom';
import haxlr8LogoWhite from '../../assets/logo/haxlr8-logo-white.png';
import mitMysoreLogo from '../../assets/logo/mit-mysore-logo.png';
import emitersSeal from '../../assets/logo/emiters-seal.png';

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

const FOOTER_LINKS = [
  { label: 'Home', path: '/', hash: '#hero' },
  { label: 'About', path: '/', hash: '#about' },
  { label: 'Timeline', path: '/', hash: '#timeline' },
  { label: 'Domains', path: '/', hash: '#domains' },
  { label: 'Prizes', path: '/', hash: '#prizes' },
  { label: 'FAQ', path: '/', hash: '#faq' },
  { label: 'Contact', path: '/contact', hash: '' },
  { label: 'Partners', path: '/partners', hash: '' },
  { label: 'Highlights', path: '/highlights', hash: '' },
  { label: 'Organizers', path: '/humans', hash: '' },
];

export default function PlayfulFooter() {
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
        backgroundColor: '#0c081e',
        color: '#ffffff',
        padding: '70px 24px 36px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
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
          gap: '48px',
        }}
      >
        {/* Top Grid: Brand & Slogan | Quick Links | Contact info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.4fr 1fr',
            gap: '40px',
            alignItems: 'flex-start',
          }}
          className="playful-footer-grid"
        >
          {/* Col 1: Brand & Slogan */}
          <div>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                marginBottom: '14px',
              }}
              aria-label="HAXLR8 3.0 Home"
            >
              <img
                src={haxlr8LogoWhite}
                alt="HAXLR8 3.0"
                style={{
                  height: '44px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>

            <p
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#f43f5e',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
              }}
            >
              IDEAS. IMPOSTERS. INNOVATION.
            </p>

            <p
              style={{
                fontSize: '14px',
                color: '#94a3b8',
                lineHeight: 1.6,
                maxWidth: '320px',
                margin: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              National Level 24-Hour Hackathon hosted by the Department of Electronics & Communication Engineering at Maharaja Institute of Technology Mysore.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.04em',
              }}
            >
              QUICK NAVIGATION
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px 20px',
              }}
            >
              {FOOTER_LINKS.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => handleNavClick(link)}
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff3b69')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Contact & Organizers */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.04em',
              }}
            >
              HEADQUARTERS
            </h4>

            <p
              style={{
                fontSize: '13.5px',
                color: '#e2e8f0',
                lineHeight: 1.6,
                margin: '0 0 16px 0',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Department of Electronics & Communication Engineering<br />
              <strong>Maharaja Institute of Technology Mysore</strong><br />
              Belagola, Mandya, Karnataka
            </p>

            {/* Host Institution & Department (Both logos shortly with words) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '22px',
                maxWidth: '380px',
              }}
            >
              {/* MIT Mysore & Dept of ECE */}
              <a
                href="https://mitmysore.in/electronics-communication-engineering/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
                title="Maharaja Institute of Technology Mysore - ECE Department"
              >
                <img
                  src={mitMysoreLogo}
                  alt="MIT Mysore"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    flexShrink: 0,
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
                    Maharaja Institute of Technology Mysore
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>
                    Dept. of Electronics &amp; Communication Engineering
                  </span>
                </div>
              </a>

              {/* Department of ECE & EMITERS */}
              <a
                href="https://mitmysore.in/electronics-communication-engineering/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
                title="Department of ECE Website"
              >
                <img
                  src={emitersSeal}
                  alt="Department of ECE"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    flexShrink: 0,
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
                    Visit Department Website ↗
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.02em' }}>
                    mitmysore.in/electronics-communication-engineering
                  </span>
                </div>
              </a>
            </div>

            {/* Official Social Links (Instagram only) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <a
                href="https://www.instagram.com/haxlr8_3.0/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 59, 105, 0.12)',
                  border: '1px solid rgba(255, 59, 105, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 59, 105, 0.25)';
                  e.currentTarget.style.borderColor = '#ff3b69';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 59, 105, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 59, 105, 0.3)';
                }}
                aria-label="Official HAXLR8 3.0 Instagram"
              >
                <InstagramIcon size={18} />
                <span>@haxlr8_3.0</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12.5px',
            color: '#64748b',
          }}
        >
          <div>
            © 2026 HAXLR8 3.0 · Maharaja Institute of Technology Mysore
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>Terms & Conditions</Link>
            <span>•</span>
            <Link to="/privacy" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy Policy</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .playful-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
