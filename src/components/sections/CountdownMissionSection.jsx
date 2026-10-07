import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import countdownObservationImg from '../../assets/countdown_observation.png';
import { Calendar, MapPin } from 'lucide-react';

export default function CountdownMissionSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target: November 6, 2026 09:00:00 IST (UTC+5:30)
    const targetDate = new Date('2026-11-06T09:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="countdown"
      style={{
        position: 'relative',
        width: '100%',
        padding: '80px 24px 100px',
        backgroundColor: '#070a13',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '48px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
        className="countdown-mission-grid"
      >
        {/* Left: Cockpit Telemetry Timer Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(56, 254, 220, 0.25)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 254, 220, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Section Heading */}
          <h2
            style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            HAXLR8 3.0 BEGINS IN
          </h2>

          {/* 4 Digital Timer Blocks */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              width: '100%',
              marginBottom: '32px',
            }}
            className="countdown-blocks-grid"
          >
            {[
              { val: timeLeft.days, label: 'DAYS' },
              { val: timeLeft.hours, label: 'HOURS' },
              { val: timeLeft.minutes, label: 'MINUTES' },
              { val: timeLeft.seconds, label: 'SECONDS' },
            ].map((block, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(7, 10, 19, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '20px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
                }}
              >
                <span
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(block.val).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#64748b',
                    letterSpacing: '0.12em',
                    marginTop: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Bar: 📅 06 - 07 NOVEMBER 2026 | 📍 MIT MYSORE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              width: '100%',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
              <Calendar size={18} strokeWidth={2.4} />
              <span style={{ color: '#e2e8f0' }}>06 - 07 NOVEMBER 2026</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
              <MapPin size={18} strokeWidth={2.4} />
              <span style={{ color: '#e2e8f0' }}>MIT MYSORE</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Observation Window with Planet & Doodle */}
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
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 254, 220, 0.1)',
            background: 'rgba(15, 23, 42, 0.8)',
          }}
        >
          <img
            src={countdownObservationImg}
            alt="Countdown Observation Deck"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
          />

          {/* Window Doodle: 24 HOURS ONE MISSION */}
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
              24 HOURS<br />ONE MISSION
            </span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .countdown-mission-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .countdown-blocks-grid {
            gap: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
