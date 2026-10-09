import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, Award, Sparkles, Gift, Shield, CheckCircle2 } from 'lucide-react';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import trophyImg from '../assets/logo/golden-trophy-3d.png';
import { useAuth } from '../lib/useAuth';

/* ─── Outcome Card ─── */
const OutcomeCard = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '32px 24px',
      border: '2px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        background: '#ffe4e6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.6rem',
      }}
    >
      {icon}
    </div>
    <div>
      <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {desc}
      </p>
    </div>
  </motion.div>
);

export default function PrizesPage() {
  const user = useAuth();

  const tiers = [
    {
      rank: '01',
      title: 'Grand Champion',
      amount: '₹15,111',
      desc: 'Top honor for the most innovative, scalable, and well-executed solution overall.',
      suitColor: 'yellow',
      hat: 'crown',
      roleTag: '1st Place',
      border: '#fde047',
      bg: '#fef9c3',
      textCol: '#854d0e',
      isCenter: true,
    },
    {
      rank: '02',
      title: 'First Runner Up',
      amount: '₹10,111',
      desc: 'Awarded for exceptional technical depth, prototype quality, and clear domain impact.',
      suitColor: 'cyan',
      hat: 'pilot',
      roleTag: '2nd Place',
      border: '#bae6fd',
      bg: '#e0f2fe',
      textCol: '#0369a1',
      isCenter: false,
    },
    {
      rank: '03',
      title: 'Second Runner Up',
      amount: '₹8,111',
      desc: 'Recognizing ingenuity, creative architecture, and effective implementation.',
      suitColor: 'lime',
      hat: 'sprout',
      roleTag: '3rd Place',
      border: '#fecdd3',
      bg: '#ffe4e6',
      textCol: '#9f1239',
      isCenter: false,
    },
  ];

  const outcomes = [
    { icon: '💰', title: '₹33,333 Cash Bounty', desc: 'Direct cash awards distributed across the championship podium winners.' },
    { icon: '🏆', title: 'Championship Trophies', desc: 'Official winner trophies, medals, and merit plaques presented at MIT Mysore.' },
    { icon: '📜', title: 'Verified Certificates', desc: 'National-level certificates of achievement and participation recognized across universities.' },
    { icon: '🧠', title: 'Faculty & Industry Mentorship', desc: 'Direct review, feedback, and project incubation mentorship from senior faculty.' },
    { icon: '🚀', title: 'Incubation & Networking', desc: 'Connect with fellow student innovators, collaborate across colleges, and build live solutions.' },
  ];

  return (
    <div
      style={{
        background: '#fffaf3',
        color: '#0f172a',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
        minHeight: '100vh',
        overflowX: 'hidden',
        paddingTop: '150px',
        paddingBottom: '80px',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 9999,
              background: '#fef3c7',
              border: '2px solid #fde047',
              color: '#854d0e',
              marginBottom: 16,
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={16} color="#d97706" />
            <span>₹33,333 BOUNTY POOL</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
            }}
          >
            Prizes & <span style={{ color: '#ff3b69' }}>Rewards</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#64748b',
              maxWidth: 580,
              margin: '0 auto',
              lineHeight: 1.65,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Compete with the brightest undergraduate minds in India and claim your share of the ₹33,333 prize pool at Maharaja Institute of Technology Mysore.
          </p>
        </div>

        {/* 3D Trophy Feature */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <motion.img
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            src={trophyImg}
            alt="3D Golden Trophy"
            style={{
              maxHeight: '300px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 30px rgba(245, 158, 11, 0.3))',
            }}
          />
        </div>

        {/* 3 Podium Tier Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '80px',
            alignItems: 'stretch',
          }}
          className="prizes-podium-grid"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.rank}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              style={{
                background: '#ffffff',
                borderRadius: '32px',
                padding: '36px 28px',
                border: `3px solid ${tier.border}`,
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: tier.textCol,
                    background: tier.bg,
                    padding: '4px 16px',
                    borderRadius: 100,
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: 16,
                  }}
                >
                  {tier.roleTag}
                </span>

                <div style={{ margin: '12px 0 20px' }}>
                  <AmongUsCrewmate
                    color={tier.suitColor}
                    hat={tier.hat}
                    size={110}
                    floating={true}
                    interactive={true}
                  />
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>
                  {tier.title}
                </h3>

                <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {tier.desc}
                </p>
              </div>

              <div style={{ marginTop: '28px', borderTop: '2px dashed #f1f5f9', paddingTop: '18px', width: '100%' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: tier.textCol, display: 'block', lineHeight: 1 }}>
                  {tier.amount}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  CASH BOUNTY
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* What You Walk Away With (Outcomes) */}
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, textAlign: 'center', marginBottom: '36px', color: '#0f172a' }}>
            WHAT EVERY PARTICIPANT GETS
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {outcomes.map((item, idx) => (
              <OutcomeCard key={idx} {...item} index={idx} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .prizes-podium-grid {
            grid-template-columns: 1fr !important;
            max-width: 440px !important;
            margin: 0 auto 60px !important;
          }
        }
      `}</style>
    </div>
  );
}
