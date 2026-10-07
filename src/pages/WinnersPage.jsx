import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import winnersData from '../data/winners.json';
import sdgLogoCircle from '../assets/logo/sdg-logo-circle.png';
import goldenTrophyImg from '../assets/logo/golden-trophy-3d.png';

// Import Winner Photos
import winnerPhoto1 from '../assets/highlights/haxlr8_crew_group.jpg';
import winnerPhoto2 from '../assets/highlights/haxlr8_smart_demo.png';
import winnerPhoto3 from '../assets/highlights/haxlr8_jury_pitch.png';

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

    const y = useTransform(smoothScrollY, [0, 1000], [0, yOffset], { clamp: false });
    const rotate = useTransform(smoothScrollY, [0, 1000], [initialRotate, initialRotate + rotationSpeed], { clamp: false });

    return (
        <motion.div className={className} style={{ ...style, y, rotate, scale: initialScale }}>
            {children}
        </motion.div>
    );
};

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

function GoldenLaurelSpray({ width = 48, height = 64, flip = false, className = '' }) {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 48 64"
            fill="none"
            style={{ transform: flip ? 'scaleX(-1)' : 'none', overflow: 'visible' }}
        >
            <defs>
                <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>
            </defs>
            <path d="M4 64C4 45 10 28 24 12" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 16C17 14 11 15 9 19C8 23 13 25 22 20L24 16Z" fill="url(#goldLeafGrad)" stroke="#A16207" strokeWidth="0.8" />
            <path d="M27 22C33 19 39 21 40 25C41 29 36 32 29 27L27 22Z" fill="url(#goldLeafGrad)" stroke="#A16207" strokeWidth="0.8" />
            <path d="M24 32C16 31 10 34 9 39C8 44 14 45 23 37L24 32Z" fill="url(#goldLeafGrad)" stroke="#A16207" strokeWidth="0.8" />
            <path d="M29 38C36 36 41 40 41 44C40 48 34 50 29 43L29 38Z" fill="url(#goldLeafGrad)" stroke="#A16207" strokeWidth="0.8" />
        </svg>
    );
}

function StatIcon({ type }) {
    const config = {
        teams: {
            color: '#16A34A', bg: '#DCFCE7',
            svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        },
        institution: {
            color: '#16A34A', bg: '#DCFCE7',
            svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3z" /></svg>
        },
        sdg: {
            color: '#16A34A', bg: '#DCFCE7',
            svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        }
    }[type];

    if (!config) return null;
    return (
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {config.svg}
        </div>
    );
}

