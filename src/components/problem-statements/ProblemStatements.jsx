import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { theme } from '../../theme';
import DomainWheel from '../ui/DomainWheel';

const DOMAINS = [
  {
    id: 1,
    num: '01',
    title: 'Hydroponics (Agriculture)',
    subtitle: 'Smart Farming & Agri Bio-Systems',
    color: '#16A34A',
    accentColor: '#22C55E',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </svg>
    ),
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop',
    description: 'Empower farmers and transform agricultural ecosystems through precision farming, automated irrigation, AI crop disease diagnostics, soil analysis, and transparent farm-to-market supply networks.',
    challenges: [
      'Real-Time Crop Disease & Pest Diagnosis: On-device mobile AI vision that detects leaf and crop ailments with actionable treatment advice, functional offline in remote fields.',
      'Smart Automated Irrigation & Soil Sensor Network: IoT telemetry measuring soil NPK, moisture, and temperature to automate drip irrigation and optimize water utilization by 40%+.',
      'Transparent Agri-Supply Chain & Direct Market: Digital marketplace linking smallholder farmers directly to buyers, predicting fair price trends and cutting middlemen margins.',
      'Agritech Drones & Predictive Yield Analytics: Aerial drone imagery models that scan crop canopies, spot weed infestations, and calculate localized fertilizer requirements.',
    ],
  },
  {
    id: 2,
    num: '02',
    title: 'Navigation (Smart City)',
    subtitle: 'Urban Tech & Starship Grid Infrastructure',
    color: '#0284C7',
    accentColor: '#06B6D4',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9v.01" />
        <path d="M9 12v.01" />
        <path d="M9 15v.01" />
        <path d="M9 18v.01" />
      </svg>
    ),
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
    description: 'Engineer sustainable, resilient urban infrastructure utilizing IoT sensor webs, dynamic traffic management, automated civic sanitation, energy grid optimization, and AI-enabled public safety networks.',
    challenges: [
      'Dynamic Urban Traffic & Emergency Preemption: AI traffic signal coordination optimizing congestion bottlenecks and clearing automated green corridors for ambulances and fire services.',
      'Smart Waste Management & Segregation: Computer-vision smart waste bins classifying recyclable vs organic waste with real-time fill tracking and optimized collection routes.',
      'Intelligent Public Energy & Micro-Grid Balancing: Solar-assisted dynamic street lighting, municipal grid load-shedding intelligence, and commercial building energy conservation.',
      'Civic Safety & Disaster Response Network: Real-time sensor networks detecting localized street flooding, structural health of bridges, and citizen SOS dispatch coordination.',
    ],
  },
  {
    id: 3,
    num: '03',
    title: 'MedBay (Healthcare)',
    subtitle: 'MedTech & AI Clinical Diagnostics',
    color: '#E11D48',
    accentColor: '#F43F5E',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.28" />
      </svg>
    ),
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
    description: 'Democratize clinical access and accelerate healthcare delivery through early disease detection, wearable telemetry, decentralized emergency dispatch, and AI-assisted care companions.',
    challenges: [
      'Affordable Point-of-Care Diagnostic AI: Rapid screening tool detecting cardiovascular, pulmonary, or dermatological anomalies from low-cost handheld sensors and smartphone cameras.',
      'Remote Patient & Elderly Tele-Monitoring: Wearable telemetry tracking cardiac rhythms and vital dips, with predictive fall detection and automatic caregiver emergency alerts.',
      'Decentralized Emergency Dispatch & Resource Tracking: Real-time network mapping nearby ambulances, available ICU beds, oxygen, and blood donors during trauma emergencies.',
      'AI Mental Health & Neuro-Support Companion: Privacy-first digital companion analyzing voice biomarkers and behavioral patterns to provide guided cognitive intervention.',
    ],
  },
  {
    id: 4,
    num: 'PDF',
    title: 'Example Problems',
    subtitle: 'Official Problem Statement Catalog',
    color: '#111111',
    accentColor: '#4b5563',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 18 15 15" />
      </svg>
    ),
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    description: 'Download the comprehensive catalog of problem statements and guidelines. You are fully welcome to formulate and present your own innovative problem statement within the 3 domains.',
    challenges: [
      'Open Innovation Track: Teams are invited to submit their own original problem statement as long as it maps to Agriculture, Smart City, or Healthcare.',
      'Official Reference PDF: Download the complete competition brochure with evaluation rubrics and submission instructions.',
    ],
  },
];

