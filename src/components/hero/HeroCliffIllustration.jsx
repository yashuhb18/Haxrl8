import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCrewmatePopSound, playTaskCompleteSound } from '../amongus/AmongUsSound';

const CODING_QUOTES = [
  "HACKING MAINFRAME... 💻",
  "0 BUGS DETECTED! 🐛",
  "COFFEE ➔ CODE PIPELINE ☕",
  "OVERCLOCKING CPU TO 9000! 🔥",
  "404: SLEEP NOT FOUND ⚡",
  "SUBMITTING PULL REQUEST 🚀",
  "ALL TESTS PASSING: 100% ✅",
  "IMPOSTOR CAUGHT CODING 👑",
];

export default function HeroCliffIllustration() {
  const [turboMode, setTurboMode] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [linesOfCode, setLinesOfCode] = useState(42069);
  const [showSparks, setShowSparks] = useState(false);

  // Live rapid code line counter
  useEffect(() => {
    const timer = setInterval(() => {
      setLinesOfCode((prev) => prev + Math.floor(Math.random() * 16) + 7);
    }, 450);
    return () => clearInterval(timer);
  }, []);

  // Periodic automatic quote changer
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CODING_QUOTES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const handleCrewmateClick = () => {
    setTurboMode(true);
    setShowSparks(true);
    setQuoteIndex((prev) => (prev + 1) % CODING_QUOTES.length);
    setLinesOfCode((prev) => prev + 500);

    try {
      playCrewmatePopSound();
      setTimeout(() => playTaskCompleteSound(), 250);
    } catch {
      // Audio fallback
    }

    setTimeout(() => {
      setTurboMode(false);
      setShowSparks(false);
    }, 2800);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '740px',
        margin: '0 auto',
        userSelect: 'none',
      }}
    >
      {/* ── INTERACTIVE FLOATING SPEECH BUBBLE OVER CREWMATE ── */}
      <motion.div
        onClick={handleCrewmateClick}
        whileHover={{ scale: 1.06, y: -4 }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '47%',
          transform: 'translateX(-50%)',
          zIndex: 25,
          cursor: 'pointer',
        }}
        title="Click to Overclock the Coder!"
      >
        <div
          className="hero-speech-bubble-card"
          style={{
            background: turboMode
              ? 'linear-gradient(135deg, #ff007a 0%, #7928ca 100%)'
              : 'rgba(255, 255, 255, 0.98)',
            color: turboMode ? '#ffffff' : '#0f172a',
            border: turboMode ? '3px solid #facc15' : '3px solid #0f172a',
            borderRadius: '20px',
            padding: '8px 16px',
            boxShadow: turboMode
              ? '0 8px 25px rgba(255, 0, 122, 0.5), 0 0 15px rgba(250, 204, 21, 0.6)'
              : '0 8px 20px rgba(0, 0, 0, 0.12)',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="hero-speech-bubble-loc"
              style={{
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: turboMode ? '#fef08a' : '#0284c7',
              }}
            >
              {turboMode ? '⚡ TURBO OVERCLOCK ⚡' : `LIVE: ${linesOfCode.toLocaleString()} LOC`}
            </span>
          </div>

          <span
            className="hero-speech-bubble-quote"
            style={{
              fontSize: '12px',
              fontWeight: 900,
              fontFamily: "'Fredoka', sans-serif",
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {CODING_QUOTES[quoteIndex]}
          </span>

          <span
            className="hero-speech-bubble-tap"
            style={{
              fontSize: '9px',
              fontWeight: 700,
              opacity: 0.8,
              marginTop: '1px',
              color: turboMode ? '#ffffff' : '#64748b',
            }}
          >
            {turboMode ? '🔥 HYPER-CODING ENGAGED!' : '👆 TAP TO OVERCLOCK!'}
          </span>

          {/* Speech bubble pointy arrow pointing down at Crewmate */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: turboMode ? '8px solid #7928ca' : '8px solid #0f172a',
            }}
          />
        </div>
      </motion.div>

      <svg
        viewBox="0 0 740 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        onClick={handleCrewmateClick}
      >
        <defs>
          {/* Ambient Warm Sky Glow */}
          <radialGradient id="skyGlow" cx="60%" cy="38%" r="55%" fx="60%" fy="38%">
            <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#ffedd5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fffaf3" stopOpacity="0" />
          </radialGradient>

          {/* Rock Facet Gradients */}
          <linearGradient id="cliffFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfa085" />
            <stop offset="50%" stopColor="#8d6e53" />
            <stop offset="100%" stopColor="#5d432c" />
          </linearGradient>

          <linearGradient id="cliffFacet2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4bbaa" />
            <stop offset="60%" stopColor="#a88970" />
            <stop offset="100%" stopColor="#7a5c43" />
          </linearGradient>

          <linearGradient id="cliffFacetDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5c4028" />
            <stop offset="100%" stopColor="#382414" />
          </linearGradient>

          {/* Red Crewmate Suit Gradients */}
          <linearGradient id="crewRedGrad" x1="25%" y1="0%" x2="75%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="35%" stopColor="#ef233c" />
            <stop offset="80%" stopColor="#c9184a" />
            <stop offset="100%" stopColor="#800f2f" />
          </linearGradient>

          <linearGradient id="crewVisorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#a5f3fc" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* MIT Mysore Campus Building Gradient */}
          <linearGradient id="mitBuildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="45%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Cyber Terminal Hologram Glow Filter */}
          <filter id="hologramGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00f5d4" floodOpacity="0.8" />
          </filter>

          {/* Drone Laser Beam Gradient */}
          <linearGradient id="droneLaserBeam" x1="50%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38fedc" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#00f5d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.02" />
          </linearGradient>

          {/* Turbo Overclock Shield Gradient */}
          <radialGradient id="overclockAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ── Background Sky Glow ── */}
        <circle cx="440" cy="240" r="290" fill="url(#skyGlow)" />

        {/* ── Distant Ringed Planet ── */}
        <g transform="translate(650, 80)">
          <ellipse cx="0" cy="0" rx="46" ry="14" stroke="#c084fc" strokeWidth="4.5" fill="none" opacity="0.6" transform="rotate(-25)" />
          <circle cx="0" cy="0" r="26" fill="#a855f7" />
          <circle cx="-6" cy="-6" r="20" fill="#c084fc" opacity="0.55" />
          <circle cx="6" cy="-8" r="4.5" fill="#7e22ce" opacity="0.7" />
          <circle cx="-8" cy="8" r="6" fill="#7e22ce" opacity="0.7" />
          <path d="M-40 18 C-20 30, 20 20, 42 -6" stroke="#f3e8ff" strokeWidth="4.5" strokeLinecap="round" fill="none" transform="rotate(-25)" />
        </g>

        {/* ── Twinkling Golden & Pink Stars ── */}
        <g transform="translate(370, 60)" className="star-twinkle-1">
          <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#facc15" />
        </g>
        <g transform="translate(580, 130)" className="star-twinkle-2">
          <path d="M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z" fill="#ff3b69" />
        </g>
        <g transform="translate(240, 110)" className="star-twinkle-3">
          <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#f59e0b" />
        </g>

        {/* ── Soft Pastel Clouds ── */}
        <g opacity="0.9">
          <path
            d="M480 170 C480 150, 505 140, 525 150 C540 135, 575 135, 590 150 C610 145, 635 160, 630 180 C645 190, 640 215, 620 220 L480 220 C465 215, 460 185, 480 170 Z"
            fill="#ffffff"
            opacity="0.85"
          />
          <path
            d="M170 210 C170 190, 195 180, 210 190 C225 175, 255 175, 270 190 C290 185, 310 200, 305 220 L170 220 C155 210, 155 200, 170 210 Z"
            fill="#ffffff"
            opacity="0.65"
          />
        </g>

        {/* ── MAHARAJA INSTITUTE OF TECHNOLOGY MYSORE CAMPUS (Background) ── */}
        <g id="mitCampusBuilding" transform="translate(480, 175)" filter="url(#softShadow)">
          {/* Main Building Facade */}
          <rect x="40" y="85" width="150" height="95" rx="6" fill="url(#mitBuildingGrad)" stroke="#7c2d12" strokeWidth="4.5" />

          {/* Central Clock / Entrance Arch Tower */}
          <rect x="85" y="45" width="60" height="135" rx="4" fill="#ffedd5" stroke="#7c2d12" strokeWidth="4.5" />

          {/* Traditional Pyramid Temple Roof */}
          <polygon points="115,10 70,48 160,48" fill="#c2410c" stroke="#7c2d12" strokeWidth="4.5" strokeLinejoin="round" />

          {/* Front Entrance Arch Doorway */}
          <path d="M100 180 L100 138 C100 128, 130 128, 130 138 L130 180 Z" fill="#431407" stroke="#7c2d12" strokeWidth="4" />

          {/* Windows (Left Wing) */}
          <rect x="54" y="96" width="16" height="22" rx="3" fill="#ffffff" stroke="#7c2d12" strokeWidth="2" />
          <line x1="62" y1="96" x2="62" y2="118" stroke="#7c2d12" strokeWidth="1.5" />
          <rect x="54" y="126" width="16" height="22" rx="3" fill="#ffffff" stroke="#7c2d12" strokeWidth="2" />
          <line x1="62" y1="126" x2="62" y2="148" stroke="#7c2d12" strokeWidth="1.5" />

          {/* Windows (Right Wing) */}
          <rect x="158" y="96" width="16" height="22" rx="3" fill="#ffffff" stroke="#7c2d12" strokeWidth="2" />
          <line x1="166" y1="96" x2="166" y2="118" stroke="#7c2d12" strokeWidth="1.5" />
          <rect x="158" y="126" width="16" height="22" rx="3" fill="#ffffff" stroke="#7c2d12" strokeWidth="2" />
          <line x1="166" y1="126" x2="166" y2="148" stroke="#7c2d12" strokeWidth="1.5" />

          {/* Tower Windows */}
          <rect x="105" y="58" width="20" height="26" rx="4" fill="#ffffff" stroke="#7c2d12" strokeWidth="2" />

          {/* "MIT MYSORE" Signboard Plaque */}
          <rect x="72" y="78" width="86" height="19" rx="4" fill="#ffffff" stroke="#7c2d12" strokeWidth="2.5" />
          <text x="115" y="91.5" fill="#0f172a" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.08em">
            MIT MYSORE
          </text>

          {/* Flagpole on Roof */}
          <line x1="115" y1="14" x2="115" y2="-18" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <circle cx="115" cy="-19" r="3" fill="#facc15" />

          {/* Indian National Flag Waving */}
          <g transform="translate(115, -18)" className="flag-wave">
            <path d="M0 0 C10 -2, 20 2, 32 0 L32 7 C20 9, 10 5, 0 7 Z" fill="#ff9933" />
            <path d="M0 7 C10 5, 20 9, 32 7 L32 14 C20 16, 10 12, 0 14 Z" fill="#ffffff" />
            <circle cx="16" cy="10.5" r="2.5" fill="#000088" />
            <path d="M0 14 C10 12, 20 16, 32 14 L32 21 C20 23, 10 19, 0 21 Z" fill="#138808" />
          </g>
        </g>

        {/* ── THE MAJESTIC ROCKY CLIFF / MOUNTAIN PLATEAU ── */}
        <g id="rockyCliff" filter="url(#softShadow)">
          {/* Deep Cliff Base / Dark Under-facets */}
          <polygon
            points="130,550 690,550 710,430 670,350 530,325 460,315 370,320 270,325 190,345 110,430"
            fill="url(#cliffFacetDark)"
          />

          {/* Mid Facet Left */}
          <polygon
            points="110,430 190,345 270,325 305,420 230,500 130,550"
            fill="url(#cliffFacet1)"
            stroke="#382414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Mid Facet Center */}
          <polygon
            points="270,325 370,320 460,315 440,430 345,480 305,420"
            fill="url(#cliffFacet2)"
            stroke="#382414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Mid Facet Right */}
          <polygon
            points="460,315 530,325 670,350 660,450 545,490 440,430"
            fill="url(#cliffFacet1)"
            stroke="#382414"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Rock Highlights & Crevices */}
          <path d="M190 345 L305 420 L270 480" stroke="#25160c" strokeWidth="4" strokeLinecap="round" />
          <path d="M370 320 L440 430 L385 500" stroke="#25160c" strokeWidth="4" strokeLinecap="round" />
          <path d="M530 325 L590 420 L545 490" stroke="#25160c" strokeWidth="4" strokeLinecap="round" />
          <path d="M270 325 L230 375" stroke="#f5ede6" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
          <path d="M460 315 L480 375" stroke="#f5ede6" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />

          {/* Lush Green Plateau Grass Top Surface */}
          <path
            d="M160 345 C210 330, 260 322, 320 319 C380 316, 450 312, 515 320 C570 325, 620 336, 665 348 C650 364, 595 366, 530 362 C465 358, 405 356, 345 360 C285 364, 225 370, 160 345 Z"
            fill="#22c55e"
          />
          {/* Grass Tufts */}
          <path
            d="M185 340 L190 332 L195 340 M235 334 L240 325 L245 334 M310 325 L315 316 L320 325 M485 323 L490 315 L495 323 M570 332 L575 324 L580 332"
            stroke="#86efac"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ── RED AMONG US CREWMATE SITTING ON CLIFF - SPEED CODING & CRAZY ACTIONS! ── */}
        <g id="redCrewmateHero" transform="translate(290, 165)" style={{ cursor: 'pointer' }}>
          {/* Ground Contact Shadow */}
          <ellipse cx="65" cy="180" rx="55" ry="14" fill="#1c1917" opacity="0.5" />

          {/* Overclock Cyber Shield Aura (Flares when turbo mode is active!) */}
          <circle
            cx="85"
            cy="110"
            r="105"
            fill="url(#overclockAura)"
            opacity={turboMode ? 0.85 : 0}
            className={turboMode ? 'overclock-pulse' : ''}
            style={{ transition: 'opacity 0.3s ease' }}
          />

          {/* Oxygen Backpack Behind */}
          <rect x="-16" y="65" width="36" height="72" rx="17" fill="#991b1b" stroke="#0f172a" strokeWidth="5.5" />

          {/* Vibing Crewmate Body (Bobs with coding beat!) */}
          <g className={turboMode ? 'crewmate-vibing-fast' : 'crewmate-vibing-normal'}>
            {/* Main Body Sitting Curved Forward */}
            <path
              d="M12 60 C12 25, 52 15, 82 18 C112 22, 128 50, 126 95 C124 135, 116 165, 86 172 C56 176, 12 165, 12 125 Z"
              fill="url(#crewRedGrad)"
              stroke="#0f172a"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />

            {/* Visor Glare & Shape */}
            <path
              d="M62 48 C62 36, 98 32, 118 42 C130 48, 132 72, 118 80 C98 86, 62 82, 62 48 Z"
              fill="url(#crewVisorGrad)"
              stroke="#0f172a"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />
            {/* Glare Reflection */}
            <ellipse cx="88" cy="48" rx="16" ry="6" fill="#ffffff" opacity="0.9" transform="rotate(-12 88 48)" />
            {/* Holographic matrix reflection in visor! */}
            <line x1="72" y1="58" x2="108" y2="55" stroke="#38fedc" strokeWidth="2" opacity="0.8" className="visor-code-scan" />
            <line x1="78" y1="66" x2="104" y2="64" stroke="#22c55e" strokeWidth="1.8" opacity="0.8" className="visor-code-scan" />

            {/* Gaming Headphones with Earcups & Headband */}
            <ellipse cx="24" cy="62" rx="11" ry="17" fill="#1e293b" stroke="#0f172a" strokeWidth="4.5" />
            <ellipse cx="24" cy="62" rx="6.5" ry="11" fill="#ef4444" />
            <path d="M24 48 C28 12, 85 8, 102 36" stroke="#1e293b" strokeWidth="7.5" strokeLinecap="round" fill="none" />
            <path d="M24 48 C28 12, 85 8, 102 36" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <ellipse cx="102" cy="42" rx="6" ry="10" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
          </g>

          {/* Sitting Legs & Shoes on Rock */}
          {/* Left Foot */}
          <path
            d="M28 160 C28 148, 58 148, 74 162 C84 170, 74 186, 48 186 C28 186, 24 172, 28 160 Z"
            fill="#991b1b"
            stroke="#0f172a"
            strokeWidth="5"
          />
          <path d="M38 186 L68 186" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />

          {/* Right Foot */}
          <path
            d="M74 158 C74 146, 104 146, 120 160 C130 168, 120 184, 94 184 C74 184, 70 170, 74 158 Z"
            fill="#ef233c"
            stroke="#0f172a"
            strokeWidth="5"
          />
          <path d="M84 184 L114 184" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />

          {/* ── OPEN HACKER LAPTOP WITH NEON SCREEN & AMBIENT GLOW ── */}
          {/* Laptop Base & Keyboard */}
          <polygon points="80,140 148,135 160,154 90,160" fill="#1e293b" stroke="#0f172a" strokeWidth="4.5" />
          <polygon points="88,141 144,137 154,151 96,155" fill="#334155" />

          {/* Backlit Glowing Keyboard Keys */}
          <line x1="94" y1="145" x2="148" y2="142" stroke="#38fedc" strokeWidth="2.5" opacity="0.8" className="key-light-pulse" />
          <line x1="98" y1="150" x2="152" y2="147" stroke="#ff3b69" strokeWidth="2.5" opacity="0.8" className="key-light-pulse" />

          {/* Laptop Screen Lid */}
          <polygon points="120,80 168,75 158,138 112,141" fill="#0f172a" stroke="#0f172a" strokeWidth="4.5" />

          {/* Glowing Cyber Screen Display */}
          <polygon
            points="122,82 165,77 156,136 114,139"
            fill="#031525"
            stroke="#00f5d4"
            strokeWidth="1.5"
            className="screen-ambient-glow"
          />

          {/* Animated Matrix Code Lines on Laptop Display */}
          <g className="screen-scrolling-code">
            <line x1="120" y1="88" x2="158" y2="85" stroke="#00f5d4" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="118" y1="96" x2="154" y2="93" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <line x1="116" y1="104" x2="148" y2="101" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="115" y1="112" x2="160" y2="109" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
            <line x1="114" y1="120" x2="146" y2="117" stroke="#ff3b69" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="113" y1="128" x2="152" y2="125" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            {/* Blinking Prompt Cursor */}
            <rect x="148" y="123" width="4" height="6" fill="#00f5d4" className="cursor-blink" />
          </g>

          {/* Golden Crown Sticker on Laptop Back */}
          <g transform="translate(132, 98) scale(0.95)">
            <path
              d="M0 12 L3 0 L9 7 L15 0 L18 12 Z"
              fill="#facc15"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="3" cy="-1" r="1.5" fill="#facc15" />
            <circle cx="9" cy="6" r="1.5" fill="#facc15" />
            <circle cx="15" cy="-1" r="1.5" fill="#facc15" />
          </g>

          {/* ── FURIOUS TYPING HANDS (ANIMATED CODING SPEED!) ── */}
          {/* Left Hand: Moving rapidly up and down */}
          <ellipse
            cx="96"
            cy="124"
            rx="11.5"
            ry="8"
            fill="#ef233c"
            stroke="#0f172a"
            strokeWidth="4"
            className={turboMode ? 'furious-hand-left-turbo' : 'furious-hand-left'}
          />

          {/* Right Hand: Counter-typing rhythm */}
          <ellipse
            cx="106"
            cy="119"
            rx="11.5"
            ry="8"
            fill="#c9184a"
            stroke="#0f172a"
            strokeWidth="4"
            className={turboMode ? 'furious-hand-right-turbo' : 'furious-hand-right'}
          />

          {/* Keyboard Sparks when typing / Turbo mode */}
          <g className={turboMode ? 'active-sparks' : 'gentle-sparks'}>
            <circle cx="102" cy="140" r="2.5" fill="#facc15" className="spark-pop-1" />
            <circle cx="114" cy="138" r="3" fill="#00f5d4" className="spark-pop-2" />
            <circle cx="126" cy="142" r="2.5" fill="#ff3b69" className="spark-pop-3" />
          </g>

          {/* ── HOLOGRAPHIC CODE FLOATING UP FROM THE LAPTOP ── */}
          {/* Token 1: </> in Cyan */}
          <g className="code-float-1" transform="translate(120, 60)">
            <rect x="-4" y="-12" width="34" height="18" rx="6" fill="#0f172a" opacity="0.85" />
            <text x="13" y="1" fill="#00f5d4" fontSize="12" fontWeight="900" fontFamily="monospace" textAnchor="middle">
              &lt;/&gt;
            </text>
          </g>

          {/* Token 2: { hack } in Yellow */}
          <g className="code-float-2" transform="translate(138, 40)">
            <rect x="-6" y="-12" width="54" height="18" rx="6" fill="#0f172a" opacity="0.85" />
            <text x="21" y="1" fill="#facc15" fontSize="11" fontWeight="900" fontFamily="monospace" textAnchor="middle">
              &#123; hack &#125;
            </text>
          </g>

          {/* Token 3: 0101 in Neon Green */}
          <g className="code-float-3" transform="translate(110, 30)">
            <text x="0" y="0" fill="#22c55e" fontSize="11" fontWeight="900" fontFamily="monospace" filter="url(#hologramGlow)">
              01011
            </text>
          </g>

          {/* Token 4: npm win in Hot Pink */}
          <g className="code-float-4" transform="translate(142, 16)">
            <rect x="-4" y="-11" width="60" height="16" rx="5" fill="#ff3b69" />
            <text x="26" y="1" fill="#ffffff" fontSize="9.5" fontWeight="900" fontFamily="monospace" textAnchor="middle">
              npm win!
            </text>
          </g>

          {/* Token 5: Sparkle rocket and lightning */}
          <g className="code-float-5" transform="translate(162, 50)">
            <text x="0" y="0" fontSize="14">
              ⚡
            </text>
          </g>
        </g>

        {/* ── HOVERING MINI ROBOT COMPANION (O_O) WITH ACTIVE CODE SCAN LASER ── */}
        <g id="yellowRobotCompanion" transform="translate(485, 175)" className="robot-hover-bob">
          {/* Floating Shadow Below */}
          <ellipse cx="26" cy="115" rx="22" ry="7" fill="#1c1917" opacity="0.3" className="shadow-pulse" />

          {/* HOLOGRAPHIC CODE SCANNING LASER CONE (Aims at the Laptop!) */}
          <polygon
            points="18,65 -85,128 -30,132 38,65"
            fill="url(#droneLaserBeam)"
            className="drone-laser-sweep"
          />

          {/* Thruster Flames Flickering Under Robot */}
          <polygon points="12,74 20,74 16,88" fill="#f97316" className="thruster-flicker-1" />
          <polygon points="34,74 42,74 38,88" fill="#f97316" className="thruster-flicker-2" />
          <polygon points="14,74 18,74 16,83" fill="#facc15" />
          <polygon points="36,74 40,74 38,83" fill="#facc15" />

          {/* Yellow Robot Body with Glow */}
          <rect x="0" y="20" width="54" height="54" rx="18" fill="#facc15" stroke="#0f172a" strokeWidth="5" />
          <rect x="4" y="24" width="46" height="46" rx="14" fill="#fde047" />

          {/* Dark Screen Visor */}
          <rect x="8" y="32" width="38" height="28" rx="10" fill="#0f172a" />

          {/* Glowing Cyan LED Eyes: O_O (Animated Blinking!) */}
          <rect x="13" y="39" width="9" height="13" rx="4.5" fill="#38fedc" className="robot-eyes-blink" />
          <circle cx="17.5" cy="42" r="1.6" fill="#ffffff" />

          <rect x="32" y="39" width="9" height="13" rx="4.5" fill="#38fedc" className="robot-eyes-blink" />
          <circle cx="36.5" cy="42" r="1.6" fill="#ffffff" />

          {/* Top Antenna */}
          <line x1="27" y1="20" x2="27" y2="7" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="27" cy="5" r="5" fill="#ef4444" stroke="#0f172a" strokeWidth="3" className="antenna-glow" />

          {/* Side Thruster Ears */}
          <rect x="-6" y="38" width="8" height="16" rx="4" fill="#eab308" stroke="#0f172a" strokeWidth="3.5" />
          <rect x="52" y="38" width="8" height="16" rx="4" fill="#eab308" stroke="#0f172a" strokeWidth="3.5" />
        </g>

        {/* ── HANDWRITTEN ANNOTATION: "SAME CREW. BIGGER IDEAS." WITH ARROW ── */}
        <g id="handwrittenAnnotation" transform="translate(545, 45)" className="hero-annotation-group">
          <text
            x="0"
            y="20"
            fontFamily="'Patrick Hand', cursive, sans-serif"
            fontSize="28"
            fontWeight="bold"
            fill="#0f172a"
            letterSpacing="0.04em"
            transform="rotate(6)"
          >
            SAME CREW.
          </text>
          <text
            x="8"
            y="50"
            fontFamily="'Patrick Hand', cursive, sans-serif"
            fontSize="28"
            fontWeight="bold"
            fill="#0f172a"
            letterSpacing="0.04em"
            transform="rotate(6)"
          >
            BIGGER IDEAS.
          </text>

          {/* Hand-drawn Curving Arrow pointing down at Speed-Coding Crewmate */}
          <path
            d="M30 68 C42 100, 20 120, -15 130"
            stroke="#0f172a"
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M-5 115 L-18 131 L-2 140"
            stroke="#0f172a"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>

      {/* ── ULTRA-DYNAMIC CODING KEYFRAMES & CYBER ANIMATIONS ── */}
      <style>{`
        /* Furious Alternating Typing Hands */
        @keyframes furiousTypingL {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(8deg); }
        }
        @keyframes furiousTypingR {
          0%, 100% { transform: translateY(-4px) rotate(-6deg); }
          50% { transform: translateY(1px) rotate(2deg); }
        }
        .furious-hand-left {
          animation: furiousTypingL 0.16s infinite ease-in-out;
          transform-origin: 96px 124px;
        }
        .furious-hand-right {
          animation: furiousTypingR 0.14s infinite ease-in-out;
          transform-origin: 106px 119px;
        }
        .furious-hand-left-turbo {
          animation: furiousTypingL 0.07s infinite ease-in-out;
          transform-origin: 96px 124px;
        }
        .furious-hand-right-turbo {
          animation: furiousTypingR 0.06s infinite ease-in-out;
          transform-origin: 106px 119px;
        }

        /* Crewmate Vibing to Coding Beats */
        @keyframes crewBop {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1.5deg); }
        }
        @keyframes crewBopFast {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(2.5deg); }
        }
        .crewmate-vibing-normal {
          animation: crewBop 1.6s infinite ease-in-out;
          transform-origin: 65px 140px;
        }
        .crewmate-vibing-fast {
          animation: crewBopFast 0.4s infinite ease-in-out;
          transform-origin: 65px 140px;
        }

        /* Screen Glow & Code Scanning */
        @keyframes ambientScreenPulse {
          0%, 100% { fill: #031525; stroke: #00f5d4; }
          50% { fill: #04253a; stroke: #22c55e; filter: drop-shadow(0 0 10px rgba(0,245,212,0.8)); }
        }
        .screen-ambient-glow {
          animation: ambientScreenPulse 2s infinite ease-in-out;
        }

        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .cursor-blink {
          animation: cursorBlink 0.6s infinite;
        }

        /* Floating Holographic Code Tokens */
        @keyframes floatCodeUp1 {
          0% { transform: translate(120px, 60px) scale(0.85); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.9; }
          100% { transform: translate(126px, 10px) scale(1.05); opacity: 0; }
        }
        @keyframes floatCodeUp2 {
          0% { transform: translate(138px, 50px) scale(0.85); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 0.9; }
          100% { transform: translate(146px, -5px) scale(1.08); opacity: 0; }
        }
        @keyframes floatCodeUp3 {
          0% { transform: translate(105px, 45px) scale(0.8); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 0.85; }
          100% { transform: translate(96px, 0px) scale(1.02); opacity: 0; }
        }
        @keyframes floatCodeUp4 {
          0% { transform: translate(140px, 35px) scale(0.8); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.9; }
          100% { transform: translate(152px, -20px) scale(1.1); opacity: 0; }
        }
        @keyframes floatCodeUp5 {
          0% { transform: translate(158px, 55px) rotate(0deg); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(170px, 15px) rotate(25deg); opacity: 0; }
        }
        .code-float-1 { animation: floatCodeUp1 2.4s infinite ease-out; }
        .code-float-2 { animation: floatCodeUp2 2.8s infinite ease-out 0.6s; }
        .code-float-3 { animation: floatCodeUp3 2.6s infinite ease-out 1.1s; }
        .code-float-4 { animation: floatCodeUp4 3.0s infinite ease-out 1.6s; }
        .code-float-5 { animation: floatCodeUp5 2.2s infinite ease-out 0.8s; }

        /* Drone Laser Scanner Sweep */
        @keyframes laserSweep {
          0%, 100% { opacity: 0.35; transform: rotate(-3deg); }
          50% { opacity: 0.75; transform: rotate(4deg); }
        }
        .drone-laser-sweep {
          animation: laserSweep 2.2s infinite ease-in-out;
          transform-origin: 25px 65px;
        }

        /* Drone Hovering Bob */
        @keyframes droneBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .robot-hover-bob {
          animation: droneBob 2.5s infinite ease-in-out;
        }

        /* Thruster Flickering */
        @keyframes thrusterFire {
          0%, 100% { transform: scaleY(1); opacity: 0.8; }
          50% { transform: scaleY(1.4); opacity: 1; }
        }
        .thruster-flicker-1 {
          animation: thrusterFire 0.12s infinite;
          transform-origin: 16px 74px;
        }
        .thruster-flicker-2 {
          animation: thrusterFire 0.14s infinite;
          transform-origin: 38px 74px;
        }

        /* Robot Eyes Blink */
        @keyframes eyesBlink {
          0%, 94%, 98%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
        .robot-eyes-blink {
          animation: eyesBlink 3.8s infinite;
          transform-origin: center;
        }

        /* Star Twinkles */
        @keyframes twinkle {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        .star-twinkle-1 { animation: twinkle 2s infinite ease-in-out; transform-origin: center; }
        .star-twinkle-2 { animation: twinkle 2.6s infinite ease-in-out 0.8s; transform-origin: center; }
        .star-twinkle-3 { animation: twinkle 2.2s infinite ease-in-out 1.4s; transform-origin: center; }

        /* Flag Wave */
        @keyframes flagWaving {
          0%, 100% { transform: skewY(0deg); }
          50% { transform: skewY(3deg); }
        }
        .flag-wave {
          animation: flagWaving 2s infinite ease-in-out;
          transform-origin: 0 0;
        }

        /* Overclock Pulse */
        @keyframes overclockPulseAnim {
          0%, 100% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.95; }
        }
        .overclock-pulse {
          animation: overclockPulseAnim 0.5s infinite ease-in-out;
          transform-origin: 85px 110px;
        }

        @media (max-width: 640px) {
          .hero-annotation-group {
            display: none !important;
          }
          .hero-speech-bubble-card {
            padding: 5px 12px !important;
            border-radius: 14px !important;
            border-width: 2px !important;
          }
          .hero-speech-bubble-loc {
            font-size: 8px !important;
          }
          .hero-speech-bubble-quote {
            font-size: 10.5px !important;
          }
          .hero-speech-bubble-tap {
            font-size: 7.5px !important;
          }
        }
      `}</style>
    </div>
  );
}
