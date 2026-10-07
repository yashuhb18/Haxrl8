import React from 'react';
import { motion } from 'framer-motion';
import bountyCrateImg from '../../assets/bounty_crate.png';
import { Award } from 'lucide-react';

const PRIZE_TIERS = [
  {
    rank: 'WINNERS',
    amount: '₹15,000',
    badgeColor: '#eab308', // Gold
    badgeBorder: 'rgba(234, 179, 8, 0.4)',
    glow: 'rgba(234, 179, 8, 0.25)',
  },
  {
    rank: 'RUNNERS UP',
    amount: '₹10,000',
    badgeColor: '#0284c7', // Cyan / Blue
    badgeBorder: 'rgba(2, 132, 199, 0.4)',
    glow: 'rgba(2, 132, 199, 0.25)',
  },
  {
    rank: 'SECOND RUNNERS UP',
    amount: '₹5,000',
    badgeColor: '#ef4444', // Red
    badgeBorder: 'rgba(239, 68, 68, 0.4)',
    glow: 'rgba(239, 68, 68, 0.25)',
  },
];

export default function RewardMissionSection() {
  return (
    <section
      id="reward"
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
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: '0 0 12px 0',
              textTransform: 'uppercase',
            }}
          >
            THE <span style={{ color: '#ef4444' }}>REWARD</span>
          </h2>
          <p
            style={{
              fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)',
              fontWeight: 800,
              color: '#94a3b8',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            IDEAS THAT MAKE AN IMPACT DESERVE RECOGNITION.
          </p>
        </div>

        {/* Content Layout: Metallic Crate (Left) + 3 Tier Cards (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.3fr',
            gap: '36px',
            alignItems: 'stretch',
          }}
          className="reward-section-grid"
        >
          {/* Left: Metallic Bounty Crate */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(234, 179, 8, 0.35)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(234, 179, 8, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
            }}
          >
            <img
              src={bountyCrateImg}
              alt="Bounty Crate"
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.25))',
              }}
            />
            {/* Fallback overlay label */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <div
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  fontWeight: 900,
                  color: '#fbbf24',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                }}
              >
                ₹30,000
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#94a3b8',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}
              >
                TOTAL PRIZE POOL
              </div>
            </div>
          </motion.div>

          {/* Right: 3 Distinct Reward Tier Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}
            className="reward-tiers-grid"
          >
            {PRIZE_TIERS.map((tier, idx) => (
              <motion.div
                key={tier.rank}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                style={{
                  borderRadius: '20px',
                  background: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1.5px solid ${tier.badgeBorder}`,
                  boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 20px ${tier.glow}`,
                  padding: '32px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Badge Icon */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${tier.glow} 0%, rgba(15,23,42,0.9) 70%)`,
                    border: `1.5px solid ${tier.badgeColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 0 20px ${tier.glow}`,
                  }}
                >
                  <Award size={28} color={tier.badgeColor} />
                </div>

                {/* Amount */}
                <div
                  style={{
                    fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '8px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {tier.amount}
                </div>

                {/* Rank Title */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: tier.badgeColor,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {tier.rank}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .reward-section-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .reward-tiers-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
