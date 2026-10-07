import React from 'react';
import { motion } from 'framer-motion';
import transmissionCommsImg from '../../assets/transmission_comms.png';
import { Calendar, Clock, Users, GraduationCap, MapPin, Globe } from 'lucide-react';

const TRANSMISSION_SPECS = [
  {
    icon: Calendar,
    title: '06 - 07',
    subtitle: 'November 2026',
  },
  {
    icon: Clock,
    title: '24 Hours',
    subtitle: 'Hackathon',
  },
  {
    icon: Users,
    title: '3 - 4',
    subtitle: 'Members per team',
  },
  {
    icon: GraduationCap,
    title: 'Undergraduate',
    subtitle: 'Students (Any College)',
  },
  {
    icon: MapPin,
    title: 'MIT Mysore',
    subtitle: 'Venue',
  },
  {
    icon: Globe,
    title: 'Inter-College',
    subtitle: 'Teams Allowed',
  },
];

export default function TransmissionMissionSection() {
  return (
    <section
      id="transmission"
      style={{
        position: 'relative',
        width: '100%',
        padding: '100px 24px 120px',
        backgroundColor: '#070a13',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '50px' }}>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
            }}
          >
            TRANSMISSION <span style={{ color: '#ef4444' }}>DETAILS</span>
          </h2>
        </div>

        {/* Content: 6 Specs Grid (Left) + Comms Station Visual (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '48px',
            alignItems: 'center',
          }}
          className="transmission-section-grid"
        >
          {/* Left: 6 Icons Specs Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
            }}
            className="transmission-specs-grid"
          >
            {TRANSMISSION_SPECS.map((spec, idx) => {
              const IconComponent = spec.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'rgba(56, 254, 220, 0.1)',
                      border: '1px solid rgba(56, 254, 220, 0.25)',
                      color: '#38fedc',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', marginBottom: '4px' }}>
                      {spec.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
                      {spec.subtitle}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Workstation Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 254, 220, 0.1)',
              background: 'rgba(15, 23, 42, 0.8)',
            }}
          >
            <img
              src={transmissionCommsImg}
              alt="Transmission Comms Station"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .transmission-section-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .transmission-specs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
