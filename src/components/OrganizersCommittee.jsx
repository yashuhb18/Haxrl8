import React from 'react';
import { motion } from 'framer-motion';
import balakrishnaImg from '../assets/humans/balakrishna.png';
import sandeshImg from '../assets/humans/sandesh.jpg';
import yashwanthImg from '../assets/humans/yashwanth.png';
import handImg from '../assets/my image/hand.png';

/* ─── Data ─── */
export const organizers = [
  {
    name: 'Balakrishna K',
    role: 'Faculty Coordinator',
    org: 'Associate Prof & HoD, Dept of ECE · MIT Mysore',
    photo: balakrishnaImg,
    phone: '+91 98864 78574',
    linkedin: '#'
  },
  {
    name: 'Sandesh NG',
    role: 'Faculty Coordinator',
    org: 'Assistant Professor, Dept of ECE · MIT Mysore',
    photo: sandeshImg,
    phone: '+91 94813 36585',
    linkedin: '#'
  },
  {
    name: 'Yashwanth H B',
    role: 'Student Coordinator',
    org: '8050614849 · @ MIT Mysore',
    photo: yashwanthImg,
    phone: '+91 80506 14849',
    linkedin: '#'
  },
  {
    name: 'Chethan Kumar B',
    role: 'Student Coordinator',
    org: '99455 07099 · @ MIT Mysore',
    photo: null,
    phone: '+91 99455 07099',
    linkedin: '#'
  },
];

/* ─── Helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export const SectionLabel = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 32,
    }}
  >
    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />

    <p
      style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#9ca3af',
        margin: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </p>

    <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
  </div>
);

export default function OrganizersCommittee() {
  return (
    <>
      {/* ── ORGANIZERS COMMITTEE ── */}
      <section style={{ padding: '0 clamp(20px, 8vw, 120px) 100px' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ marginBottom: 40 }}>
            <SectionLabel>Organizers Committee</SectionLabel>
          </motion.div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 40,
            }}
          >
            {organizers.map((m, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -6 }}
                style={{
                  flex: '1 1 300px',
                  maxWidth: 350,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  cursor: 'default',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Photo Container */}
                {m.photo ? (
                  <div
                    style={{
                      width: '100%',
                      height: 320,
                      background: '#f8fafc',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={m.photo}
                      alt={m.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 15%',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 220,
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #ffe4e6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      fontWeight: 900,
                      color: '#0284c7',
                    }}
                  >
                    {m.name.charAt(0)}
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    padding: '24px 20px',
                    textAlign: 'left',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: '#111',
                      margin: '0 0 6px',
                      lineHeight: 1.3,
                    }}
                  >
                    {m.name}
                  </p>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0070f3',
                      margin: '0 0 6px',
                    }}
                  >
                    {m.role}
                  </p>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {m.org}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER SECTION ── */}
      
      {/* ── LEAD PLATFORM ARCHITECT SECTION ── */}
      
      <motion.div {...fadeUp(0)} style={{ marginBottom: 40 }}>
            <SectionLabel>Lead Platform Architect</SectionLabel>
      </motion.div> 
          
      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            {...fadeUp(0)}
            className="group relative w-full max-w-2xl mx-auto bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center transition-all duration-500 hover:shadow-[0_16px_48px_-10px_rgba(0,0,0,0.12)]"
            style={{ overflow: 'visible' }}
          >
            {/* Background Decorative Dots top-right */}
            <div className="absolute top-6 right-6 w-16 h-16 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#111 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />

            {/* Developer Text Top Left */}
            <div className="absolute top-8 left-8 lg:left-10 flex items-center gap-4 z-20">
              {/* Icon */}
              <div className="w-11 h-11 bg-[#0284c7] rounded-[0.8rem] flex items-center justify-center text-white font-mono font-bold text-[1.1rem] shadow-sm">
                &lt;/&gt;
              </div>
              {/* Text */}
              <div className="flex flex-col mt-1">
                <span className="text-[#0f172a] font-extrabold text-[0.85rem] tracking-[0.2em] uppercase">
                  Lead Platform Architect
                </span>
                <div className="w-10 h-[3px] bg-[#0284c7] mt-1.5 rounded-full"></div>
              </div>
            </div>

            {/* Content Wrapper */}
            <div className="w-full flex flex-col items-center justify-center relative" style={{ minHeight: 320, padding: '70px 20px 20px' }}>

              {/* Image & Hand Wrapper */}
              <div className="relative w-full max-w-[360px] flex justify-center items-center mb-4">

                {/* Sparkles */}
                <div className="absolute top-6 -right-6 pointer-events-none z-10">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="#0284c7">
                    <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
                  </svg>
                </div>
                <div className="absolute top-[45%] -left-8 pointer-events-none z-10">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#38bdf8">
                    <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
                  </svg>
                </div>

                {/* Photo Frame */}
                <div
                  className="w-48 h-48 rounded-[28px] overflow-hidden border-4 border-[#38bdf8] shadow-2xl z-10 transition-all duration-500 group-hover:scale-[1.03]"
                  style={{ background: '#f0f9ff' }}
                >
                  <img src={yashwanthImg} alt="Yashwanth H B - Lead Platform Architect" className="w-full h-full object-cover" style={{ objectPosition: 'center 15%' }} />
                </div>
              </div>

              {/* Name & Role Text */}
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                  Yashwanth H B
                </h3>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0284c7', margin: '0 0 6px' }}>
                  Systems Engineer & Lead Platform Architect
                </p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, maxWidth: 500, lineHeight: 1.5 }}>
                  Architected and engineered the end-to-end HAXLR8 3.0 digital platform, live registration sync, and evaluation infrastructure.
                </p>
              </div>

              {/* Icon Capsule */}
              <div
                className="relative z-30 flex items-center gap-2 bg-white rounded-[1.2rem] border border-gray-100"
                style={{ padding: '8px 16px', boxShadow: '0 10px 30px -6px rgba(0,0,0,0.1)' }}
              >
                <a href="tel:8050614849" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#0284c7] hover:bg-sky-50 rounded-lg transition-colors" style={{ textDecoration: 'none' }}>
                  📞 <span>+91 80506 14849</span>
                </a>
                <div className="w-px h-5 bg-gray-200" />
                <span className="text-xs font-semibold text-gray-500 px-2">
                  Dept. of ECE · MIT Mysore
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes blob {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes wave {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(20deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(20deg); }
          80% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        .group:hover .dev-wave-hand img {
          animation: wave 1.6s ease-in-out infinite;
          transform-origin: bottom center;
        }

        @media (max-width: 640px) {
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </>
  );
}