function TechFloatingIcon({ type, size = 60, blur = 0 }) {
    const icons = {
        code: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        nodes: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
        ),
        braces: (
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 4 c-2 3 -2 7 -2 8 s 0 5 2 8" />
                <path d="M14 4 c 2 3 2 7 2 8 s 0 5 -2 8" />
            </svg>
        ),
    };

    return (
        <div style={{
            width: size, height: size,
            background: '#ffffff', borderRadius: size * 0.25,
            border: '2px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            filter: blur ? `blur(${blur}px)` : 'none',
        }}>
            <div style={{ width: size * 0.5, height: size * 0.5 }}>
                {icons[type] || icons.code}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MEDAL COMPONENTS — match reference exactly
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Laurel branch (left or right) ───────────────────────────────────────── */
function LaurelBranch({ side = 'left', color = '#ca8a04', size = 36 }) {
    const flip = side === 'right' ? 'scale(-1,1)' : 'scale(1,1)';
    return (
        <svg width={size} height={size * 1.3} viewBox="0 0 36 48" fill="none" style={{ display: 'block' }}>
            <defs>
                <linearGradient id={`lg-${side}-${color.replace('#', '')}`} x1="0" y1="0" x2="36" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                    <stop offset="60%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </linearGradient>
            </defs>
            <g transform={`${flip} translate(${side === 'right' ? -36 : 0},0)`}>
                <path d="M28 46C24 38 20 25 22 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="17" cy="5" rx="6.5" ry="3.5" transform="rotate(-35 17 5)" fill={`url(#lg-${side}-${color.replace('#', '')})`} opacity="0.95" />
                <ellipse cx="20" cy="14" rx="6" ry="3.2" transform="rotate(-18 20 14)" fill={`url(#lg-${side}-${color.replace('#', '')})`} opacity="0.9" />
                <ellipse cx="22" cy="23" rx="5.5" ry="3" transform="rotate(-5  22 23)" fill={`url(#lg-${side}-${color.replace('#', '')})`} opacity="0.85" />
                <ellipse cx="21" cy="32" rx="5" ry="2.8" transform="rotate( 8  21 32)" fill={`url(#lg-${side}-${color.replace('#', '')})`} opacity="0.75" />
                <ellipse cx="25" cy="40" rx="4.5" ry="2.5" transform="rotate( 18 25 40)" fill={`url(#lg-${side}-${color.replace('#', '')})`} opacity="0.65" />
            </g>
        </svg>
    );
}

/* ── 1st Place Medal: Gold circle + crown + red ribbon ───────────────────── */
function GoldMedal({ size = 90 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 12, position: 'relative' }}>
            {/* Crown */}
            <svg width={size * 0.5} height={size * 0.3} viewBox="0 0 44 26" fill="none" style={{ marginBottom: -4, zIndex: 2 }}>
                <path d="M2 24 L8 8 L16 18 L22 4 L28 18 L36 8 L42 24 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="2" cy="24" r="2.5" fill="#FDE047" />
                <circle cx="22" cy="4" r="2.5" fill="#FDE047" />
                <circle cx="42" cy="24" r="2.5" fill="#FDE047" />
                <rect x="1" y="22" width="42" height="5" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
            </svg>

            {/* Medal circle + laurels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LaurelBranch side="left" color="#CA8A04" size={34} />

                <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
                    {/* Glow */}
                    <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'radial-gradient(circle,rgba(250,204,21,0.45),transparent)', filter: 'blur(10px)', pointerEvents: 'none' }} />
                    <svg width={size} height={size} viewBox="0 0 90 90">
                        <defs>
                            <radialGradient id="goldRing" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#FEF9C3" />
                                <stop offset="35%" stopColor="#FACC15" />
                                <stop offset="75%" stopColor="#EAB308" />
                                <stop offset="100%" stopColor="#CA8A04" />
                            </radialGradient>
                            <radialGradient id="goldCenter" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#FFFBEB" />
                                <stop offset="40%" stopColor="#FEF08A" />
                                <stop offset="100%" stopColor="#FACC15" />
                            </radialGradient>
                        </defs>
                        {/* Outer ring */}
                        <circle cx="45" cy="45" r="43" fill="url(#goldRing)" />
                        {/* Inner circle */}
                        <circle cx="45" cy="45" r="32" fill="url(#goldCenter)" />
                        {/* Shine */}
                        <ellipse cx="34" cy="30" rx="9" ry="6" transform="rotate(-35 34 30)" fill="rgba(255,255,255,0.55)" />
                        {/* "1" */}
                        <text x="45" y="60" textAnchor="middle" fontSize="36" fontWeight="900" fill="#78350F" fontFamily="Georgia,serif">1</text>
                    </svg>
                </div>

                <LaurelBranch side="right" color="#CA8A04" size={34} />
            </div>

            {/* Red ribbon */}
            <div style={{ display: 'flex', gap: 3, marginTop: 2, zIndex: 2 }}>
                <div style={{
                    width: 26, height: 36, background: 'linear-gradient(180deg,#DC2626,#B91C1C)', borderRadius: '2px 2px 0 0',
                    clipPath: 'polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)', boxShadow: '1px 0 4px rgba(0,0,0,0.2)'
                }} />
                <div style={{
                    width: 26, height: 36, background: 'linear-gradient(180deg,#EF4444,#DC2626)', borderRadius: '2px 2px 0 0',
                    clipPath: 'polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)', boxShadow: '-1px 0 4px rgba(0,0,0,0.2)'
                }} />
            </div>
        </div>
    );
}

