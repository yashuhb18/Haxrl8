import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Terminal, ShieldCheck, Award, Sparkles, Phone } from 'lucide-react';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import balakrishnaImg from '../assets/humans/balakrishna.png';
import sandeshImg from '../assets/humans/sandesh.jpg';
import yashwanthImg from '../assets/humans/yashwanth.png';
import emitersSeal from '../assets/logo/emiters-seal.png';
import mitMysoreBanner from '../assets/logo/mit-mysore-banner.png';
import { fetchCoordinators, getLocalCoordinators } from '../lib/coordinatorsService';

const resolveHumanPhoto = (c) => {
  if (c.photo === null) return null;
  if (c.photo && (c.photo.startsWith('http://') || c.photo.startsWith('https://') || c.photo.startsWith('data:'))) {
    return c.photo;
  }
  const name = c.name?.toLowerCase() || '';
  if (name.includes('balakrishna')) return balakrishnaImg;
  if (name.includes('sandesh') && (c.type === 'faculty' || c.role?.toLowerCase().includes('faculty'))) return sandeshImg;
  if (name.includes('yashwanth')) return c.photo || yashwanthImg;
  if (c.photo && !c.photo.startsWith('/assets/')) return c.photo;
  return c.defaultPhoto || null;
};

export default function HumansPage() {
  const [coordinators, setCoordinators] = useState(() => getLocalCoordinators());

  useEffect(() => {
    fetchCoordinators().then(res => {
      if (res) setCoordinators(res);
    });

    const handler = (e) => {
      if (e.detail) {
        setCoordinators(e.detail);
      }
    };
    window.addEventListener('haxlr8_coordinators_updated', handler);
    return () => window.removeEventListener('haxlr8_coordinators_updated', handler);
  }, []);

  const staffCoordinators = coordinators.faculty || [];
  const studentOrganizers = coordinators.students || [];
  const yashwanthData = studentOrganizers.find(s => s.name?.toLowerCase().includes('yashwanth')) || { photo: yashwanthImg, phone: '+91 80506 14849' };
  const leadArchitect = coordinators.leadArchitect || {
    name: 'Yashwanth H B',
    role: 'Lead Platform Architect',
    designation: 'Systems Engineer & Lead Platform Architect',
    photo: null,
    defaultPhoto: yashwanthImg,
    phone: '+91 80506 14849',
    github: 'https://github.com/yashuhb18',
    linkedin: 'https://www.linkedin.com/in/yashwanthhb/'
  };

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
            {staffCoordinators.map((c, i) => {
              const photo = resolveHumanPhoto(c);
              return (
              <motion.div
                key={c.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: '28px 24px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '22px',
                }}
              >
                {photo ? (
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '26px',
                      overflow: 'hidden',
                      border: '3px solid #e2e8f0',
                      boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
                      background: '#f8fafc',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={photo}
                      alt={c.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 15%',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ flexShrink: 0, width: 100, display: 'flex', justifyContent: 'center' }}>
                    <AmongUsCrewmate color={c.color || 'lime'} hat={c.hat || 'crown'} size={96} floating={true} interactive={true} />
                  </div>
                )}
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
                  <h3 style={{ fontSize: '21px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                    {c.designation || c.org}
                  </p>
                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, '')}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#0284c7',
                        textDecoration: 'none',
                        background: '#f0f9ff',
                        padding: '3px 10px',
                        borderRadius: '8px',
                      }}
                    >
                      <Phone size={12} />
                      <span>{c.phone}</span>
                    </a>
                  )}
                </div>
              </motion.div>
              );
            })}
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
            {studentOrganizers.map((c, i) => {
              const photo = resolveHumanPhoto(c);
              return (
              <motion.div
                key={c.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: '28px 24px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '22px',
                }}
              >
                {photo ? (
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '26px',
                      overflow: 'hidden',
                      border: '3px solid #ffe4e6',
                      boxShadow: '0 8px 18px rgba(255, 59, 105, 0.12)',
                      background: '#fff1f2',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={photo}
                      alt={c.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 15%',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ flexShrink: 0, width: 100, display: 'flex', justifyContent: 'center' }}>
                    <AmongUsCrewmate color={c.color || 'cyan'} hat={c.hat || 'pilot'} size={96} floating={true} interactive={true} />
                  </div>
                )}
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
                  <h3 style={{ fontSize: '21px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                    {c.org || c.station}
                  </p>
                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, '')}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#ff3b69',
                        textDecoration: 'none',
                        background: '#fff1f2',
                        padding: '3px 10px',
                        borderRadius: '8px',
                      }}
                    >
                      <Phone size={12} />
                      <span>{c.phone}</span>
                    </a>
                  )}
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. Lead Platform Architect */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '28px' }}>
            <Terminal size={22} color="#0284c7" />
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              LEAD PLATFORM ARCHITECT
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
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
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: '30px',
                overflow: 'hidden',
                border: '3.5px solid #38bdf8',
                boxShadow: '0 10px 25px rgba(2, 132, 199, 0.2)',
                flexShrink: 0,
                background: '#f0f9ff',
              }}
            >
              <img
                src={leadArchitect.photo || leadArchitect.defaultPhoto || yashwanthImg}
                alt="Yashwanth H B - Lead Platform Architect"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
              />
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#0284c7',
                    background: '#e0f2fe',
                    padding: '4px 12px',
                    borderRadius: 100,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Lead Platform Architect
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: 100,
                  }}
                >
                  Systems Engineer
                </span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
                {leadArchitect.name || 'Yashwanth H B'}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 16px 0', maxWidth: 640, lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
                {leadArchitect.bio || 'Architected and engineered the end-to-end HAXLR8 3.0 digital platform, real-time registration sync, Supabase authentication & database infrastructure, automated registration verification systems, and digital jury evaluation infrastructure.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {/* Phone */}
                <a
                  href={`tel:${(leadArchitect.phone || '8050614849').replace(/\s+/g, '')}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0284c7',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={14} />
                  <span>{leadArchitect.phone || '+91 80506 14849'}</span>
                </a>

                {/* GitHub Link */}
                <a
                  href={leadArchitect.github || 'https://github.com/yashuhb18'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0f172a',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>

                {/* LinkedIn Link */}
                <a
                  href={leadArchitect.linkedin || 'https://www.linkedin.com/in/yashwanthhb/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0284c7',
                    background: '#e0f2fe',
                    border: '1px solid #bae6fd',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0284c7'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#e0f2fe'; e.currentTarget.style.color = '#0284c7'; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                  Dept. of ECE · Maharaja Institute of Technology Mysore
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
