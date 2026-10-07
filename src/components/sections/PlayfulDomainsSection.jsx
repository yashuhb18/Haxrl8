import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Shield, Cpu, Code2, Lightbulb, ArrowRight, X, CheckCircle2 } from 'lucide-react';

const DOMAINS = [
  {
    id: 'ai-ml',
    title: 'AI / ML',
    desc: 'Build intelligent solutions for real world problems.',
    bg: '#f3e8ff', // Pastel lavender
    border: '#d8b4fe',
    textCol: '#6b21a8',
    icon: Brain,
    details: [
      'Computer Vision & Real-time Object Detection',
      'Generative AI & Autonomous Workflow Agents',
      'Predictive Analytics for Precision Healthcare & AgTech',
      'Natural Language Processing & Vernacular Voice AI',
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    desc: 'Create a safer digital future.',
    bg: '#fef9c3', // Pastel yellow
    border: '#fde047',
    textCol: '#854d0e',
    icon: Shield,
    details: [
      'Zero-Trust Network Verification Architectures',
      'Automated Vulnerability Scanning & Patching Bots',
      'Decentralized Identity & Privacy Preserving Protocols',
      'Phishing & Threat Intelligence Feeds with ML',
    ],
  },
  {
    id: 'iot-embedded',
    title: 'IoT & Embedded',
    desc: 'Connect the physical and digital worlds.',
    bg: '#e0f2fe', // Pastel sky blue
    border: '#7dd3fc',
    textCol: '#0369a1',
    icon: Cpu,
    details: [
      'Smart Sensor Networks & Edge Computing',
      'Automated Precision Farming & Hydroponic Telemetry',
      'Smart City Traffic & Civic Utility Monitoring',
      'Low-power Wearable Medical Devices & Alert Systems',
    ],
  },
  {
    id: 'web-app',
    title: 'Web & App Dev',
    desc: 'Innovate on the web and beyond.',
    bg: '#ffe4e6', // Pastel coral / pink
    border: '#fda4af',
    textCol: '#9f1239',
    icon: Code2,
    details: [
      'High-performance Next-gen Web Applications',
      'Cross-platform Mobile Apps for Real-time Services',
      'Collaborative Real-time Dashboards & Workspaces',
      'Accessible Public Service & Disaster Relief Hubs',
    ],
  },
  {
    id: 'open-innovation',
    title: 'Open Innovation',
    desc: 'Any innovative idea under technology.',
    bg: '#dcfce7', // Pastel mint green
    border: '#86efac',
    textCol: '#166534',
    icon: Lightbulb,
    details: [
      'Breakthrough Ideas in Clean Energy & Sustainability',
      'Assistive Technologies for Differently Abled',
      'Fintech & Financial Inclusion Systems',
      'Any Cross-disciplinary Tech Innovation',
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
              MULTIPLE CHALLENGES. <span style={{ color: '#ea580c' }}>ONE BIGGER MISSION.</span>
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

        {/* 5 Colorful Rounded Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px',
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
                Sample Project Tracks:
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
        @media (max-width: 1024px) {
          .playful-domains-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 680px) {
          .playful-domains-grid {
            grid-template-columns: 1fr !important;
            max-width: 380px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}
