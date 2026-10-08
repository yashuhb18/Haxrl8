import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import teamsData from '../data/shortlistedTeams.json';
import sdgLogoCircle from '../assets/logo/sdg-logo-circle.png';
import goldenTrophyImg from '../assets/logo/golden-trophy-3d.png';

/* ═══════════════════════════════════════════════════════════════════════════════
   SDG COLOR PALETTE & LABELS
   ═══════════════════════════════════════════════════════════════════════════════ */
const SDG_COLORS = {
  1: '#E5243B', 2: '#DDA63A', 3: '#2E7D32', 4: '#C62828', 5: '#FF3A21', 6: '#26BDE2',
  7: '#F57C00', 8: '#A21942', 9: '#FD6925', 10: '#D81B60', 11: '#FD9D24', 12: '#BF8B2E',
  13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B', 16: '#00689D', 17: '#19486A',
};

// Official UN SDG Image Icons
const SDG_IMAGES = {
  3: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sustainable_Development_Goal_03GoodHealth.svg/960px-Sustainable_Development_Goal_03GoodHealth.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093219",
  4: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sustainable_Development_Goal_04QualityEducation.svg/960px-Sustainable_Development_Goal_04QualityEducation.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093221",
  5: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sustainable_Development_Goal_05GenderEquality.svg/960px-Sustainable_Development_Goal_05GenderEquality.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093223",
  7: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Sustainable_Development_Goal_07CleanEnergy.svg/960px-Sustainable_Development_Goal_07CleanEnergy.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093224",
  10: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Sustainable_Development_Goal_10ReducedInequalities.svg/960px-Sustainable_Development_Goal_10ReducedInequalities.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093226",
  13: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sustainable_Development_Goal_13Climate.svg/960px-Sustainable_Development_Goal_13Climate.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240924093231",
};

/* ═══════════════════════════════════════════════════════════════════════════════
   PREMIUM 3D GOLDEN TROPHY CUP COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
function GoldenTrophyCard({ width = 175, rotate = 0, style }) {
  return (
    <div
      style={{
        width,
        height: width,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Ambient Gold Glow Aura */}
      <div
        style={{
          position: 'absolute',
          width: '78%',
          height: '78%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.40) 0%, rgba(234, 179, 8, 0.15) 55%, transparent 75%)',
          filter: 'blur(16px)',
          zIndex: 1,
        }}
      />
      {/* 3D Rendered Golden Trophy Image */}
      <img
        src={goldenTrophyImg}
        alt="Championship Golden Trophy Cup"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `rotate(${rotate}deg)`,
          filter: 'drop-shadow(0 14px 28px rgba(202, 138, 4, 0.28)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))',
          mixBlendMode: 'multiply',
          position: 'relative',
          zIndex: 2,
          display: 'block',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SDG LOGO WHEEL, LEAF, AND SDG CARD COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */
const SDGWheel = ({ size = 60, blur = 0, style }) => (
  <img
    src={sdgLogoCircle}
    alt="SDG Logo Wheel"
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      filter: blur ? `blur(${blur}px)` : 'drop-shadow(0 6px 18px rgba(0,0,0,0.10))',
      objectFit: 'contain',
      display: 'inline-block',
      ...style
    }}
  />
);

