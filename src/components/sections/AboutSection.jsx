import { useEffect, useRef, useState } from 'react';
import { theme } from '../../theme';
import MagnetLines from '../ui/MagnetLines';
import { motion } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';

const STATS = [
  { value: '24h', label: 'In-Orbit Hacking' },
  { value: '₹30K', label: 'Ship Bounty Pool' },
  { value: '3', label: 'Station Sectors' },
  { value: 'National', label: 'Space Class' },
];

const PILLARS = [
  {
    id: 'agriculture',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
    title: 'Agriculture',
    body: 'Harness IoT, AI, computer vision, and automation to empower farmers, optimize crop yield, and streamline supply chains.',
  },
  {
    id: 'smart-city',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18"/>
        <path d="M19 21V7l-6-4-6 4v14"/>
        <path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/>
        <path d="M15 9v.01"/><path d="M15 12v.01"/><path d="M15 15v.01"/>
      </svg>
    ),
    title: 'Smart City',
    body: 'Engineer intelligent urban systems for energy grids, traffic management, waste reduction, and civic infrastructure.',
  },
  {
    id: 'healthcare',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Healthcare',
    body: 'Build cutting-edge digital health tools, diagnostic aids, remote monitoring, and emergency response platforms.',
  },
];

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.about-animate');
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity ${theme.transitions.slow}, transform ${theme.transitions.slow}`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const styles = {
    section: {
      position: 'relative',
      padding: '100px 2.5rem 80px',
      backgroundColor: '#070a13',
      maxWidth: '100%',
      margin: '0 auto',
      overflow: 'hidden',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      opacity: 0.15,
      pointerEvents: 'none',
      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(56, 254, 220, 0.08) 0%, transparent 60%), linear-gradient(to right, rgba(56, 254, 220, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 254, 220, 0.03) 1px, transparent 1px)`,
      backgroundSize: '100% 100%, 48px 48px, 48px 48px',
      zIndex: 0,
    },
    innerWrap: {
      maxWidth: '1440px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    intro: {
      marginBottom: '80px',
    },
    introInner: {
      width: '100%',
    },
    label: {
      fontSize: '0.75rem',
      fontWeight: 800,
      letterSpacing: '0.22em',
      color: '#38fedc',
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
    },
    heading: {
      fontFamily: theme.fonts.heading,
      fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
      marginBottom: '3rem',
      color: '#f8fafc',
    },
    introCols: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr auto',
      gap: '2.5rem',
      alignItems: 'stretch',
    },
    card: {
      background: 'rgba(15, 23, 42, 0.78)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(56, 254, 220, 0.18)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    bodyText: {
      fontSize: '1.05rem',
      lineHeight: 1.75,
      color: '#94a3b8',
    },
    statsWrap: {
      margin: '60px 0 60px',
      padding: '40px 3rem',
      borderTop: '1px solid rgba(56, 254, 220, 0.15)',
      borderBottom: '1px solid rgba(56, 254, 220, 0.15)',
      background: 'rgba(15, 23, 42, 0.4)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    stat: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    statValue: {
      fontSize: '2.75rem',
      fontWeight: 900,
      color: '#38fedc',
      letterSpacing: '-0.02em',
      textShadow: '0 0 20px rgba(56, 254, 220, 0.4)',
    },
    statLabel: {
      fontSize: '0.85rem',
      color: '#64748b',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    divider: {
      height: '1px',
      background: 'rgba(56, 254, 220, 0.15)',
      marginBottom: '80px',
    },
    pillarsWrap: {
      marginBottom: '80px',
    },
    pillarsLabel: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.2em',
      color: '#38fedc',
      marginBottom: '3rem',
    },
    pillars: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2.5rem',
    },
    pillar: {
      padding: '3rem',
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(56, 254, 220, 0.15)',
      borderRadius: '16px',
      backdropFilter: 'blur(12px)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    pillarIcon: {
      marginBottom: '2rem',
      display: 'inline-flex',
      padding: '1rem',
      background: 'rgba(56, 254, 220, 0.1)',
      border: '1px solid rgba(56, 254, 220, 0.25)',
      borderRadius: '50%',
      boxShadow: '0 0 20px rgba(56, 254, 220, 0.15)',
    },
    pillarTitle: {
      fontSize: '1.5rem',
      fontWeight: 800,
      marginBottom: '1rem',
      color: '#f8fafc',
    },
    pillarBody: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#94a3b8',
    },
    ctaRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      marginTop: '80px',
      flexWrap: 'wrap',
    },
    ctaLink: {
      fontSize: '1rem',
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#38fedc',
      transition: 'gap 0.2s ease',
    },
    ctaBtn: {
      padding: '1.25rem 3rem',
      background: '#38fedc',
      color: '#070a13',
      fontWeight: 800,
      borderRadius: '8px',
      transition: 'background 0.2s ease, transform 0.2s ease',
    }
  };

  return (
    <section style={styles.section} id="about" ref={sectionRef} aria-labelledby="about-heading">
      <div style={styles.overlay} />
      <div style={styles.innerWrap}>
        <div style={styles.intro}>
          <div style={styles.introInner}>
            <p style={styles.label} className="about-animate">✦ MISSION BRIEFING · HAXLR8 3.0 ✦</p>
            <h2 style={{ ...styles.heading, marginBottom: '5rem' }} className="about-animate" id="about-heading">
              Accelerate <span style={{color: '#38fedc', textShadow: '0 0 25px rgba(56,254,220,0.4)'}}>Innovation.</span> <span style={{color: '#ef4444', textShadow: '0 0 25px rgba(239,68,68,0.4)'}}>Among Us.</span>
            </h2>
            <div style={styles.introCols} className="about-cols-mobile">
              <motion.div 
                className="about-animate"
                whileHover={{ y: -5, borderColor: 'rgba(56,254,220,0.4)', boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 25px rgba(56,254,220,0.15)' }}
                transition={{ duration: 0.3 }}
                style={styles.card}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>👨‍🚀</span>
                  <p style={styles.label}>THE CREW</p>
                </div>
                <h3 style={{ ...styles.heading, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '1.5rem', color: '#f8fafc' }}>
                  Empowering Builders
                </h3>
                <p style={styles.bodyText}>
                  Maharaja Institute of Technology Mysore presents HAXLR8 3.0: Among Us Edition — a premier National Level 24-hour hackathon designed to unite talented undergraduate crewmates from across the country. Form your squad of 3–4 members, tackle real-world challenges, and compete without getting ejected!
                </p>
              </motion.div>
              <motion.div 
                className="about-animate" 
                whileHover={{ y: -5, borderColor: 'rgba(239,68,68,0.4)', boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 25px rgba(239,68,68,0.15)' }}
                transition={{ duration: 0.3 }}
                style={{ ...styles.card, transitionDelay: '0.1s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>🚀</span>
                  <p style={{ ...styles.label, color: '#ef4444' }}>THE MISSION</p>
                </div>
                <h3 style={{ ...styles.heading, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '1.5rem', color: '#f8fafc' }}>
                  3 Core Sectors
                </h3>
                <p style={styles.bodyText}>
                  Your crew must formulate an idea paper and build working solutions in <strong style={{ color: '#50ef39' }}>Hydroponics (Agriculture)</strong>, <strong style={{ color: '#facc15' }}>Navigation (Smart City)</strong>, or <strong style={{ color: '#38fedc' }}>MedBay (Healthcare)</strong>. Inter-college teams of 3–4 members are welcome to compete for the ₹33,333 bounty pool.
                </p>
              </motion.div>
            <div
              className="about-animate about-magnet"
              style={{
                transitionDelay: '0.2s',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 254, 220, 0.25)',
                borderRadius: '24px',
                padding: '28px',
                overflow: 'hidden',
                display: 'inline-flex',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 30px rgba(56,254,220,0.05)',
              }}
            >
              <MagnetLines
                rows={10}
                columns={5}
                containerSize="280px"
                lineColor="#38fedc"
                lineWidth="1.5px"
                lineHeight="41px"
                baseAngle={-10}
              />
            </div>
            </div>
          </div>
        </div>

        <div style={styles.statsWrap} className="about-animate">
          <div style={styles.stats}>
            {STATS.map((s) => (
              <div style={styles.stat} key={s.value}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            flexWrap: 'wrap', marginTop: 16,
          }}
        >
          {/* <MagneticButton href="#problems" variant="dark" size="lg">
            Explore Problems
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </MagneticButton>
          <MagneticButton href="#prizes" variant="outline" size="lg">
            View Prizes
          </MagneticButton> */}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .about-cols-mobile { grid-template-columns: 1fr 1fr !important; }
          .about-magnet { display: none !important; }
        }
        @media (max-width: 1024px) {
          .about-cols-mobile { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 768px) {
          .about-cta-mobile { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </section>
  );
}