/* ── 2nd Place Medal: Silver hexagon + laurels below ─────────────────────── */
function SilverMedal({ size = 82 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
            {/* Hex + laurels side by side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LaurelBranch side="left" color="#94A3B8" size={28} />

                <div style={{ position: 'relative', width: size, height: size }}>
                    <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(circle,rgba(148,163,184,0.35),transparent)', filter: 'blur(8px)', pointerEvents: 'none' }} />
                    <svg width={size} height={size} viewBox="0 0 82 82">
                        <defs>
                            <linearGradient id="silverHex" x1="0" y1="0" x2="82" y2="82" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#F8FAFC" />
                                <stop offset="35%" stopColor="#E2E8F0" />
                                <stop offset="70%" stopColor="#CBD5E1" />
                                <stop offset="100%" stopColor="#94A3B8" />
                            </linearGradient>
                            <linearGradient id="silverHexIn" x1="0" y1="0" x2="82" y2="82" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="50%" stopColor="#F1F5F9" />
                                <stop offset="100%" stopColor="#E2E8F0" />
                            </linearGradient>
                        </defs>
                        {/* Outer hexagon */}
                        <polygon points="41,2 77,21 77,61 41,80 5,61 5,21" fill="url(#silverHex)" stroke="#CBD5E1" strokeWidth="1" />
                        {/* Inner hexagon */}
                        <polygon points="41,12 67,27 67,57 41,72 15,57 15,27" fill="url(#silverHexIn)" />
                        {/* Shine */}
                        <ellipse cx="30" cy="26" rx="8" ry="5" transform="rotate(-25 30 26)" fill="rgba(255,255,255,0.65)" />
                        {/* "2" */}
                        <text x="41" y="56" textAnchor="middle" fontSize="30" fontWeight="900" fill="#334155" fontFamily="Georgia,serif">2</text>
                    </svg>
                </div>

                <LaurelBranch side="right" color="#94A3B8" size={28} />
            </div>
        </div>
    );
}

/* ── 3rd Place Medal: Bronze circle + laurels ────────────────────────────── */
function BronzeMedal({ size = 82 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LaurelBranch side="left" color="#B45309" size={28} />

                <div style={{ position: 'relative', width: size, height: size }}>
                    <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(circle,rgba(180,83,9,0.32),transparent)', filter: 'blur(8px)', pointerEvents: 'none' }} />
                    <svg width={size} height={size} viewBox="0 0 82 82">
                        <defs>
                            <radialGradient id="bronzeRad" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#FEF3C7" />
                                <stop offset="30%" stopColor="#FCD34D" />
                                <stop offset="65%" stopColor="#D97706" />
                                <stop offset="100%" stopColor="#92400E" />
                            </radialGradient>
                            <radialGradient id="bronzeIn" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#FFFBEB" />
                                <stop offset="40%" stopColor="#FDE68A" />
                                <stop offset="100%" stopColor="#FBBF24" />
                            </radialGradient>
                        </defs>
                        <circle cx="41" cy="41" r="39" fill="url(#bronzeRad)" />
                        <circle cx="41" cy="41" r="28" fill="url(#bronzeIn)" />
                        <ellipse cx="30" cy="28" rx="7" ry="5" transform="rotate(-30 30 28)" fill="rgba(255,255,255,0.45)" />
                        <text x="41" y="56" textAnchor="middle" fontSize="30" fontWeight="900" fill="#78350F" fontFamily="Georgia,serif">3</text>
                    </svg>
                </div>

                <LaurelBranch side="right" color="#B45309" size={28} />
            </div>
        </div>
    );
}