const Leaf = ({ size = 32, blur = 0, color = "#22c55e", rotate = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    style={{
      filter: blur ? `blur(${blur}px)` : 'drop-shadow(0 4px 10px rgba(34, 197, 94, 0.28))',
      transform: `rotate(${rotate}deg)`,
      display: 'inline-block'
    }}
  >
    <path
      d="M6 26C6 26 10 16 20 8C28 2 30 2 30 2C30 2 30 6 22 16C14 26 6 26 6 26Z"
      fill={color}
    />
    <path
      d="M6 26C6 26 14 17 22 9C26 5 29 3 30 2"
      stroke="#15803D"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M14 18C18 18 21 15 23 12"
      stroke="#BBF7D0"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const SDGCard = ({ imgSrc, alt, style }) => (
  <div className="hero-sdg-card" style={{
    width: 155,
    height: 155,
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 18px 40px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.06)',
    background: '#FFFFFF',
    border: '1.5px solid rgba(255,255,255,0.9)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ...style
  }}>
    <img
      src={imgSrc}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  </div>
);

const ParallaxElement = ({ children, yOffset = 100, initialRotate = 0, initialScale = 1, rotationSpeed = 0, style, className }) => {
  const { scrollY } = useScroll();

  const smoothScrollY = useSpring(scrollY, {
    stiffness: 50,
    damping: 15,
    mass: 0.2
  });

  const y = useTransform(smoothScrollY, [0, 1000], [0, yOffset]);
  const rotate = useTransform(smoothScrollY, [0, 1000], [initialRotate, initialRotate + rotationSpeed]);

  return (
    <motion.div className={className} style={{ ...style, y, rotate, scale: initialScale }}>
      {children}
    </motion.div>
  );
};

/* ── Golden Laurel Branch Sprays ──────────────────────────────────────────── */
function GoldenLaurelSpray({ flip = false, width = 36, height = 48, className }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 42 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transform: flip ? 'scaleX(-1)' : 'none',
        flexShrink: 0,
        display: 'inline-block',
      }}
    >
      <defs>
        <linearGradient id="goldLeafGrad" x1="0" y1="0" x2="40" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="80%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
      </defs>
      <path
        d="M34 52C28 42 22 26 26 6"
        stroke="#CA8A04"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 6C23 1 20 0 17 2C15 5 18 10 24 8L26 6Z"
        fill="url(#goldLeafGrad)"
        stroke="#A16207"
        strokeWidth="0.8"
      />
      <path
        d="M24 16C17 14 11 15 9 19C8 23 13 25 22 20L24 16Z"
        fill="url(#goldLeafGrad)"
        stroke="#A16207"
        strokeWidth="0.8"
      />
      <path
        d="M27 22C33 19 39 21 40 25C41 29 36 32 29 27L27 22Z"
        fill="url(#goldLeafGrad)"
        stroke="#A16207"
        strokeWidth="0.8"
      />
      <path
        d="M24 32C16 31 10 34 9 39C8 44 14 45 23 37L24 32Z"
        fill="url(#goldLeafGrad)"
        stroke="#A16207"
        strokeWidth="0.8"
      />
      <path
        d="M29 38C36 36 41 40 41 44C40 48 34 50 29 43L29 38Z"
        fill="url(#goldLeafGrad)"
        stroke="#A16207"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/* ── Tiny Confetti Ribbon Vector ─────────────────────────────────────────── */
