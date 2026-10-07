import React from 'react';
import { motion } from 'framer-motion';
import mitMysoreBanner from '../assets/logo/mit-mysore-banner.png';
import emitersSeal from '../assets/logo/emiters-seal.png';
import haxlr8LogoDark from '../assets/logo/haxlr8-logo-dark.png';
import igeniusLogo from '../assets/logo/igenius.png';
import microsoftLogo from '../assets/logo/microsoft.png';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

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

const partners = [
  {
    logo: igeniusLogo,
    name: 'iGenius AI',
    role: 'Innovation Partner',
    sub: 'Next-Gen Artificial Intelligence & Solutions',
  },
  {
    logo: microsoftLogo,
    name: 'Microsoft',
    role: 'Authorized Partner',
    sub: 'Global Cloud & Developer Technologies',
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
                Proudly presented by Maharaja Institute of Technology Mysore and backed by student communities and technology leaders.
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

      {/* ── PARTNERS SECTION ── */}
      <section style={{ padding: '20px clamp(20px, 6vw, 80px) 110px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <ShieldCheck size={20} color="#0284c7" />
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#0f172a' }}>
              TECHNOLOGY & COLLABORATION PARTNERS
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {partners.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  borderRadius: 24,
                  padding: '28px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                    flexShrink: 0,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <img src={p.logo} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase' }}>
                    {p.role}
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '2px 0 4px 0' }}>
                    {p.name}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {p.sub}
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