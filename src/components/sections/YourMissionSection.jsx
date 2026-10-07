import React from 'react';
import { motion } from 'framer-motion';
import missionWorkstationImg from '../../assets/mission_workstation.png';
import { ShieldCheck, Zap, Target } from 'lucide-react';

export default function YourMissionSection() {
  return (
    <section
      id="mission"
      style={{
        position: 'relative',
        width: '100%',
        padding: '120px 24px 100px',
        backgroundColor: '#070a13',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
        className="your-mission-grid"
      >
        {/* Left: Text Briefing */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Title: YOUR MISSION */}
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
            }}
          >
            YOUR <span style={{ color: '#ef4444' }}>MISSION</span>
          </h2>

          {/* Subhead: Build. Solve. Survive. */}
          <h3
            style={{
              fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              margin: '0 0 24px 0',
            }}
          >
            Build. Solve. Survive.
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.75,
              color: '#94a3b8',
              maxWidth: '560px',
              margin: '0 0 36px 0',
            }}
          >
            HAXLR8 3.0 is a 24-hour national level hackathon where teams turn bold ideas into real-world solutions across three impactful domains.
          </p>

          {/* 3 Mission Pillars / Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 254, 220, 0.1)', border: '1px solid rgba(56, 254, 220, 0.25)', color: '#38fedc' }}>
                <Target size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>Real-World Impact</h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.5 }}>Develop high-value prototypes directly addressing current industry and societal challenges.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}>
                <Zap size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>24 Hours of Pure Innovation</h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.5 }}>Collaborate, iterate, and deploy alongside the brightest undergraduate minds in the country.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 254, 220, 0.1)', border: '1px solid rgba(56, 254, 220, 0.25)', color: '#38fedc' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>₹33,333 Bounty Pool</h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.5 }}>Compete for cash rewards, mentorship from industry veterans, and recognized credentials.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Spaceship Window & Workstation Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.15)',
            background: 'rgba(15, 23, 42, 0.8)',
          }}
        >
          <img
            src={missionWorkstationImg}
            alt="Your Mission Workstation"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
          />

          {/* Neon Graffiti Overlay on right of window: TURN IDEAS INTO IMPACT with crown */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
            }}
          >
            <svg width="22" height="15" viewBox="0 0 24 16" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8">
              <path d="M2 14L5 4L12 10L19 4L22 14H2Z" />
            </svg>
            <span
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '11px',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.85)',
                textAlign: 'center',
                letterSpacing: '0.1em',
                lineHeight: 1.25,
              }}
            >
              TURN<br />IDEAS<br />INTO<br />IMPACT
            </span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .your-mission-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