/* ── Corner ribbon badge ("1st", "2nd", "3rd") ───────────────────────────── */
function CornerRibbon({ rank }) {
    const cfg = {
        1: { bg: 'linear-gradient(135deg,#FACC15,#CA8A04)', text: '1st' },
        2: { bg: 'linear-gradient(135deg,#CBD5E1,#64748B)', text: '2nd' },
        3: { bg: 'linear-gradient(135deg,#D97706,#92400E)', text: '3rd' },
    }[rank];
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: 64, height: 64, overflow: 'hidden', borderRadius: '22px 0 0 0', zIndex: 10, pointerEvents: 'none' }}>
            <div style={{
                position: 'absolute', top: 10, left: -22, width: 90, height: 28,
                background: cfg.bg,
                transform: 'rotate(-45deg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, letterSpacing: '0.04em', textShadow: '0 1px 2px rgba(0,0,0,0.25)', marginLeft: 8 }}>
                    {cfg.text}
                </span>
            </div>
        </div>
    );
}

/* ── 3D Cylindrical Podium ───────────────────────────────────────────────── */
function Podium({ rank }) {
    const cfg = {
        1: {
            h: 52,
            top: 'linear-gradient(180deg,#FEF9C3 0%,#FACC15 60%,#EAB308 100%)',
            side: 'linear-gradient(180deg,#EAB308 0%,#CA8A04 100%)',
            ellipseRx: '49%', ellipseRy: '28%',
            shadow: 'rgba(202,138,4,0.5)',
            shimmer: true,
        },
        2: {
            h: 36,
            top: 'linear-gradient(180deg,#F8FAFC 0%,#CBD5E1 60%,#94A3B8 100%)',
            side: 'linear-gradient(180deg,#94A3B8 0%,#64748B 100%)',
            ellipseRx: '49%', ellipseRy: '28%',
            shadow: 'rgba(100,116,139,0.4)',
            shimmer: false,
        },
        3: {
            h: 26,
            top: 'linear-gradient(180deg,#FEF3C7 0%,#D97706 60%,#92400E 100%)',
            side: 'linear-gradient(180deg,#D97706 0%,#92400E 100%)',
            ellipseRx: '49%', ellipseRy: '28%',
            shadow: 'rgba(180,83,9,0.42)',
            shimmer: false,
        },
    }[rank];

    const totalH = cfg.h + 24;

    return (
        <div style={{ width: '100%', marginTop: 16, position: 'relative', height: totalH }}>
            {/* Top ellipse cap */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 20,
                background: cfg.top,
                borderRadius: '50%',
                boxShadow: `0 -3px 12px ${cfg.shadow}`,
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', left: '20%', top: '20%', width: '28%', height: '55%',
                    background: 'rgba(255,255,255,0.5)', borderRadius: '50%', filter: 'blur(3px)'
                }} />
            </div>
            {/* Cylinder body */}
            <div style={{
                position: 'absolute', top: 10, left: 0, right: 0, height: cfg.h,
                background: cfg.side,
                overflow: 'hidden',
                boxShadow: `0 10px 30px ${cfg.shadow}`,
            }}>
                {cfg.shimmer && (
                    <motion.div
                        animate={{ x: ['-120%', '220%'] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: 'linear', delay: 1 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
                            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)'
                        }}
                    />
                )}
            </div>
            {/* Bottom ellipse */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 14,
                background: cfg.side,
                borderRadius: '50%',
                boxShadow: `0 6px 18px ${cfg.shadow}`,
            }} />
        </div>
    );
}

/* ── Prize Box ───────────────────────────────────────────────────────────── */
function PrizeBox({ rank, amount }) {
    const cfg = {
        1: { bg: 'linear-gradient(135deg,#FFFBEB,#FEF9C3)', border: '#FDE68A', color: '#92400E' },
        2: { bg: 'linear-gradient(135deg,#F8FAFC,#F1F5F9)', border: '#E2E8F0', color: '#334155' },
        3: { bg: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '#FDE68A', color: '#92400E' },
    }[rank];
    return (
        <div style={{
            width: '100%', background: cfg.bg, border: `1.5px solid ${cfg.border}`,
            borderRadius: 14, padding: '10px 16px', textAlign: 'center', marginBottom: 0
        }}>
            <div style={{ fontSize: 11.5, color: '#9ca3af', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 3 }}>
                Prize
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: cfg.color, letterSpacing: '-0.01em' }}>
                ₹ {amount.toLocaleString('en-IN')}
            </div>
        </div>
    );
}