function ConfettiPiece({ color = '#10B981', rotate = 0, style }) {
  return (
    <div
      style={{
        width: 14,
        height: 6,
        borderRadius: 3,
        background: color,
        transform: `rotate(${rotate}deg)`,
        opacity: 0.75,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

/* ── Stat Icon Component with Soft Shadow Aura ───────────────────────────── */
function StatIcon({ type }) {
  const config = {
    teams: {
      color: '#16A34A',
      bg: '#DCFCE7',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    members: {
      color: '#16A34A',
      bg: '#DCFCE7',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    institution: {
      color: '#16A34A',
      bg: '#DCFCE7',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3z" />
        </svg>
      ),
    },
    sdg: {
      color: '#16A34A',
      bg: '#DCFCE7',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  }[type];

  if (!config) return null;

  return (
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: config.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 8px 20px rgba(22, 163, 74, 0.12)',
      }}
    >
      {config.svg}
    </div>
  );
}

/* ── Custom SVG Team Badges ──────────────────────────────────────────────── */
function TeamIcon({ sdg }) {
  const color = SDG_COLORS[sdg] || '#16A34A';
  const icons = {
    9: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    4: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    13: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    3: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    11: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
      </svg>
    ),
    10: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    2: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    6: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    7: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    8: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
        <line x1="12" y1="20" x2="12" y2="10" />
      </svg>
    ),
    16: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 3px 8px ${color}40`,
      }}
    >
      {icons[sdg] || icons[9]}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGINATION (Responsive: Compact for Mobile, Full for Desktop)
   ═══════════════════════════════════════════════════════════════════════════════ */
function Pagination({ current, total, onChange }) {
  // Desktop page list
  let desktopPages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) desktopPages.push(i);
  } else if (current <= 3) {
    desktopPages = [1, 2, 3, '…', total - 1, total];
  } else if (current >= total - 2) {
    desktopPages = [1, 2, '…', total - 2, total - 1, total];
  } else {
    desktopPages = [1, '…', current - 1, current, current + 1, '…', total];
  }

  // Mobile page list (compact: ‹ Prev 1 2 … 16 Next ›)
  let mobilePages = [];
  if (total <= 4) {
    for (let i = 1; i <= total; i++) mobilePages.push(i);
  } else if (current <= 2) {
    mobilePages = [1, 2, '…', total];
  } else if (current >= total - 1) {
    mobilePages = [1, '…', total - 1, total];
  } else {
    mobilePages = [1, '…', current, '…', total];
  }

  return (
    <div>
      {/* Desktop Pagination (> 640px) */}
      <div className="shortlisted-pagination-desktop" style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          style={{
            padding: '0 16px',
            height: 38,
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            background: current === 1 ? '#F8FAFC' : '#111827',
            color: current === 1 ? '#9CA3AF' : '#FFFFFF',
            fontWeight: 700,
            fontSize: 13.5,
            cursor: current === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          ‹ Prev
        </button>
        {desktopPages.map((p, i) =>
          p === '…' ? (
            <span key={`de${i}`} style={{ padding: '0 6px', color: '#9CA3AF', fontWeight: 700 }}>
              …
            </span>
          ) : (
            <button
              key={`dp${p}`}
              onClick={() => onChange(p)}
              style={{
                minWidth: 38,
                height: 38,
                borderRadius: 10,
                border: current === p ? 'none' : '1px solid #E5E7EB',
                background: current === p ? '#111827' : '#FFFFFF',
                color: current === p ? '#FFFFFF' : '#374151',
                fontWeight: 700,
                fontSize: 13.5,
                cursor: 'pointer',
                boxShadow: current === p ? '0 4px 12px rgba(17, 24, 39, 0.15)' : 'none',
              }}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          style={{
            padding: '0 16px',
            height: 38,
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            background: current === total ? '#F8FAFC' : '#111827',
            color: current === total ? '#9CA3AF' : '#FFFFFF',
            fontWeight: 700,
            fontSize: 13.5,
            cursor: current === total ? 'not-allowed' : 'pointer',
          }}
        >
          Next ›
        </button>
      </div>

      {/* Mobile Pagination (<= 640px) */}
      <div className="shortlisted-pagination-mobile" style={{ display: 'none', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
        <button
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          style={{
            padding: '0 12px',
            height: 36,
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            background: current === 1 ? '#F8FAFC' : '#111827',
            color: current === 1 ? '#9CA3AF' : '#FFFFFF',
            fontWeight: 700,
            fontSize: 13,
            cursor: current === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          ‹ Prev
        </button>
        {mobilePages.map((p, i) =>
          p === '…' ? (
            <span key={`me${i}`} style={{ padding: '0 4px', color: '#9CA3AF', fontWeight: 700, fontSize: 13 }}>
              …
            </span>
          ) : (
            <button
              key={`mp${p}`}
              onClick={() => onChange(p)}
              style={{
                minWidth: 34,
                height: 36,
                borderRadius: 8,
                border: current === p ? 'none' : '1px solid #E5E7EB',
                background: current === p ? '#111827' : '#FFFFFF',
                color: current === p ? '#FFFFFF' : '#374151',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: current === p ? '0 4px 12px rgba(17, 24, 39, 0.15)' : 'none',
              }}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          style={{
            padding: '0 12px',
            height: 36,
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            background: current === total ? '#F8FAFC' : '#111827',
            color: current === total ? '#9CA3AF' : '#FFFFFF',
            fontWeight: 700,
            fontSize: 13,
            cursor: current === total ? 'not-allowed' : 'pointer',
          }}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN SHORTLISTED PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function ShortlistedPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const PER_PAGE = 20;

  useEffect(() => {
    setPage(1);
  }, [query]);

  const filtered = useMemo(() => {
    if (!query.trim()) return teamsData;
    const q = query.toLowerCase();
    return teamsData.filter(
      (t) =>
        t.teamName.toLowerCase().includes(q) ||
        t.teamLeader.toLowerCase().includes(q) ||
        t.institution.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // 3 stat metrics
  const stats = [
    { type: 'teams', label: 'Total Shortlisted Teams', value: '100', barWidth: 32 },
    { type: 'institution', label: 'Total Institutions', value: '67', barWidth: 26 },
    { type: 'sdg', label: 'SDGs Covered', value: '17 / 17', barWidth: 48 },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* ════════ EMBEDDED RESPONSIVE STYLES ═════════════════════════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .shortlisted-hero-floating-decorations,
          .hero-hide-mobile {
            display: none !important;
          }
          .shortlisted-hero-section {
            padding-top: 48px !important;
            padding-bottom: 36px !important;
          }
          .shortlisted-hero-title {
            font-size: 32px !important;
          }
          .shortlisted-hero-laurel {
            width: 24px !important;
            height: 32px !important;
          }
          .shortlisted-hero-subtitle {
            font-size: 13.5px !important;
            margin-bottom: 24px !important;
          }
          .shortlisted-search-bar {
            height: 54px !important;
          }
          .shortlisted-main-wrapper {
            margin-top: 24px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 60px !important;
          }
          .shortlisted-stats-container {
            grid-template-columns: 1fr !important;
            padding: 20px 18px !important;
            border-radius: 20px !important;
            gap: 16px !important;
          }
          .shortlisted-stat-item {
            border-right: none !important;
            border-bottom: 1px solid #F3F4F6 !important;
            padding-right: 0 !important;
            padding-bottom: 14px !important;
          }
          .shortlisted-stat-item:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
          .shortlisted-desktop-table {
            display: none !important;
          }
          .shortlisted-mobile-cards {
            display: flex !important;
            flex-direction: column !important;
            gap: 14px !important;
          }
          .shortlisted-pagination-desktop {
            display: none !important;
          }
          .shortlisted-pagination-mobile {
            display: flex !important;
          }
        }

        @media (min-width: 769px) {
          .shortlisted-mobile-cards {
            display: none !important;
          }
          .shortlisted-pagination-mobile {
            display: none !important;
          }
        }
      `}</style>

      {/* ════════ HERO SECTION CONTAINER ═════════════════════════════════════ */}
      <section
        className="shortlisted-hero-section"
        style={{
          position: 'relative',
          paddingTop: 80,
          paddingBottom: 105,
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(34, 197, 94, 0.10) 0%, rgba(255, 255, 255, 0.9) 70%, #FFFFFF 100%)',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* ════════ FLOATING PARALLAX 3D CUPS, SDG CARDS, WHEELS & LEAVES ══════ */}
        <div className="shortlisted-hero-floating-decorations hero-hide-mobile" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>

          {/* Left Side 3D Golden Trophy (~170px) with Ambient Gold Glow & Float */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -12, 0],
              rotate: [-5, -3, -5],
            }}
            transition={{
              opacity: { duration: 0.7 },
              scale: { duration: 0.7 },
              y: { repeat: Infinity, duration: 7, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 7, ease: 'easeInOut' },
            }}
            style={{
              position: 'absolute',
              top: 45,
              left: '3%',
              zIndex: 4,
              pointerEvents: 'none',
            }}
          >
            <GoldenTrophyCard width={165} rotate={-3} />
          </motion.div>

          {/* Right Side 3D Golden Trophy (~170px) with Ambient Gold Glow & Float - Fully Visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -12, 0],
              rotate: [5, 3, 5],
            }}
            transition={{
              opacity: { duration: 0.7 },
              scale: { duration: 0.7 },
              y: { repeat: Infinity, duration: 7, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 7, ease: 'easeInOut' },
            }}
            style={{
              position: 'absolute',
              top: 45,
              right: '3%',
              zIndex: 4,
              pointerEvents: 'none',
            }}
          >
            <GoldenTrophyCard width={165} rotate={3} />
          </motion.div>

          {/* SDG Image Cards - Top Left (Goal 3: Good Health) - 1x Size */}
          <ParallaxElement className="hero-logo-top-left" yOffset={-240} initialRotate={-10} rotationSpeed={15} initialScale={1} style={{ position: 'absolute', top: '12%', left: '14%' }}>
            <SDGCard imgSrc={SDG_IMAGES[3]} alt="Goal 3" />
          </ParallaxElement>

          {/* SDG Image Cards - Top Right (Goal 4: Quality Education) - 1x Size */}
          <ParallaxElement className="hero-logo-top-right" yOffset={-180} initialRotate={12} rotationSpeed={-10} initialScale={1} style={{ position: 'absolute', top: '12%', right: '14%' }}>
            <SDGCard imgSrc={SDG_IMAGES[4]} alt="Goal 4" />
          </ParallaxElement>

          {/* SDG Image Cards - Bottom Left (Goal 5: Gender Equality) - 1x Size */}
          <ParallaxElement className="hero-logo-bottom-left" yOffset={-280} initialRotate={-15} rotationSpeed={20} initialScale={1} style={{ position: 'absolute', bottom: '22%', left: '4.5%' }}>
            <SDGCard imgSrc={SDG_IMAGES[5]} alt="Goal 5" />
          </ParallaxElement>

          {/* SDG Image Cards - Bottom Right (Goal 7: Clean Energy) - 1x Size */}
          <ParallaxElement className="hero-logo-bottom-right" yOffset={-320} initialRotate={8} rotationSpeed={-15} initialScale={1} style={{ position: 'absolute', bottom: '18%', right: '5.5%' }}>
            <SDGCard imgSrc={SDG_IMAGES[7]} alt="Goal 7" />
          </ParallaxElement>

          {/* Hidden on Mobile: Extra Cards, Wheels, Leaves */}
          <div className="hero-hide-mobile">
            {/* Goal 10 (Reduced Inequalities) */}
            <ParallaxElement yOffset={-190} initialRotate={-6} rotationSpeed={8} initialScale={0.95} style={{ position: 'absolute', bottom: '6%', right: '23%' }}>
              <SDGCard imgSrc={SDG_IMAGES[10]} alt="Goal 10" />
            </ParallaxElement>

            {/* Goal 13 (Climate Action) */}
            <ParallaxElement yOffset={-140} initialRotate={10} rotationSpeed={-12} initialScale={0.95} style={{ position: 'absolute', bottom: '4%', left: '14%' }}>
              <SDGCard imgSrc={SDG_IMAGES[13]} alt="Goal 13" />
            </ParallaxElement>

            {/* Blurry & Crisp SDG Wheels - 1x Size */}
            <ParallaxElement yOffset={-100} initialRotate={0} rotationSpeed={45} style={{ position: 'absolute', top: '38%', left: '1%' }}>
              <SDGWheel size={110} blur={2} />
            </ParallaxElement>

            <ParallaxElement yOffset={-300} initialRotate={0} rotationSpeed={-30} style={{ position: 'absolute', top: '32%', right: '1%' }}>
              <SDGWheel size={145} blur={3} />
            </ParallaxElement>

            <ParallaxElement yOffset={-250} initialRotate={0} rotationSpeed={60} style={{ position: 'absolute', bottom: '14%', left: '26%' }}>
              <SDGWheel size={135} blur={0} />
            </ParallaxElement>

            <ParallaxElement yOffset={-180} initialRotate={0} rotationSpeed={-40} style={{ position: 'absolute', bottom: '8%', right: '42%' }}>
              <SDGWheel size={105} blur={2} />
            </ParallaxElement>

            {/* Botanical Leaves */}
            <ParallaxElement yOffset={-150} initialRotate={45} rotationSpeed={30} style={{ position: 'absolute', top: '16%', left: '23%' }}>
              <Leaf size={38} blur={1} />
            </ParallaxElement>
            <ParallaxElement yOffset={-80} initialRotate={-30} rotationSpeed={-45} style={{ position: 'absolute', top: '22%', right: '23%' }}>
              <Leaf size={34} blur={2} />
            </ParallaxElement>
            <ParallaxElement yOffset={-200} initialRotate={15} rotationSpeed={40} style={{ position: 'absolute', bottom: '26%', left: '18%' }}>
              <Leaf size={52} blur={1} />
            </ParallaxElement>
            <ParallaxElement yOffset={-120} initialRotate={-60} rotationSpeed={-35} style={{ position: 'absolute', bottom: '20%', right: '16%' }}>
              <Leaf size={44} blur={2} />
            </ParallaxElement>

            {/* Drifting Confetti Pieces */}
            <ConfettiPiece color="#8B5CF6" rotate={-35} style={{ position: 'absolute', top: 45, right: '12.5%', zIndex: 2 }} />
            <ConfettiPiece color="#F59E0B" rotate={40} style={{ position: 'absolute', top: 100, right: '7%', zIndex: 2 }} />
            <ConfettiPiece color="#10B981" rotate={-20} style={{ position: 'absolute', top: 210, right: '2.5%', zIndex: 2 }} />
            <ConfettiPiece color="#EC4899" rotate={25} style={{ position: 'absolute', top: 125, left: '17%', zIndex: 2 }} />
          </div>
        </div>

        {/* ════════ HERO CENTER CONTENT ═════════════════════════════════════ */}
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
          {/* Top Badge: 🏆 CELEBRATING INNOVATION (White Pill with Light Shadow) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 9999,
              padding: '6px 20px',
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#111827',
              marginBottom: 30,
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            CELEBRATING INNOVATION
          </motion.div>

          {/* Main Heading (Weight 800, Split Colors, Golden Laurel Leaves) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 18,
            }}
          >
            {/* Left Golden Leaf Spray */}
            <GoldenLaurelSpray width={36} height={48} className="shortlisted-hero-laurel" />

            <h1
              className="shortlisted-hero-title"
              style={{
                fontSize: 'clamp(36px, 5.5vw, 62px)',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#111827',
              }}
            >
              Registered <span style={{ color: '#16A34A' }}>Squads</span>
            </h1>

            {/* Right Golden Leaf Spray (Flipped) */}
            <GoldenLaurelSpray width={36} height={48} flip className="shortlisted-hero-laurel" />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="shortlisted-hero-subtitle"
            style={{
              fontSize: 15,
              color: '#6B7280',
              lineHeight: 1.6,
              marginBottom: 30,
              fontWeight: 500,
            }}
          >
            <div>Direct entry to the 24-hour offline Grand Finale on November 6–7 at MIT Mysore!</div>
            <div>
              There are no screening rounds—all registered and verified teams{' '}
              <strong style={{ color: '#16A34A', textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 700 }}>
                build live on campus
              </strong>.
            </div>
          </motion.div>

          {/* Search Bar (Max width 650px, Height 64px, Rounded Full, Focus Scale 1.02) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: searchFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              className="shortlisted-search-bar"
              style={{
                width: '100%',
                maxWidth: 650,
                height: 64,
                background: '#FFFFFF',
                borderRadius: 9999,
                border: searchFocused ? '1.5px solid #16A34A' : '1.5px solid #E5E7EB',
                boxShadow: searchFocused
                  ? '0 12px 36px rgba(22, 163, 74, 0.16), 0 4px 12px rgba(0,0,0,0.04)'
                  : '0 10px 30px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px 0 24px',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Search Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                id="shortlist-search"
                type="text"
                placeholder="Search team name, leader or institution..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '0 16px',
                  borderRadius: 9999,
                  fontSize: 15,
                  color: '#111827',
                  background: 'transparent',
                  fontWeight: 500,
                }}
              />

              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    padding: '0 10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    fontSize: 18,
                  }}
                >
                  ✕
                </button>
              )}

              {/* Circular Filter Button with Light Gray Background & Border */}
              <motion.div
                whileHover={{ scale: 1.08, background: '#E5E7EB' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ MAIN CONTENT WRAPPER ═══════════════════════════════════════ */}
      <div className="shortlisted-main-wrapper" style={{ maxWidth: 1200, margin: '-40px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 12 }}>
        {/* — Statistics Card (3 Metrics: Shortlisted Teams, Institutions, SDGs) — */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="shortlisted-stats-container"
          style={{
            background: '#FFFFFF',
            borderRadius: 28,
            padding: 35,
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid #E5E7EB',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginBottom: 32,
            alignItems: 'center',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="shortlisted-stat-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                paddingRight: i < stats.length - 1 ? 16 : 0,
                borderRight: i < stats.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}
            >
              <StatIcon type={s.type} />
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginBottom: 4 }}>
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: s.value.length > 8 ? 19 : 28,
                    fontWeight: 900,
                    color: '#111827',
                    lineHeight: 1,
                    display: 'inline-block',
                    position: 'relative',
                  }}
                >
                  {s.value}
                  {/* Small Green Underline */}
                  {s.barWidth && (
                    <div
                      style={{
                        height: 3.5,
                        background: '#16A34A',
                        borderRadius: 2,
                        marginTop: 4,
                        width: s.barWidth,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ════════ TEAMS VIEW: DESKTOP TABLE ═════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="shortlisted-desktop-table"
          style={{
            background: '#FFFFFF',
            borderRadius: 24,
            boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            marginBottom: 28,
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '70px 1.5fr 1.2fr 1.8fr 180px',
              padding: '18px 30px',
              borderBottom: '1.5px solid #F3F4F6',
              background: '#FFFFFF',
            }}
          >
            {['S.NO', 'TEAM NAME', 'TEAM LEADER', 'INSTITUTION', 'CITY'].map((h, i) => (
              <div key={i} style={{ fontSize: 12, fontWeight: 800, color: '#16A34A', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                {h}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          <AnimatePresence mode="wait">
            {pageData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '65px 20px', color: '#9CA3AF', fontSize: 15 }}>
                No teams found for "<strong style={{ color: '#374151' }}>{query}</strong>"
              </div>
            ) : (
              <motion.div
                key={`desktop-${query}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {pageData.map((team, idx) => {
                  const rowNum = (page - 1) * PER_PAGE + idx + 1;
                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.025, duration: 0.2 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 1.5fr 1.2fr 1.8fr 180px',
                        padding: '14px 30px',
                        borderBottom: '1px solid #F9FAFB',
                        alignItems: 'center',
                        transition: 'background 0.15s ease',
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FDF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                    >
                      {/* S.NO Badge */}
                      <div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 34,
                            height: 28,
                            background: '#F3F4F6',
                            borderRadius: 8,
                            fontSize: 12.5,
                            fontWeight: 800,
                            color: '#4B5563',
                          }}
                        >
                          {String(rowNum).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Team Name with Custom SDG Vector Icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <TeamIcon sdg={team.sdg} />
                        <span style={{ fontWeight: 800, color: '#111827', fontSize: 14.5 }}>
                          {team.teamName}
                        </span>
                      </div>

                      {/* Team Leader */}
                      <div style={{ fontSize: 13.5, color: '#4B5563', fontWeight: 600 }}>
                        {team.teamLeader}
                      </div>

                      {/* Institution */}
                      <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.4, fontWeight: 500, paddingRight: 10 }}>
                        {team.institution}
                      </div>

                      {/* City with Location Pin Icon (Single Line) */}
                      <div style={{ whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 13,
                            color: '#16A34A',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#16A34A" stroke="#16A34A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" fill="#FFFFFF" />
                          </svg>
                          {team.city}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ════════ TEAMS VIEW: MOBILE INDIVIDUAL CARDS ════════════════════════ */}
        <div className="shortlisted-mobile-cards" style={{ marginBottom: 24 }}>
          <AnimatePresence mode="wait">
            {pageData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF', fontSize: 14, background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB' }}>
                No teams found for "<strong style={{ color: '#374151' }}>{query}</strong>"
              </div>
            ) : (
              <motion.div
                key={`mobile-${query}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                {pageData.map((team, idx) => {
                  const rowNum = (page - 1) * PER_PAGE + idx + 1;
                  const psCode = `PS ${String(team.sdg || 1).padStart(2, '0')}`;
                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 18,
                        padding: '18px 20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #F1F5F9',
                        position: 'relative',
                      }}
                    >
                      {/* Top Row: Team Name & PS Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 26,
                              height: 22,
                              background: '#F1F5F9',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 800,
                              color: '#64748B',
                            }}
                          >
                            #{String(rowNum).padStart(2, '0')}
                          </span>
                          <span style={{ fontWeight: 800, color: '#111827', fontSize: 16.5, letterSpacing: '-0.01em' }}>
                            {team.teamName}
                          </span>
                        </div>

                        {/* PS Pill Badge */}
                        <div
                          style={{
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            color: '#D97706',
                            borderRadius: 9999,
                            padding: '3px 12px',
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                          }}
                        >
                          {psCode}
                        </div>
                      </div>

                      {/* Middle Row 1: Leader */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 13.5, color: '#4B5563' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <div>
                          <span style={{ color: '#6B7280', fontWeight: 500 }}>Leader: </span>
                          <strong style={{ color: '#111827', fontWeight: 700 }}>{team.teamLeader}</strong>
                        </div>
                      </div>

                      {/* Middle Row 2: Institution */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, fontSize: 13.5, color: '#4B5563', lineHeight: 1.4 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                          <path d="M6 6h10" />
                          <path d="M6 10h10" />
                        </svg>
                        <div>
                          <span style={{ color: '#6B7280', fontWeight: 500 }}>Institution: </span>
                          <span style={{ color: '#374151', fontWeight: 600 }}>{team.institution}</span>
                        </div>
                      </div>

                      {/* Bottom Row: City in Single Line */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10, borderTop: '1px solid #F8FAFC', fontSize: 12.5 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#16A34A', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#16A34A" stroke="#16A34A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" fill="#FFFFFF" />
                          </svg>
                          {team.city}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* — Pagination — */}
        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 13, color: '#9CA3AF' }}>
              Showing <strong style={{ color: '#374151' }}>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</strong> of{' '}
              <strong style={{ color: '#374151' }}>{filtered.length}</strong> teams
            </div>
            <Pagination
              current={page}
              total={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