export default function ProblemStatements() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // For horizontal sliding of the domain track on desktop
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-38%']);

  const [activeDomain, setActiveDomain] = useState(DOMAINS[0]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const isHoveringRef = useRef(false);
  const mobileScrollRef = useRef(null);

  // One-card-at-a-time mobile swipe
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const goToIndex = (idx) => {
    const next = Math.max(0, Math.min(idx, DOMAINS.length - 1));
    setMobileIndex(next);
    setActiveDomain(DOMAINS[next]);
    const el = mobileScrollRef.current;
    if (!el) return;
    const slotWidth = el.clientWidth;
    el.scrollTo({ left: next * slotWidth, behavior: 'smooth' });
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isSwiping.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      isSwiping.current = Math.abs(dx) > Math.abs(dy);
    }
    if (isSwiping.current) e.preventDefault();
  };

  const onTouchEnd = (e) => {
    if (!isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const THRESHOLD = 40;
    if (dx < -THRESHOLD) goToIndex(mobileIndex + 1);
    else if (dx > THRESHOLD) goToIndex(mobileIndex - 1);
    else goToIndex(mobileIndex);
    isSwiping.current = false;
  };

  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el || !isMobile) return;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [isMobile, mobileIndex]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (isHoveringRef.current || isMobile) return;
      const index = Math.max(0, Math.min(Math.floor(latest * DOMAINS.length * 1.05), DOMAINS.length - 1));
      setActiveDomain(DOMAINS[index]);
    });
    return () => unsubscribe();
  }, [scrollYProgress, isMobile]);

  const handleHoverStart = (domain) => {
    if (isMobile) return;
    isHoveringRef.current = true;
    setActiveDomain(domain);
  };

  const handleHoverEnd = () => {
    if (isMobile) return;
    isHoveringRef.current = false;
  };

  const handleMobilePrev = () => goToIndex(mobileIndex - 1);
  const handleMobileNext = () => goToIndex(mobileIndex + 1);

  return (
    <section
      id="problems"
      ref={targetRef}
      style={{
        height: isMobile ? 'auto' : '260vh',
        background: '#070a13',
        position: 'relative',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{
        position: isMobile ? 'relative' : 'sticky',
        top: 0,
        height: isMobile ? 'auto' : '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#070a13',
      }}>
        {/* Title area */}
        <div style={{
          padding: isMobile ? '32px 6vw 16px' : 'clamp(10px, 2vh, 20px) 6vw clamp(5px, 1vh, 10px)',
          flexShrink: 0,
          background: '#070a13',
          zIndex: 10,
          borderBottom: '1px solid rgba(56, 254, 220, 0.15)',
        }}>
          <p style={{
            fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.22em',
            color: '#38fedc', marginBottom: '0.5rem', textTransform: 'uppercase',
          }}>
            ✦ SKELD INNOVATION TRACKS ✦
          </p>
          <p style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', fontWeight: 600, color: '#94a3b8', 
            marginBottom: '0.6rem', lineHeight: 1.4,
          }}>
            Focused across <strong style={{ color: '#50ef39' }}>Agriculture</strong> • <strong style={{ color: '#facc15' }}>Smart City</strong> • <strong style={{ color: '#38fedc' }}>Healthcare</strong> — Open to your breakthrough solutions
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{
              fontFamily: theme.fonts.heading,
              fontSize: 'clamp(1.8rem, 3.8vw, 3.4rem)',
              fontWeight: 800, color: '#f8fafc',
              letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
              display: 'flex', alignItems: 'center', gap: '14px'
            }}>
              The <DomainWheel size={52} showCenterIcon={true} /> <span style={{ color: activeDomain.color, transition: 'color 0.4s ease', textShadow: `0 0 20px ${activeDomain.color}66` }}>Domains</span>
            </h2>
            {/* Mobile nav buttons */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleMobilePrev}
                  disabled={mobileIndex === 0}
                  aria-label="Previous Domain"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `2px solid ${mobileIndex === 0 ? '#e0e0e0' : activeDomain.color}`,
                    background: mobileIndex === 0 ? '#f5f5f5' : activeDomain.color,
                    color: mobileIndex === 0 ? '#bbb' : '#fff',
                    fontSize: '18px', cursor: mobileIndex === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s ease',
                  }}
                >‹</button>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#666', minWidth: '48px', textAlign: 'center' }}>
                  {mobileIndex + 1} / {DOMAINS.length}
                </span>
                <button
                  onClick={handleMobileNext}
                  disabled={mobileIndex === DOMAINS.length - 1}
                  aria-label="Next Domain"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `2px solid ${mobileIndex === DOMAINS.length - 1 ? '#e0e0e0' : activeDomain.color}`,
                    background: mobileIndex === DOMAINS.length - 1 ? '#f5f5f5' : activeDomain.color,
                    color: mobileIndex === DOMAINS.length - 1 ? '#bbb' : '#fff',
                    fontSize: '18px', cursor: mobileIndex === DOMAINS.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s ease',
                  }}
                >›</button>
              </div>
            )}
          </div>
          {isMobile ? (
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
              ← Swipe to explore the 3 hackathon domains &amp; problem statements
            </p>
          ) : (
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#999' }}>
              ↕ Scroll down to explore domains — click or hover any track to inspect challenges
            </p>
          )}
        </div>

        {/* Domain Filmstrip Track */}
        {isMobile ? (
          // Mobile: one-card-at-a-time gallery swipe
          <div
            ref={mobileScrollRef}
            style={{
              display: 'flex',
              overflowX: 'hidden',
              padding: '24px 0',
              WebkitOverflowScrolling: 'touch',
              userSelect: 'none',
            }}
            className="mobile-filmstrip"
          >
            {DOMAINS.map((domain) => {
              const isActive = activeDomain.id === domain.id;
              return (
                <div
                  key={domain.id}
                  style={{
                    minWidth: '100%',
                    padding: '0 6vw',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '340px',
                      height: '320px',
                      borderRadius: '24px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isActive
                        ? `0 20px 40px ${domain.color}50`
                        : '0 8px 20px rgba(0,0,0,0.10)',
                      border: `2px solid ${isActive ? domain.color : 'rgba(0,0,0,0.06)'}`,
                      transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                      transform: isActive ? 'scale(1.02)' : 'scale(0.96)',
                    }}
                  >
                    <img
                      src={domain.imageUrl}
                      alt={domain.title}
                      draggable={false}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(0deg, ${domain.color}EE 0%, rgba(0,0,0,0.45) 80%)`,
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px',
                      zIndex: 2, color: '#fff',
                    }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.22)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px', borderRadius: '6px',
                        fontSize: '11px', fontWeight: 800,
                        display: 'inline-block', marginBottom: '8px',
                        letterSpacing: '0.05em', textTransform: 'uppercase'
                      }}>
                        {domain.id === 4 ? 'RESOURCES' : `DOMAIN ${domain.num}`}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800, lineHeight: 1.2 }}>{domain.title}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9, fontWeight: 500 }}>{domain.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop: horizontal scroll filmstrip
          <div style={{
            flex: '1 1 auto',
            minHeight: '230px',
            maxHeight: '390px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
            overflow: 'visible',
            flexShrink: 1,
            marginBottom: '0px',
          }}>
            <motion.div
              style={{ x, display: 'flex', gap: '32px', padding: '0 6vw', alignItems: 'center' }}
            >
              {DOMAINS.map(domain => {
                const isActive = activeDomain.id === domain.id;
                return (
                  <motion.div
                    key={domain.id}
                    onClick={() => setActiveDomain(domain)}
                    onMouseEnter={() => handleHoverStart(domain)}
                    onMouseLeave={handleHoverEnd}
                    animate={{
                      scale: isActive ? 1.02 : 0.96,
                      opacity: isActive ? 1 : 0.72,
                      y: isActive ? -6 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 'clamp(240px, 28vh, 310px)', height: 'clamp(240px, 34vh, 340px)',
                      borderRadius: '22px', position: 'relative',
                      overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                      boxShadow: isActive ? `0 24px 44px ${domain.color}45` : '0 8px 20px rgba(0,0,0,0.08)',
                      border: `2px solid ${isActive ? domain.color : 'rgba(0,0,0,0.08)'}`,
                      zIndex: isActive ? 10 : 5,
                    }}
                  >
                    <img src={domain.imageUrl} alt={domain.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(0deg, ${domain.color}EE 0%, rgba(0,0,0,0.40) 65%)`, zIndex: 1,
                    }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '22px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)',
                        color: '#fff', fontSize: '11px', fontWeight: 800,
                        padding: '4px 10px', borderRadius: '6px', alignSelf: 'flex-start',
                        letterSpacing: '0.06em', textTransform: 'uppercase'
                      }}>
                        {domain.id === 4 ? 'RESOURCES' : `DOMAIN ${domain.num}`}
                      </div>
                      <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{domain.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500, margin: 0 }}>{domain.subtitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Dedicated Bottom Detail Panel */}
        <div style={{
          minHeight: '130px',
          background: 'rgba(10, 16, 30, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1.5px solid rgba(56, 254, 220, 0.25)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          position: 'relative',
          zIndex: 5,
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDomain.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: 'clamp(18px, 3vh, 32px) 6vw',
                height: '100%',
                display: 'flex',
                gap: 'clamp(20px, 4vw, 40px)',
                alignItems: 'center',
              }}
              className="bottom-panel-inner"
            >

              {activeDomain.id === 4 ? (
                /* ── Example Problems / Download Panel ── */
                <div style={{ display: 'flex', alignItems: 'center', gap: 40, width: '100%', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: '0 0 auto' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 18,
                      background: 'rgba(56, 254, 220, 0.1)',
                      border: '1.5px solid rgba(56, 254, 220, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: '#38fedc'
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38fedc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="15" x2="12" y2="12"/>
                        <polyline points="9 15 12 18 15 15"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'clamp(18px, 3vh, 24px)', fontWeight: 900, color: '#f8fafc', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                        Example Problems &amp; Guidelines
                      </h3>
                      <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, margin: 0 }}>
                        Curated Challenges &amp; Reference Brochure
                      </p>
                    </div>
                  </div>

                  <div style={{ width: 1, height: 56, background: 'rgba(255, 255, 255, 0.15)', flexShrink: 0 }} className="panel-divider" />

                  <div style={{ flex: 1, minWidth: 220 }}>
                    <p style={{ fontSize: 'clamp(13px, 2vh, 15px)', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                      Curated challenge statements across Agriculture, Smart City, and Healthcare. You are also encouraged to propose your own innovative solution within these 3 core tracks.
                    </p>
                  </div>

                  <a
                    href="/problem-statement-2026.pdf"
                    download="HAXLR8-3.0-Problem-Statements.pdf"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '13px 26px', borderRadius: 100,
                      background: 'linear-gradient(135deg, #38fedc 0%, #2dd4bf 100%)', color: '#070a13',
                      fontSize: '0.85rem', fontWeight: 800,
                      letterSpacing: '0.04em', textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(56,254,220,0.3)',
                      transition: 'background 0.2s, transform 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </a>
                </div>
              ) : (
                /* ── Domain detail panel ── */
                <>
                  <div style={{ flex: '0 0 34%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <div style={{
                        width: '56px', height: '56px',
                        borderRadius: '16px', background: `${activeDomain.color}25`,
                        border: `1.5px solid ${activeDomain.color}55`,
                        color: activeDomain.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {activeDomain.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'clamp(18px, 3vh, 24px)', fontWeight: 800, color: '#f8fafc', margin: 0 }}>{activeDomain.title}</h3>
                        <p style={{ fontSize: 'clamp(12px, 2vh, 14px)', color: activeDomain.color, fontWeight: 700, margin: 0 }}>Domain {activeDomain.num} · {activeDomain.subtitle}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 'clamp(12.5px, 2vh, 14.5px)', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                      {activeDomain.description}
                    </p>
                  </div>

                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 10px', height: '80%' }} className="panel-divider" />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{
                      fontSize: 'clamp(10px, 1.8vh, 11px)', fontWeight: 800, color: '#38fedc',
                      letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', margin: 0,
                    }}>
                      ✦ CURATED CHALLENGE IDEAS
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeDomain.challenges.slice(0, 2).map((c, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <span style={{ color: activeDomain.color, fontWeight: 800, fontSize: '14px', lineHeight: 1.4 }}>•</span>
                          <p style={{ fontSize: 'clamp(12px, 1.9vh, 13.5px)', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{c}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', padding: '6px 12px', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.25)', borderRadius: '8px', width: 'fit-content' }}>
                      <span style={{ fontSize: '12px' }}>💡</span>
                      <p style={{ fontSize: '11.5px', color: '#fde047', margin: 0, fontWeight: 600 }}>
                        <strong>Open Innovation:</strong> You are fully free to choose your own problem statement as long as it aligns with this domain.
                      </p>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile-only standalone download card */}
      {isMobile && (
        <div style={{ padding: '32px 6vw 8px' }}>
          <a
            href="/problem-statement-2026.pdf"
            download="HAXLR8-3.0-Problem-Statements.pdf"
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px 20px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1.5px solid rgba(56, 254, 220, 0.3)',
              borderRadius: 20,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.05,
              backgroundImage: 'linear-gradient(rgba(56,254,220,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,254,220,1) 1px, transparent 1px)',
              backgroundSize: '20px 20px', pointerEvents: 'none',
            }} />
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: 'rgba(56,254,220,0.1)',
              border: '1.5px solid rgba(56,254,220,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38fedc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 18 15 15"/>
              </svg>
            </div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                Download Problem Statements
              </p>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                HAXLR8 3.0 Curated Tracks PDF
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
              background: '#38fedc', color: '#070a13', borderRadius: 100,
              padding: '7px 14px', fontSize: '12px', fontWeight: 800,
              position: 'relative', zIndex: 1,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              PDF
            </div>
          </a>
        </div>
      )}

      <style>{`
        .mobile-filmstrip::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) {
          .bottom-panel-inner {
            flex-direction: column !important;
            gap: 16px !important;
            padding: 24px 6vw !important;
            overflow-y: auto !important;
          }
          .panel-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
