import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import HeroCliffIllustration from './HeroCliffIllustration';
import ChalkboardSignpost from './ChalkboardSignpost';
import DomainWheel from '../ui/DomainWheel';
import haxlr8LogoDark from '../../assets/logo/haxlr8-logo-dark.png';

export default function PlayfulHeroSection() {
  const handleScrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fffaf3',
        overflow: 'hidden',
        paddingTop: 'clamp(140px, 14vw, 175px)',
        paddingBottom: 'clamp(40px, 6vw, 70px)',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ── 1. Soft Warm Cream Sky Background ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 65% 30%, rgba(254, 205, 211, 0.45) 0%, rgba(254, 240, 138, 0.25) 40%, #fffaf3 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating Sparkles & Star Doodles in Sky */}
      <div style={{ position: 'absolute', top: '15%', left: '8%', pointerEvents: 'none', zIndex: 1 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: '22%', right: '12%', pointerEvents: 'none', zIndex: 1 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff3b69">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      {/* Subtle Floating Domain Wheels in Backdrop */}
      <div style={{ position: 'absolute', top: '12%', left: '3%', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }} className="hero-hide-mobile">
        <DomainWheel size={80} />
      </div>
      <div style={{ position: 'absolute', top: '8%', right: '3%', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }} className="hero-hide-mobile">
        <DomainWheel size={110} blur={1} />
      </div>

      {/* ── 2. TWO-COLUMN HERO GRID (Spacious, Airy & Perfectly Balanced!) ── */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3.5vw, 40px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
          }}
          className="hero-main-grid"
        >
          {/* ═══ LEFT COLUMN: Editorial Content & Badges ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="hero-left-content">
            {/* Headline Area: Chalkboard Signpost + Extracted HAXLR8 3.0 Official Logotype */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(14px, 3vw, 24px)',
                marginBottom: '14px',
                flexWrap: 'wrap',
              }}
            >
              {/* Wooden Chalkboard Signpost */}
              <div style={{ flexShrink: 0 }} className="hero-chalkboard-wrapper">
                <ChalkboardSignpost />
              </div>

              {/* Official Extracted HAXLR8 3.0 Logotype */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 180 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={haxlr8LogoDark}
                    alt="HAXLR8 3.0"
                    style={{
                      height: 'clamp(95px, 15vw, 150px)',
                      width: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 24px rgba(255, 59, 105, 0.18))',
                      userSelect: 'none',
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Slogan: IDEAS. IMPOSTERS. INNOVATION. */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{
                fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)',
                fontWeight: 900,
                color: '#1e293b',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: '8px 0 4px',
              }}
            >
              IDEAS. IMPOSTERS. INNOVATION.
            </motion.div>

            {/* Subhead: A NATIONAL LEVEL 24-HOUR HACKATHON */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)',
                fontWeight: 800,
                color: '#ff3b69',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '22px',
              }}
            >
              A NATIONAL LEVEL 24-HOUR HACKATHON
            </motion.div>

            {/* Event Info Badges (Date & Location) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '24px',
              }}
            >
              {/* Date Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #e2e8f0',
                  borderRadius: '100px',
                  padding: '8px 18px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#0f172a',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                }}
              >
                <Calendar size={17} color="#ff3b69" strokeWidth={2.5} />
                <span>NOV 6 – 7, 2026</span>
              </div>

              {/* Location Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #e2e8f0',
                  borderRadius: '100px',
                  padding: '8px 18px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#334155',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                }}
              >
                <MapPin size={17} color="#0284c7" strokeWidth={2.5} />
                <span>Maharaja Institute of Technology Mysore</span>
              </div>
            </motion.div>

            {/* CTA Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '24px',
              }}
            >
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: '#ff3b69',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '16px 36px',
                    fontSize: '17px',
                    fontWeight: 900,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(255, 59, 105, 0.45)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    fontFamily: "'Fredoka', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 59, 105, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 59, 105, 0.45)';
                  }}
                >
                  <span>Register Now</span>
                  <ArrowRight size={20} strokeWidth={2.6} />
                </button>
              </Link>

              <button
                onClick={handleScrollToAbout}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '2.5px solid #0f172a',
                  borderRadius: '100px',
                  padding: '14px 30px',
                  fontSize: '16px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: "'Fredoka', sans-serif",
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Details
              </button>
            </motion.div>

            {/* Scroll Indicator Prompt */}
            <div
              onClick={handleScrollToAbout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '28px',
                  border: '2px solid #64748b',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '4px',
                }}
              >
                <div
                  style={{
                    width: '3.5px',
                    height: '6px',
                    background: '#ff3b69',
                    borderRadius: '2px',
                    animation: 'mouseScroll 1.5s infinite',
                  }}
                />
              </div>
              <span>SCROLL TO EXPLORE</span>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN: Masterpiece Cliff Illustration ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', position: 'relative' }}
          >
            <HeroCliffIllustration />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes mouseScroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(7px); opacity: 0; }
        }

        @media (max-width: 960px) {
          .hero-main-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-left-content {
            align-items: center !important;
          }
          .hero-hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
