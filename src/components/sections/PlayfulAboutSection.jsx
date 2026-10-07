import React from 'react';
import { motion } from 'framer-motion';
import AmongUsCrewmate from '../amongus/AmongUsCrewmate';
import { Users, GraduationCap, Globe, Trophy, Lightbulb } from 'lucide-react';
import emitersSeal from '../../assets/logo/emiters-seal.png';
import mitMysoreBanner from '../../assets/logo/mit-mysore-banner.png';
import haxlr8LogoContrast from '../../assets/logo/haxlr8-logo-contrast.png';

const STAT_CARDS = [
  {
    icon: Users,
    iconColor: '#f97316',
    value: '3 – 4',
    label: 'Team Size',
  },
  {
    icon: GraduationCap,
    iconColor: '#0284c7',
    value: 'UG Students',
    label: 'Any College',
  },
  {
    icon: Globe,
    iconColor: '#10b981',
    value: 'Inter-College',
    label: 'Teams Allowed',
  },
  {
    icon: Trophy,
    iconColor: '#eab308',
    value: '₹33,333',
    label: 'Prize Pool',
  },
];

export default function PlayfulAboutSection() {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fffaf3',
        overflow: 'hidden',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
        marginTop: '-20px',
      }}
    >
      {/* ── Top Organic Wave Transition (Cream into Pink) ── */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '70px', display: 'block' }}
        >
          <path
            d="M0 45 C320 85, 640 5, 960 55 C1220 95, 1380 30, 1440 45 L1440 90 L0 90 Z"
            fill="url(#pinkWaveFill)"
          />
          <defs>
            <linearGradient id="pinkWaveFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3b69" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Main Coral / Pink Wave Container ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ff3b69 0%, #f43f5e 55%, #fb7185 100%)',
          padding: '40px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Floating Soft Bubbles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '260px',
            height: '260px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-70px',
            left: '20%',
            width: '240px',
            height: '240px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* Content Layout Container */}
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1.15fr 1.4fr',
              gap: 'clamp(20px, 3.5vw, 48px)',
              alignItems: 'center',
            }}
            className="about-grid-layout"
          >
            {/* 1. Yellow Crewmate Popping Up with Glowing Lightbulb 💡 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
              className="about-yellow-crew-wrapper"
            >
              {/* Floating Glowing Lightbulb */}
              <motion.div
                animate={{ y: [-4, 6, -4], rotate: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#fef08a',
                  border: '3px solid #0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 28px rgba(254, 240, 138, 0.95), 0 4px 10px rgba(0,0,0,0.15)',
                  marginBottom: '-16px',
                  zIndex: 10,
                }}
              >
                <Lightbulb size={26} color="#ca8a04" strokeWidth={2.6} />
              </motion.div>

              <AmongUsCrewmate
                color="yellow"
                size={125}
                hat="none"
                floating={true}
                interactive={true}
                speechText="Idea → Build → Win!"
              />
            </motion.div>

            {/* 2. Headline & Narrative Description */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ color: '#ffffff' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(10px)',
                  padding: '5px 16px 5px 10px',
                  borderRadius: '100px',
                  marginBottom: '16px',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
                  flexWrap: 'wrap',
                }}
              >
                <img src={emitersSeal} alt="EMITERS" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'contain' }} />
                <div style={{ background: '#ffffff', borderRadius: '6px', padding: '2px 8px', display: 'flex', alignItems: 'center' }}>
                  <img src={mitMysoreBanner} alt="MIT Mysore" style={{ height: '17px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Dept. of ECE Presents
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.95)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  WHAT IS
                </span>
                <img
                  src={haxlr8LogoContrast}
                  alt="HAXLR8 3.0"
                  style={{
                    height: 'clamp(54px, 7vw, 76px)',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: 'rgba(255, 255, 255, 0.96)',
                  margin: '0 0 12px 0',
                  fontWeight: 500,
                }}
              >
                A national level hackathon organized by the Department of Electronics & Communication Engineering, Maharaja Institute of Technology, Mysore.
              </p>

              <p
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.88)',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                A platform for innovators, creators and problem solvers to collaborate, build and showcase ideas that shape the future.
              </p>
            </motion.div>

            {/* 3. Four Rounded White Cards in a Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
              }}
              className="about-stat-cards-grid"
            >
              {STAT_CARDS.map((card, idx) => {
                const IconComp = card.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: 0.1 + idx * 0.08 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.96)',
                      borderRadius: '24px',
                      padding: '24px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.14)',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      cursor: 'default',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        color: card.iconColor,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <IconComp size={24} strokeWidth={2.4} />
                    </div>

                    <span
                      style={{
                        fontSize: 'clamp(1.15rem, 1.8vw, 1.5rem)',
                        fontWeight: 900,
                        color: '#0f172a',
                        lineHeight: 1.1,
                        fontFamily: "'Fredoka', sans-serif",
                        marginBottom: '4px',
                      }}
                    >
                      {card.value}
                    </span>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#64748b',
                        lineHeight: 1.25,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {card.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Organic Wave Transition (Pink back into Cream) ── */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, marginTop: '-1px' }}>
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '70px', display: 'block' }}
        >
          <path
            d="M0 0 L1440 0 L1440 45 C1220 90, 960 5, 640 55 C320 100, 160 20, 0 45 Z"
            fill="url(#pinkWaveFillBottom)"
          />
          <defs>
            <linearGradient id="pinkWaveFillBottom" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3b69" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .about-grid-layout {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .about-stat-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .about-yellow-crew-wrapper {
            margin-bottom: 8px;
          }
        }

        @media (max-width: 640px) {
          .about-stat-cards-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
