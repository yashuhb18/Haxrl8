import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, HeartPulse, Building2, ArrowRight, X, CheckCircle2 } from 'lucide-react';

const DOMAINS = [
  {
    id: 'agriculture',
    title: 'Agriculture',
    subtitle: 'Smart Farming & AgriTech',
    desc: 'Deploy IoT sensors, precision irrigation, and AI vision to revolutionize sustainable farming.',
    bg: '#f0fdf4', // Pastel Emerald
    border: '#86efac',
    textCol: '#15803d',
    icon: Sprout,
    details: [
      'AI Crop Disease Detection & Pest Early Warning',
      'Smart Precision Irrigation & Soil Nutrient Sensing',
      'Post-Harvest Cold-Chain Telemetry & Waste Reduction',
      'Autonomous Farming Drones & Yield Forecasting Models',
    ],
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    subtitle: 'MedTech & AI Diagnostics',
    desc: 'Develop life-saving healthcare tools, AI diagnostics, and smart assistive technologies.',
    bg: '#fff1f2', // Pastel Crimson / Rose
    border: '#fecdd3',
    textCol: '#e11d48',
    icon: HeartPulse,
    details: [
      'Low-Cost Point-of-Care Diagnostics with Edge AI',
      'Remote Patient Telemetry & Critical Vital Monitors',
      'Emergency Ambulatory Routing & Hospital Bed Coordination',
      'Assistive Tech & Rehabilitation for Differently Abled',
    ],
  },
  {
    id: 'smart-city',
    title: 'Smart City',
    subtitle: 'Urban Mobility & IoT Infrastructure',
    desc: 'Engineer connected, resilient, and energy-efficient municipal and transit systems.',
    bg: '#e0f2fe', // Pastel Tech Sky
    border: '#7dd3fc',
    textCol: '#0284c7',
    icon: Building2,
    details: [
      'Intelligent Adaptive Traffic Routing & Green Corridors',
      'Automated Municipal Waste Segregation & Smart Bin IoT',
      'Decentralized Renewable Microgrids & Energy Distribution',
      'Citizen Safety Telemetry & Emergency Disaster Networks',
    ],
  },
];

export default function PlayfulDomainsSection() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  return (
    <section
      id="domains"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fffaf3',
        padding: '70px 24px 90px',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        {/* Top Header + Doodle Annotation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          {/* Left: Titles */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.05,
                margin: '0 0 10px 0',
                letterSpacing: '-0.02em',
              }}
            >
              HACKATHON DOMAINS
            </h2>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              THREE DOMAINS. <span style={{ color: '#ea580c' }}>ENDLESS POSSIBILITIES.</span>
            </p>
          </div>

          {/* Right: Handwritten Doodle: EXPLORE BUILD SOLVE CREATE */}
          <div
            style={{
              fontFamily: "'Patrick Hand', cursive",
              color: '#0f172a',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: 1.15,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transform: 'rotate(-4deg)',
            }}
          >
            <div>
              EXPLORE<br />BUILD<br />SOLVE<br />CREATE
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>

        {/* 3 Colorful Rounded Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
          className="playful-domains-grid"
        >
          {DOMAINS.map((domain, idx) => {
            const IconComponent = domain.icon;
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => setSelectedDomain(domain)}
                style={{
                  background: domain.bg,
                  border: `2px solid ${domain.border}`,
                  borderRadius: '26px',
                  padding: '30px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.25s ease',
                  minHeight: '260px',
                  justifyContent: 'space-between',
                }}
              >
                {/* Domain Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: domain.textCol,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    marginBottom: '16px',
                  }}
                >
                  <IconComponent size={30} strokeWidth={2.4} />
                </div>

                {/* Title & Desc */}
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '8px',
                    }}
                  >
                    {domain.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#475569',
                      lineHeight: 1.5,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {domain.desc}
                  </p>
                </div>

                {/* Explore Pill Link */}
                <div
                  style={{
                    marginTop: '16px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: domain.textCol,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Explore Track</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Domain Details Modal */}
      <AnimatePresence>
        {selectedDomain && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDomain(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(8px)',
              }}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: 'relative',
                background: '#ffffff',
                border: `3px solid ${selectedDomain.border}`,
                borderRadius: '32px',
                padding: '36px',
                maxWidth: '560px',
                width: '100%',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                color: '#0f172a',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => setSelectedDomain(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: selectedDomain.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: selectedDomain.textCol,
                  }}
                >
                  {React.createElement(selectedDomain.icon, { size: 26, strokeWidth: 2.4 })}
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                    {selectedDomain.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                    {selectedDomain.desc}
                  </p>
                </div>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Sample Focus Areas:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {selectedDomain.details.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={18} color={selectedDomain.textCol} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="/register"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '100px',
                  background: '#ff3b69',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(255, 59, 105, 0.4)',
                }}
              >
                <span>REGISTER CREW FOR THIS DOMAIN →</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 960px) {
          .playful-domains-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 18px !important;
          }
        }

        @media (max-width: 680px) {
          .playful-domains-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px !important;
            margin: 0 auto !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
