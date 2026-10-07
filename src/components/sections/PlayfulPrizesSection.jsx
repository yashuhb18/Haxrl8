import React from 'react';
import { motion } from 'framer-motion';
import trophyImg from '../../assets/logo/golden-trophy-3d.png';
import { Award, Medal, Sparkles, Gift } from 'lucide-react';
import AmongUsCrewmate from '../amongus/AmongUsCrewmate';

const PRIZES = [
  {
    place: '1st Prize',
    rankEmoji: '🥇',
    title: 'Grand Winners',
    amount: '₹18,000',
    color: '#f59e0b',
    cardBg: 'linear-gradient(180deg, #fef3c7 0%, #ffffff 100%)',
    border: '#fde68a',
    badge: 'Champion Crew',
    crewColor: 'yellow',
    crewHat: 'crown',
    speech: 'Grand Champions! ₹18,000! 👑',
    isWinner: true,
  },
  {
    place: '2nd Prize',
    rankEmoji: '🥈',
    title: 'First Runners Up',
    amount: '₹10,000',
    color: '#0284c7',
    cardBg: 'linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%)',
    border: '#bae6fd',
    badge: 'Co-Pilot Squad',
    crewColor: 'cyan',
    crewHat: 'cap',
    speech: 'Co-Pilot Squad! ₹10,000! 🚀',
    isWinner: false,
  },
  {
    place: '3rd Prize',
    rankEmoji: '🥉',
    title: 'Second Runners Up',
    amount: '₹5,333',
    color: '#f43f5e',
    cardBg: 'linear-gradient(180deg, #ffe4e6 0%, #ffffff 100%)',
    border: '#fecdd3',
    badge: 'Specialist Crew',
    crewColor: 'pink',
    crewHat: 'none',
    speech: 'Specialist Crew! ₹5,333! 💖',
    isWinner: false,
  },
];

export default function PlayfulPrizesSection() {
  return (
    <section
      id="prizes"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fffaf3',
        padding: '90px 24px 110px',
        overflow: 'hidden',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header with Total Prize Pool Pill */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 24px',
              borderRadius: '100px',
              background: '#fef3c7',
              border: '2px solid #fde047',
              color: '#92400e',
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={18} color="#d97706" />
            <span>₹33,333 TOTAL PRIZE POOL</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 12px 0',
            }}
          >
            BOUNTY & REWARDS
          </h2>

          <p
            style={{
              fontSize: '16px',
              color: '#64748b',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Big ideas deserve big recognition. Compete across domains to take home the grand bounty at MIT Mysore.
          </p>
        </div>

        {/* Layout: Big 3D Trophy + 3 Prize Tier Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.3fr',
            gap: '40px',
            alignItems: 'center',
          }}
          className="playful-prizes-grid"
        >
          {/* Left: 3D Trophy Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle, #fef9c3 0%, rgba(254, 249, 195, 0.2) 60%, transparent 80%)',
              padding: '20px',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                src={trophyImg}
                alt="3D Golden Championship Trophy"
                style={{
                  maxWidth: '100%',
                  maxHeight: '320px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 25px 35px rgba(245, 158, 11, 0.35))',
                }}
              />
              <div style={{ position: 'absolute', bottom: '10px', right: '-10px' }}>
                <AmongUsCrewmate color="yellow" hat="crown" size={76} speechText="Claim the ₹33,333 bounty! 👑" />
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                textAlign: 'center',
                background: '#ffffff',
                border: '2px solid #fde047',
                padding: '8px 24px',
                borderRadius: '100px',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
                fontWeight: 900,
                color: '#854d0e',
                fontSize: '15px',
              }}
            >
              CHAMPIONSHIP TROPHY & CERTIFICATES
            </div>
          </motion.div>

          {/* Right: 3 Prize Cards (1st, 2nd, 3rd) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {PRIZES.map((prize, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 6 }}
                style={{
                  background: prize.cardBg,
                  border: `2px solid ${prize.border}`,
                  borderRadius: '24px',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.25s ease',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                {/* Left: Medal, Place & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      fontSize: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {prize.rankEmoji}
                  </div>

                  {/* Cute Crewmate Avatar */}
                  <div style={{ width: '48px', height: '56px', flexShrink: 0 }}>
                    <AmongUsCrewmate
                      color={prize.crewColor}
                      hat={prize.crewHat}
                      size={48}
                      speechText={prize.speech}
                      interactive={true}
                    />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 900,
                        color: prize.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        display: 'block',
                      }}
                    >
                      {prize.place}
                    </span>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 900,
                        color: '#0f172a',
                        margin: 0,
                      }}
                    >
                      {prize.title}
                    </h3>
                  </div>
                </div>

                {/* Right: Bounty Amount */}
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                      fontWeight: 900,
                      color: prize.color,
                      lineHeight: 1,
                      display: 'block',
                    }}
                  >
                    {prize.amount}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    CASH BOUNTY
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .playful-prizes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
