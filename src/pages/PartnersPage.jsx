import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import mitMysoreBanner from '../assets/logo/mit-mysore-banner.png';
import emitersSeal from '../assets/logo/emiters-seal.png';
import haxlr8LogoDark from '../assets/logo/haxlr8-logo-dark.png';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import { Sparkles, ShieldCheck, HeartHandshake, Rocket, Clock, Mail, Lock, ArrowRight } from 'lucide-react';

const hostedBy = [
  {
    logo: mitMysoreBanner,
    name: 'Maharaja Institute of Technology Mysore',
    label: 'Host Institution',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    description:
      'Maharaja Institute of Technology Mysore (MIT Mysore) is an autonomous premier engineering institution affiliated to VTU Belagavi & approved by AICTE. Committed to academic excellence and technical innovation, MIT Mysore empowers students to build solutions for real-world impact.',
  },
  {
    logo: emitersSeal,
    name: 'Department of ECE — EMITERS',
    label: 'Organizing Squadron',
    badgeColor: '#9333ea',
    badgeBg: '#f3e8ff',
    description:
      'The Department of Electronics and Communication Engineering and EMITERS student forum drive high-impact technical initiatives, hackathons, and hardware-software innovation at MIT Mysore.',
  },
  {
    logo: haxlr8LogoDark,
    name: 'HAXLR8 3.0 Directorate',
    label: 'Student Organizing Committee',
    badgeColor: '#ff3b69',
    badgeBg: '#ffe4e6',
    description:
      'The organizing team of HAXLR8 3.0 brings together passionate student innovators, faculty mentors, and domain leaders to host an unforgettable 24-hour national-level hackathon.',
  },
];

const TEASER_PARTNERS = [
  {
    role: 'Title Sponsor',
    status: 'Declassifying Soon',
    icon: '🏆',
    color: '#d97706',
    bg: '#fef3c7',
    borderColor: '#fde68a',
    desc: 'Grand cash prize benefactor & premier keynote mentor.',
  },
  {
    role: 'Cloud & Tech Partner',
    status: 'Signal Incoming',
    icon: '⚡',
    color: '#0284c7',
    bg: '#e0f2fe',
    borderColor: '#bae6fd',
    desc: 'Developer credits, computing APIs & tech toolkit support.',
  },
  {
    role: 'Platform & Track Partner',
    status: 'Syncing Transmission',
    icon: '🚀',
    color: '#9333ea',
    bg: '#f3e8ff',
    borderColor: '#e9d5ff',
    desc: 'Exclusive problem statements, incubation & internship tracks.',
  },
  {
    role: 'Goodies & Fuel Partner',
    status: 'Fueling Crew',
    icon: '🎁',
    color: '#ff3b69',
    bg: '#ffe4e6',
    borderColor: '#fecdd3',
    desc: 'Hackathon swag bags, energy refreshments & bounty prizes.',
  },
];

