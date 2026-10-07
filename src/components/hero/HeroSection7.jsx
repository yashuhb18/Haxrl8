import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import haxlr8Logo from '../../assets/logo/haxlr8-logo-transparent.png';
import heroCockpitImg from '../../assets/hero_cockpit_view.jpg';
import { Calendar, MapPin, ArrowRight, Award, Clock, Globe } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';

export default function HeroSection7() {
  const user = useAuth();

  const handleEnterMission = () => {
    const el = document.getElementById('mission');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#070a13',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '80px',
        paddingBottom: '40px',
      }}
    >
      {/* ── Background: Cinematic Space Cockpit ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroCockpitImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          opacity: 0.85,
          zIndex: 0,
        }}
      />

      {/* Cockpit ambient overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 10, 19, 0.75) 0%, rgba(7, 10, 19, 0.45) 45%, rgba(7, 10, 19, 0.95) 90%, #070a13 100%)',
          zIndex: 1,
        }}
      />

      {/* Red ambient cockpit lighting on top-left / top-right */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '5%',
          width: '350px',
          height: '250px',
          background: 'radial-gradient(ellipse at top left, rgba(239, 68, 68, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '5%',
          width: '350px',
          height: '250px',
          background: 'radial-gradient(ellipse at top right, rgba(239, 68, 68, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Window Chalk / Doodle Top-Left: SAME CREW DIFFERENT PATHS */}
      <div
        className="cockpit-window-doodle"
        style={{
          position: 'absolute',
          top: '100px',
          left: '60px',
          zIndex: 5,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          opacity: 0.85,
        }}
      >
        <svg width="28" height="20" viewBox="0 0 24 16" fill="none" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 14L5 4L12 10L19 4L22 14H2Z" />
          <circle cx="5" cy="3" r="1" fill="rgba(148, 163, 184, 0.7)" />
          <circle cx="12" cy="9" r="1" fill="rgba(148, 163, 184, 0.7)" />
          <circle cx="19" cy="3" r="1" fill="rgba(148, 163, 184, 0.7)" />
        </svg>
        <div style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'rgba(148, 163, 184, 0.8)',
          textAlign: 'center',
          lineHeight: 1.3,
        }}>
          SAME<br />CREW<br />DIFFERENT<br />PATHS
        </div>
      </div>

      {/* ── Center Content Hero Stack ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px',
          maxWidth: '920px',
          width: '100%',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        {/* Crown doodle above logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '6px' }}
        >
          <svg width="34" height="22" viewBox="0 0 24 16" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 14L5 4L12 10L19 4L22 14H2Z" />
            <circle cx="5" cy="3" r="1.2" fill="#f87171" />
            <circle cx="12" cy="9" r="1.2" fill="#f87171" />
            <circle cx="19" cy="3" r="1.2" fill="#f87171" />
          </svg>
        </motion.div>

        {/* Centered HAXLR8 3.0 Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: '18px' }}
        >
          <img
            src={haxlr8Logo}
            alt="HAXLR8 3.0"
            style={{
              height: 'clamp(60px, 10vw, 110px)',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 35px rgba(239, 68, 68, 0.45))',
            }}
          />
        </motion.div>

        {/* Headline: THE CREW HAS BEEN CALLED. */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 3.4rem)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.2)',
          }}
        >
          THE CREW HAS BEEN CALLED.
        </motion.h1>

        {/* Subhead: 24-HOUR NATIONAL LEVEL HACKATHON */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: 'clamp(0.85rem, 1.8vw, 1.25rem)',
            fontWeight: 800,
            color: '#cbd5e1',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '16px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
          }}
        >
          24-HOUR NATIONAL LEVEL HACKATHON
        </motion.div>

        {/* Metadata line: 📅 06 - 07 NOVEMBER 2026 · 📍 MIT MYSORE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            flexWrap: 'wrap',
            color: '#94a3b8',
            fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#f87171' }}>
            <Calendar size={17} strokeWidth={2.4} />
            <span style={{ color: '#e2e8f0' }}>06 - 07 NOVEMBER 2026</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#f87171' }}>
            <MapPin size={17} strokeWidth={2.4} />
            <span style={{ color: '#e2e8f0' }}>MIT MYSORE</span>
          </div>
        </motion.div>

        {/* Primary Red Button: ENTER THE MISSION → */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={handleEnterMission}
            className="hero-enter-mission-btn"
          >
            <span>ENTER THE MISSION</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>

      {/* ── Below Hero: 3 Compact Statistics Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '920px',
          padding: '0 20px',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 254, 220, 0.25)',
            borderRadius: '16px',
            padding: '18px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            alignItems: 'center',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 254, 220, 0.1)',
          }}
          className="hero-stats-grid"
        >
          {/* Stat 1: 03 DOMAINS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <Globe size={26} color="#38fedc" style={{ filter: 'drop-shadow(0 0 8px rgba(56,254,220,0.6))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>03</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>DOMAINS</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.12)', margin: '0 auto' }} className="hero-stats-divider" />

          {/* Stat 2: 24 HOURS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <Clock size={26} color="#38fedc" style={{ filter: 'drop-shadow(0 0 8px rgba(56,254,220,0.6))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>24</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>HOURS</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.12)', margin: '0 auto' }} className="hero-stats-divider" />

          {/* Stat 3: ₹33,333 PRIZE POOL */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <Award size={26} color="#ef4444" style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.6))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>₹33,333</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>PRIZE POOL</span>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .hero-enter-mission-btn {
          background: #dc2626;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 14px 38px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.06em;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 0 28px rgba(220, 38, 38, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-enter-mission-btn:hover {
          background: #ef4444;
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 40px rgba(239, 68, 68, 0.85), inset 0 0 15px rgba(255, 255, 255, 0.3);
        }

        .hero-enter-mission-btn:active {
          transform: translateY(0) scale(0.98);
        }

        @media (max-width: 768px) {
          .cockpit-window-doodle {
            display: none !important;
          }
          .hero-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 20px !important;
          }
          .hero-stats-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
