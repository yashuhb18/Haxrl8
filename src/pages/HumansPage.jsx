import React from 'react';
import { motion } from 'framer-motion';
import { Users, Terminal, ShieldCheck, Award, Sparkles } from 'lucide-react';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import meImg from '../assets/my image/me.png';
import emitersSeal from '../assets/logo/emiters-seal.png';
import mitMysoreBanner from '../assets/logo/mit-mysore-banner.png';

const studentOrganizers = [
  {
    name: 'Yeshwant HB',
    role: 'Student Coordinator',
    station: 'Chief Flight Engineer',
    org: 'HAXLR8 3.0 · MIT Mysore',
    color: 'cyan',
    hat: 'pilot',
  },
  {
    name: 'Saket Bahamad',
    role: 'Student Coordinator',
    station: 'Mission Operations Lead',
    org: 'HAXLR8 3.0 · MIT Mysore',
    color: 'yellow',
    hat: 'pilot',
  },
];

const staffCoordinators = [
  {
    name: 'Balakrishna K',
    role: 'Faculty Coordinator',
    station: 'Flight Director // Mission Advisor',
    org: 'Maharaja Institute of Technology Mysore',
    color: 'lime',
    hat: 'crown',
  },
  {
    name: 'Sandesh NG',
    role: 'Faculty Coordinator',
    station: 'Flight Director // Mission Advisor',
    org: 'Maharaja Institute of Technology Mysore',
    color: 'purple',
    hat: 'crown',
  },
];

export default function HumansPage() {
  return (
    <div
      style={{
        paddingTop: '150px',
        minHeight: '100vh',
        background: '#fffaf3',
        color: '#0f172a',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
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
            'radial-gradient(circle at 70% 30%, rgba(254, 215, 170, 0.4) 0%, transparent 60%), radial-gradient(circle at 20% 70%, rgba(254, 205, 211, 0.35) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px 100px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          {/* Host pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 18px 6px 10px',
              borderRadius: 9999,
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              marginBottom: 16,
            }}
          >
            <img src={emitersSeal} alt="EMITERS" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            <img src={mitMysoreBanner} alt="MIT Mysore" style={{ height: 20, maxWidth: 160, objectFit: 'contain' }} />
            <div style={{ width: 1, height: 16, background: '#cbd5e1' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Dept. of ECE
            </span>
          </div>

          <div>
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
              <Users size={16} />
              <span>THE HUMANS BEHIND HAXLR8 3.0</span>
            </div>
          </div>

          <h1
            style={{
              fontSize: 'clamp(3rem, 6vw, 5.2rem)',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: '0 0 16px',
            }}
          >
            Meet Our <span style={{ color: '#ff3b69' }}>Flight Crew</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              maxWidth: 580,
              margin: '0 auto',
              lineHeight: 1.65,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            The dedicated faculty advisors and student coordinators working together to make HAXLR8 3.0 an unforgettable national experience at Maharaja Institute of Technology Mysore.
          </p>
        </div>

        {/* 1. Faculty Coordinators Section */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '28px' }}>
            <Award size={22} color="#0284c7" />
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              FACULTY COORDINATORS
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {staffCoordinators.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: '32px 28px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                <AmongUsCrewmate color={c.color} hat={c.hat} size={88} floating={true} interactive={true} />
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#0284c7',
                      background: '#e0f2fe',
                      padding: '4px 12px',
                      borderRadius: 100,
                      display: 'inline-block',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.role}
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
                    {c.org}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. Student Coordinators Section */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '28px' }}>
            <Sparkles size={22} color="#ff3b69" />
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              STUDENT COORDINATORS
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {studentOrganizers.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: '32px 28px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                <AmongUsCrewmate color={c.color} hat={c.hat} size={88} floating={true} interactive={true} />
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#ff3b69',
                      background: '#ffe4e6',
                      padding: '4px 12px',
                      borderRadius: 100,
                      display: 'inline-block',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.role}
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
                    {c.org}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Developer / Lead Architect */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '28px' }}>
            <Terminal size={22} color="#16a34a" />
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              LEAD PLATFORM DEVELOPER
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              padding: '36px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #fde047',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }}
            >
              <img src={meImg} alt="Lead Developer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#16a34a',
                  background: '#dcfce7',
                  padding: '4px 12px',
                  borderRadius: 100,
                  display: 'inline-block',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                }}
              >
                Lead Platform Developer
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
                Full-Stack Systems & Architecture
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0, maxWidth: 580, lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Engineered the registration portals, team management systems, live evaluations, and interactive experiences powering HAXLR8 3.0.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