export default function PartnersPage() {
  return (
    <div
      style={{
        background: '#fffaf3',
        color: '#0f172a',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
        paddingTop: '150px',
      }}
    >
      {/* Background Soft Aura */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 60% 20%, rgba(254, 205, 211, 0.4) 0%, transparent 60%), radial-gradient(circle at 20% 70%, rgba(254, 240, 138, 0.3) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      {/* ── HERO HEADER ── */}
      <section style={{ padding: '40px clamp(20px, 6vw, 80px) 50px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 32,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ flex: '1 1 420px' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 18px',
                  borderRadius: 9999,
                  background: '#ffe4e6',
                  color: '#ff3b69',
                  marginBottom: 20,
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <HeartHandshake size={16} />
                <span>COMMUNITY & COLLABORATION</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(3rem, 6.5vw, 5.2rem)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em',
                  margin: '0 0 20px',
                  color: '#0f172a',
                }}
              >
                Our Partners
                <br />
                <span style={{ color: '#ff3b69' }}>
                  & Host Institution
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#64748b',
                  lineHeight: 1.7,
                  maxWidth: 520,
                  margin: 0,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                Proudly presented by Maharaja Institute of Technology Mysore and backed by passionate student communities and emerging innovators.
              </p>
            </motion.div>

            {/* Mascot Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 36px',
                background: '#ffffff',
                borderRadius: 32,
                border: '2.5px solid #fde047',
                boxShadow: '0 12px 30px rgba(250, 204, 21, 0.2)',
              }}
            >
              <AmongUsCrewmate color="yellow" hat="crown" size={110} floating={true} interactive={true} speechText="Welcome to MIT Mysore!" />
              <div style={{ marginTop: 14, textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#854d0e', letterSpacing: '0.08em' }}>
                  HOST SQUADRON
                </span>
                <p style={{ fontSize: '12px', color: '#a16207', margin: '2px 0 0', fontWeight: 600 }}>
                  MIT Mysore Base Station
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOSTED BY SECTION ── */}
      <section style={{ padding: '30px clamp(20px, 6vw, 80px) 70px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <Sparkles size={20} color="#ff3b69" />
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#0f172a' }}>
              HOST COMMAND & ORGANIZERS
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 28,
            }}
          >
            {hostedBy.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  borderRadius: 28,
                  overflow: 'hidden',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  cursor: 'default',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Logo Frame */}
                <div
                  style={{
                    background: '#f8fafc',
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    borderBottom: '1.5px solid #f1f5f9',
                  }}
                >
                  <img
                    src={h.logo}
                    alt={h.name}
                    style={{
                      maxHeight: 100,
                      maxWidth: '85%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.06))',
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      color: h.badgeColor,
                      background: h.badgeBg,
                      padding: '4px 14px',
                      borderRadius: 100,
                      width: 'fit-content',
                      marginBottom: 12,
                      textTransform: 'uppercase',
                    }}
                  >
                    {h.label}
                  </span>

                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>
                    {h.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#64748b',
                      lineHeight: 1.65,
                      margin: 0,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {h.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS & COLLABORATIONS SECTION ── */}
      <section style={{ padding: '20px clamp(20px, 6vw, 80px) 110px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: '#ffe4e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff3b69',
                }}
              >
                <Rocket size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                  SPONSORS & COLLABORATIONS
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                  Industry partnerships, developer platforms, and community bounties
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 100,
                background: '#fef3c7',
                border: '1.5px solid #fde68a',
                color: '#b45309',
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 8px #f59e0b',
                }}
              />
              <span>Dropping Soon 🚀</span>
            </div>
          </div>

          {/* Main Dropping Soon Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
              borderRadius: 32,
              padding: 'clamp(28px, 4.5vw, 44px)',
              color: '#ffffff',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 32,
            }}
          >
            {/* Ambient glows */}
            <div
              style={{
                position: 'absolute',
                top: -80,
                right: -80,
                width: 260,
                height: 260,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 59, 105, 0.35) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 260,
                height: 260,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(255, 59, 105, 0.2)',
                    border: '1.5px solid rgba(255, 59, 105, 0.5)',
                    color: '#ff6b8b',
                    padding: '4px 14px',
                    borderRadius: 100,
                    fontSize: '11.5px',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Lock size={12} />
                  <span>TRANSMISSION ENCRYPTED</span>
                </span>
                <span
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  HAXLR8 3.0 PARTNER RADAR
                </span>
              </div>

              <div style={{ maxWidth: 720 }}>
                <h3
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.7rem)',
                    fontWeight: 900,
                    lineHeight: 1.15,
                    margin: '0 0 12px 0',
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Sponsors & Collaborations Dropping Soon!
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(14px, 1.8vw, 16px)',
                    lineHeight: 1.7,
                    color: '#cbd5e1',
                    margin: 0,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  We are actively finalizing official tier sponsors, developer cloud tools, industry problem statements, and exciting goodies for all participating squads. Full reveal incoming!
                </p>
              </div>

              {/* Call to action for potential sponsors */}
              <div
                style={{
                  marginTop: 10,
                  padding: '18px 22px',
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'rgba(255, 59, 105, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff6b8b',
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', display: 'block' }}>
                      Interested in partnering with HAXLR8 3.0?
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Connect with our organizing desk at <strong style={{ color: '#38bdf8' }}>haxlr8ecemitm@gmail.com</strong>
                    </span>
                  </div>
                </div>

                <Link
                  to="/contact"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#ff3b69',
                    color: '#ffffff',
                    padding: '10px 22px',
                    borderRadius: 100,
                    fontSize: '13px',
                    fontWeight: 900,
                    boxShadow: '0 4px 16px rgba(255, 59, 105, 0.4)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span>Connect With Us</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Teaser Radar Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
            }}
          >
            {TEASER_PARTNERS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{
                  background: '#ffffff',
                  borderRadius: 22,
                  padding: '24px 20px',
                  border: `2px dashed ${t.borderColor}`,
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'all 0.25s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: t.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    {t.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 900,
                      color: t.color,
                      background: t.bg,
                      padding: '4px 10px',
                      borderRadius: 100,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {t.status}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '16.5px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
                    {t.role}
                  </h4>
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: '#64748b',
                      lineHeight: 1.55,
                      margin: 0,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {t.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}