/* ── Consolation Icon ────────────────────────────────────────────────────── */
function ConsolationIcon({ type }) {
    const c = '#16a34a';
    const icons = {
        leaf: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.7A1 1 0 0 0 4.76 21c2.5-.5 7.6-2.5 8.24-11" /><path d="M2 21C9 18 14 14 14 7" /></svg>,
        code: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
        bulb: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" /></svg>,
        rocket: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /></svg>,
    };
    return (
        <div style={{
            width: 50, height: 50, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px', boxShadow: '0 4px 14px rgba(22,163,74,0.18)', border: '1.5px solid #bbf7d0'
        }}>
            {icons[type] || icons.bulb}
        </div>
    );
}

/* ── Photo Slideshow Component ─────────────────────────────────────────────── */
function PhotoSlideshow({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: 1000, margin: '0 auto', aspectRatio: '16/9', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </AnimatePresence>
            
            {/* Dots */}
            <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10, zIndex: 10 }}>
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: idx === currentIndex ? 24 : 10,
                            height: 10,
                            borderRadius: 5,
                            background: idx === currentIndex ? '#22c55e' : 'rgba(255,255,255,0.5)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function WinnersPage() {
    const { mainWinners, consolationWinners } = winnersData;
    const allWinners = [...mainWinners, ...consolationWinners];

    const totalPrize = allWinners.reduce((acc, curr) => acc + (curr.prize || 0), 0);
    const totalInstitutions = new Set(allWinners.map(w => w.institution)).size;

    const stats = [
        { type: 'teams', label: 'Total Winners', value: `${allWinners.length}`, barWidth: '60%' },
        { type: 'institution', label: 'Total Institutions', value: `${totalInstitutions}`, barWidth: '40%' },
        { type: 'sdg', label: 'Total Prize Pool', value: `₹ ${totalPrize.toLocaleString('en-IN')}`, barWidth: '70%' },
    ];

    // Rearrange main winners for visual layout
    const podiumOrder = [
        mainWinners.find(w => w.rank === 2),
        mainWinners.find(w => w.rank === 1),
        mainWinners.find(w => w.rank === 3),
    ].filter(Boolean);

    const cardAnim = {
        hidden: { opacity: 0, y: 40 },
        visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.13, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#fff',
            fontFamily: "'Plus Jakarta Sans','Inter',-apple-system,sans-serif", overflowX: 'hidden', position: 'relative'
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .wpage-winners-grid { display:flex; gap:24px; justify-content:center; align-items:flex-end; }
        .wpage-conso-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }

        .main-winner-card {
          border-radius: 22px;
          padding: 24px 20px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .main-winner-card:hover { transform: translateY(-6px); }

        .ccard {
          background:#fff; border-radius:20px; border:1.5px solid #f0fdf4;
          box-shadow:0 4px 20px rgba(0,0,0,0.07); padding:22px 18px;
          display:flex; flex-direction:column; align-items:center; text-align:center;
          transition:transform .3s, box-shadow .3s; position:relative; overflow:hidden;
        }
        .ccard::before { content:''; position:absolute; top:0; left:0; right:0; height:4px;
          background:linear-gradient(90deg,#22c55e,#4ade80); }
        .ccard:hover { transform:translateY(-4px); box-shadow:0 14px 36px rgba(22,163,74,0.14); }

        .sec-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 20px; border-radius: 999px;
          font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .hero-hide-mobile { display: none !important; }
          .wpage-winners-grid { flex-direction:column !important; align-items:center !important; gap:24px !important; }
          .wpage-winners-grid > * { width:92% !important; max-width:350px !important; flex:none !important; }
          .wpage-conso-grid { grid-template-columns:1fr !important; }
          .winners-hero-title { font-size:36px !important; }
          .winners-hero-sub   { font-size:22px !important; }
          .mobile-order-1 { order: 1 !important; }
          .mobile-order-2 { order: 2 !important; }
          .mobile-order-3 { order: 3 !important; }
          .conso-card { padding: 18px 16px 16px !important; }
          .conso-card .icon-circle { width: 66px !important; height: 66px !important; margin-bottom: 8px !important; }
          .conso-card .icon-circle .bg-circle { width: 52px !important; height: 52px !important; }
          .conso-card .icon-circle svg { width: 24px !important; height: 24px !important; }
          .conso-card .prize-box { padding: 8px 12px !important; }
          .conso-card > div:nth-child(6) { margin-bottom: 8px !important; } /* city margin */
          .conso-card > div:nth-child(7) { margin-bottom: 12px !important; } /* divider margin */
        }
      `}</style>

            <section id="hero-wrapper" style={{
                position: 'relative',
                background: 'radial-gradient(ellipse at top, #f0fdf4 0%, #ffffff 70%)',
                paddingTop: 80,
                paddingBottom: 60,
                overflow: 'hidden',
            }}>
                {/* ════════ FLOATING PARALLAX 3D CUPS, SDG CARDS, WHEELS & LEAVES ══════ */}
                <div className="shortlisted-hero-floating-decorations hero-hide-mobile" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>

                    {/* Ambient Parallax Typography Motivating Words */}
                    <ParallaxElement yOffset={-180} initialRotate={-90} rotationSpeed={5} style={{ position: 'absolute', top: '15%', left: '-15%', opacity: 0.03, zIndex: 1 }}>
                        <h2 style={{ fontSize: '180px', fontWeight: 900, whiteSpace: 'nowrap', color: '#16a34a', letterSpacing: '-0.02em' }}>INNOVATE</h2>
                    </ParallaxElement>
                    <ParallaxElement yOffset={-260} initialRotate={90} rotationSpeed={-5} style={{ position: 'absolute', top: '45%', right: '-25%', opacity: 0.03, zIndex: 1 }}>
                        <h2 style={{ fontSize: '200px', fontWeight: 900, whiteSpace: 'nowrap', color: '#22c55e', letterSpacing: '-0.02em' }}>DREAM BIG</h2>
                    </ParallaxElement>
                    <ParallaxElement yOffset={100} initialRotate={-8} rotationSpeed={8} style={{ position: 'absolute', bottom: '15%', left: '-5%', opacity: 0.03, zIndex: 1 }}>
                        <h2 style={{ fontSize: '150px', fontWeight: 900, whiteSpace: 'nowrap', color: '#15803d', letterSpacing: '-0.02em' }}>BUILD</h2>
                    </ParallaxElement>

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

                {/* ══ HERO CENTER CONTENT ══════════════════════════════════════════════════════════ */}
                <div style={{ position: 'relative', zIndex: 5, maxWidth: 720, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* Pill badge */}
                        <div className="sec-badge" style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', color: '#28613dff', marginBottom: 24, boxShadow: '0 4px 14px rgba(222, 25, 25, 0.02)', fontSize: 13, fontWeight: 700, padding: '8px 24px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}>
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            WINNERS ANNOUNCEMENT
                        </div>
                    </motion.div>

                    {/* Main heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
                    >
                        <h1 className="winners-hero-title" style={{ fontSize: 'clamp(44px, 6.5vw, 76px)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#0f172a' }}>
                            Congratulations to
                        </h1>
                        <h1 className="winners-hero-title" style={{ fontSize: 'clamp(44px, 6.5vw, 76px)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#16a34a' }}>
                            Our Winners!
                        </h1>
                    </motion.div>

                    {/* Sub heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.18 }}
                        className="winners-hero-sub"
                        style={{ fontSize: 18, color: '#475569', fontWeight: 500, lineHeight: 1.6, marginBottom: 40 }}
                    >
                        Celebrating innovation, creativity and impact.
                    </motion.div>
                </div>

                {/* ════════ MAIN CONTENT WRAPPER ═══════════════════════════════════════ */}
                {/* — Statistics Card — */}
                {/* <div style={{ maxWidth: 1050, margin: '20px auto 0', padding: '0 24px', position: 'relative', zIndex: 12, width: '100%' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        style={{
                            background: '#FFFFFF',
                            borderRadius: 28,
                            padding: 35,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                            border: '1px solid #E5E7EB',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: 20,
                            alignItems: 'center',
                        }}
                    >
                        {stats.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingRight: i < stats.length - 1 ? 16 : 0, borderRight: i < stats.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                <StatIcon type={s.type} />
                                <div>
                                    <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginBottom: 4 }}>
                                        {s.label}
                                    </div>
                                    <div style={{ fontSize: s.value.length > 8 ? 19 : 28, fontWeight: 900, color: '#111827', lineHeight: 1, display: 'inline-block', position: 'relative' }}>
                                        {s.value}
                                        {s.barWidth && <div style={{ height: 3.5, background: '#16A34A', borderRadius: 2, marginTop: 4, width: s.barWidth }} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div> */}
            </section>

            {/* ══ WINNER CARDS ════════════════════════════════════════════════════ */}
            <section style={{ padding: '40px 24px 100px', maxWidth: 1050, margin: '20px auto 0', position: 'relative', zIndex: 5 }}>

                {/* ── Desktop Side Decorations for Winners Podium ── */}
                <div className="hero-hide-mobile" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                    {/* Left Gutter Parallax */}
                    <ParallaxElement yOffset={-140} initialRotate={20} rotationSpeed={-15} style={{ position: 'absolute', top: '30%', left: '-20%' }}>
                        <SDGWheel size={110} blur={4} />
                    </ParallaxElement>
                    <ParallaxElement yOffset={-60} initialRotate={-10} rotationSpeed={30} style={{ position: 'absolute', top: '55%', left: '-10%' }}>
                        <TechFloatingIcon type="code" size={60} blur={2.5} />
                    </ParallaxElement>
                    <ParallaxElement yOffset={-80} initialRotate={-10} rotationSpeed={30} style={{ position: 'absolute', bottom: '10%', left: '-12%' }}>
                        <Leaf size={45} blur={1} />
                    </ParallaxElement>
                    <ConfettiPiece color="#F59E0B" rotate={15} style={{ position: 'absolute', top: '20%', left: '-5%', zIndex: 2 }} />
                    <ConfettiPiece color="#3B82F6" rotate={-45} style={{ position: 'absolute', bottom: '30%', left: '-15%', zIndex: 2 }} />

                    {/* Right Gutter Parallax */}
                    <ParallaxElement yOffset={-190} initialRotate={-15} rotationSpeed={12} style={{ position: 'absolute', top: '15%', right: '-30%' }}>
                        <SDGWheel size={150} blur={2} />
                    </ParallaxElement>
                    <ParallaxElement yOffset={-110} initialRotate={30} rotationSpeed={-20} style={{ position: 'absolute', top: '45%', right: '-15%' }}>
                        <TechFloatingIcon type="nodes" size={54} blur={1.5} />
                    </ParallaxElement>
                    <ParallaxElement yOffset={-120} initialRotate={45} rotationSpeed={-25} style={{ position: 'absolute', bottom: '15%', right: '-18%' }}>
                        <Leaf size={55} blur={2} />
                    </ParallaxElement>
                    <ConfettiPiece color="#10B981" rotate={-25} style={{ position: 'absolute', top: '40%', right: '-8%', zIndex: 2 }} />
                    <ConfettiPiece color="#8B5CF6" rotate={50} style={{ position: 'absolute', bottom: '0%', right: '-20%', zIndex: 2 }} />
                </div>

                {/* Section Title */}
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 50, position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontSize: 44, fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        Winner's of <span style={{ color: '#16a34a' }}>SRCAS Hackathon 3.0</span>
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: 16, fontWeight: 500, marginTop: 8 }}>
                        These innovators have delivered the best solutions to real-world challenges!
                    </p>
                </motion.div>

                <div className="wpage-winners-grid" style={{ position: 'relative', zIndex: 5 }}>
                    {podiumOrder.map((w, idx) => {
                        const isFirst = w.rank === 1;

                        const cardStyle = {
                            1: {
                                bg: '#fff',
                                border: '2px solid #FDE047',
                                shadow: '0 20px 64px rgba(234,179,8,0.18), 0 6px 20px rgba(0,0,0,0.06)',
                            },
                            2: {
                                bg: '#fff',
                                border: '1.5px solid #E2E8F0',
                                shadow: '0 10px 40px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.04)',
                            },
                            3: {
                                bg: '#fff',
                                border: '1.5px solid #FDE68A',
                                shadow: '0 10px 40px rgba(180,83,9,0.10), 0 3px 10px rgba(0,0,0,0.04)',
                            },
                        }[w.rank];

                        return (
                            <motion.div key={w.rank} custom={idx} initial="hidden" whileInView="visible"
                                viewport={{ once: true }} variants={cardAnim}
                                className={`mobile-order-${w.rank}`}
                                style={{ flex: isFirst ? '0 0 350px' : '0 0 290px' }}>

                                <div className="main-winner-card" style={{
                                    background: cardStyle.bg,
                                    border: cardStyle.border,
                                    boxShadow: cardStyle.shadow,
                                    paddingTop: isFirst ? 36 : 28,
                                }}>
                                    {/* Corner ribbon */}
                                    <CornerRibbon rank={w.rank} />

                                    {/* Medal */}
                                    {w.rank === 1 && <GoldMedal size={isFirst ? 116 : 90} />}
                                    {w.rank === 2 && <SilverMedal size={90} />}
                                    {w.rank === 3 && <BronzeMedal size={90} />}

                                    {/* Name */}
                                    <div style={{ fontWeight: 900, fontSize: isFirst ? 23 : 19, color: '#111827', marginBottom: 4, lineHeight: 1.2, marginTop: 4 }}>
                                        {w.teamName}
                                    </div>

                                    {/* Institution */}
                                    <div style={{
                                        color: '#6B7280', fontSize: 12.5, fontWeight: 500, lineHeight: 1.4, marginBottom: 6,
                                        width: '100%', padding: '0 8px', boxSizing: 'border-box',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }} title={w.institution}>
                                        {w.institution}
                                    </div>

                                    {/* City */}
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F9FAFB', border: '1px solid #F3F4F6',
                                        borderRadius: 999, padding: '3px 10px', fontSize: 12, color: '#6B7280', fontWeight: 500, marginBottom: 14
                                    }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        {w.city}
                                    </div>

                                    {/* Prize box */}
                                    <PrizeBox rank={w.rank} amount={w.prize} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ══ WINNERS GALLERY ═════════════════════════════════════════════════ */}
            <section style={{ position: 'relative', padding: '80px 24px 120px', background: 'radial-gradient(ellipse at bottom, #f0fdf4 0%, #ffffff 80%)', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    
                    {/* ── Section header ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: 48 }}>
                        
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                            border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(22,163,74,0.18)'
                        }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                            </svg>
                        </div>

                        <h2 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            <span style={{ color: '#111827' }}>Event </span>
                            <span style={{ color: '#16a34a' }}>Gallery</span>
                        </h2>

                        <p style={{ color: '#6b7280', fontSize: 15, fontWeight: 500, margin: '0 0 16px' }}>
                            Glimpses of the Grand Finale and Award Ceremony.
                        </p>

                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: '#fff', border: '1.5px solid #d1fae5', borderRadius: 999,
                            padding: '6px 18px', fontSize: 13, color: '#374151', fontWeight: 600
                        }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                            HAXLR8 2.0 • MIT Mysore
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                        </div>
                    </motion.div>

                    {/* Slideshow */}
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <PhotoSlideshow images={[winnerPhoto1, winnerPhoto2, winnerPhoto3]} />
                    </motion.div>
                </div>
            </section>

           
        </div>
    );
}
