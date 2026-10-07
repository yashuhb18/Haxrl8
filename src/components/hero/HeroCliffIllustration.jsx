import React from 'react';
import { motion } from 'framer-motion';

export default function HeroCliffIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '740px', margin: '0 auto', userSelect: 'none' }}>
      <svg
        viewBox="0 0 740 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Ambient Warm Sky Glow */}
          <radialGradient id="skyGlow" cx="60%" cy="38%" r="55%" fx="60%" fy="38%">
            <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#ffedd5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fffaf3" stopOpacity="0" />
          </radialGradient>

          {/* Gradients for Rock Facets */}
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

          <linearGradient id="mitBuildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="45%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ── Background Radial Warm Sky Glow ── */}
        <circle cx="440" cy="240" r="290" fill="url(#skyGlow)" />

        {/* ── Distant Ringed Planet (Top Right) ── */}
        <g transform="translate(650, 80)">
          <ellipse cx="0" cy="0" rx="46" ry="14" stroke="#c084fc" strokeWidth="4.5" fill="none" opacity="0.6" transform="rotate(-25)" />
          <circle cx="0" cy="0" r="26" fill="#a855f7" />
          <circle cx="-6" cy="-6" r="20" fill="#c084fc" opacity="0.55" />
          <circle cx="6" cy="-8" r="4.5" fill="#7e22ce" opacity="0.7" />
          <circle cx="-8" cy="8" r="6" fill="#7e22ce" opacity="0.7" />
          <path d="M-40 18 C-20 30, 20 20, 42 -6" stroke="#f3e8ff" strokeWidth="4.5" strokeLinecap="round" fill="none" transform="rotate(-25)" />
        </g>

        {/* ── Twinkling Golden & Pink Stars ── */}
        <g transform="translate(370, 60)">
          <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#facc15" />
        </g>
        <g transform="translate(580, 130)">
          <path d="M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z" fill="#ff3b69" />
        </g>
        <g transform="translate(240, 110)">
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

        {/* ── MIT MYSORE CAMPUS BUILDING (Background Top-Right Ridge) ── */}
        <g id="mitCampusBuilding" transform="translate(485, 145)" filter="url(#softShadow)">
          {/* Mountain Ridge Base */}
          <polygon points="30,170 195,170 215,135 185,75 80,65 5,120" fill="#6c533e" opacity="0.65" />

          {/* Building Wings */}
          <rect x="45" y="80" width="140" height="75" rx="5" fill="url(#mitBuildingGrad)" stroke="#7c2d12" strokeWidth="3.2" />

          {/* Central Portal Tower */}
          <rect x="85" y="42" width="60" height="113" rx="5" fill="#fde68a" stroke="#7c2d12" strokeWidth="3.2" />
          <polygon points="80,42 115,14 150,42" fill="#ea580c" stroke="#7c2d12" strokeWidth="3.2" />

          {/* Arched Entrance Doorway */}
          <path d="M100 155 L100 115 C100 102, 130 102, 130 115 L130 155 Z" fill="#451a03" />

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
          <g transform="translate(115, -18)">
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

        {/* ── RED AMONG US CREWMATE SITTING ON THE CLIFF WITH LAPTOP ── */}
        <g id="redCrewmateHero" transform="translate(290, 165)">
          {/* Ground Contact Shadow */}
          <ellipse cx="65" cy="180" rx="55" ry="14" fill="#1c1917" opacity="0.5" />

          {/* Oxygen Backpack Behind */}
          <rect x="-16" y="65" width="36" height="72" rx="17" fill="#991b1b" stroke="#0f172a" strokeWidth="5.5" />

          {/* Main Body Sitting Curved Forward */}
          <path
            d="M12 60 C12 25, 52 15, 82 18 C112 22, 128 50, 126 95 C124 135, 116 165, 86 172 C56 176, 12 165, 12 125 Z"
            fill="url(#crewRedGrad)"
            stroke="#0f172a"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />

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

          {/* Visor Glare & Shape */}
          <path
            d="M62 48 C62 36, 98 32, 118 42 C130 48, 132 72, 118 80 C98 86, 62 82, 62 48 Z"
            fill="url(#crewVisorGrad)"
            stroke="#0f172a"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />
          <ellipse cx="88" cy="48" rx="16" ry="6" fill="#ffffff" opacity="0.9" transform="rotate(-12 88 48)" />

          {/* Gaming Headphones with Earcups & Headband */}
          <ellipse cx="24" cy="62" rx="11" ry="17" fill="#1e293b" stroke="#0f172a" strokeWidth="4.5" />
          <ellipse cx="24" cy="62" rx="6.5" ry="11" fill="#ef4444" />
          <path d="M24 48 C28 12, 85 8, 102 36" stroke="#1e293b" strokeWidth="7.5" strokeLinecap="round" fill="none" />
          <path d="M24 48 C28 12, 85 8, 102 36" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <ellipse cx="102" cy="42" rx="6" ry="10" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />

          {/* Crewmate Hand Typing on Laptop */}
          <ellipse cx="98" cy="120" rx="12" ry="8.5" fill="#ef233c" stroke="#0f172a" strokeWidth="4.5" transform="rotate(15 98 120)" />

          {/* OPEN LAPTOP Sitting on Rock Plateau */}
          <polygon points="80,140 148,135 160,154 90,160" fill="#1e293b" stroke="#0f172a" strokeWidth="4.5" />
          <polygon points="88,141 144,137 154,151 96,155" fill="#334155" />
          <polygon points="120,80 168,75 158,138 112,141" fill="#1e293b" stroke="#0f172a" strokeWidth="4.5" />
          <polygon points="122,82 165,77 156,136 114,139" fill="#38bdf8" opacity="0.3" />

          {/* GOLDEN CROWN EMBLEM STICKER on Laptop Back Lid! */}
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
        </g>

        {/* ── HOVERING YELLOW MINI ROBOT COMPANION (O_O) ── */}
        <g id="yellowRobotCompanion" transform="translate(490, 175)">
          {/* Floating Shadow Below */}
          <ellipse cx="26" cy="110" rx="20" ry="6" fill="#1c1917" opacity="0.3" />

          {/* Yellow Robot Body with Glow */}
          <rect x="0" y="20" width="54" height="54" rx="18" fill="#facc15" stroke="#0f172a" strokeWidth="5" />
          <rect x="4" y="24" width="46" height="46" rx="14" fill="#fde047" />

          {/* Dark Screen Visor */}
          <rect x="8" y="32" width="38" height="28" rx="10" fill="#0f172a" />

          {/* Glowing Cyan LED Eyes: O_O */}
          <rect x="13" y="39" width="9" height="13" rx="4.5" fill="#38fedc" />
          <circle cx="17.5" cy="42" r="1.6" fill="#ffffff" />

          <rect x="32" y="39" width="9" height="13" rx="4.5" fill="#38fedc" />
          <circle cx="36.5" cy="42" r="1.6" fill="#ffffff" />

          {/* Top Antenna */}
          <line x1="27" y1="20" x2="27" y2="7" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="27" cy="5" r="5" fill="#ef4444" stroke="#0f172a" strokeWidth="3" />

          {/* Side Thruster Ears */}
          <rect x="-6" y="38" width="8" height="16" rx="4" fill="#eab308" stroke="#0f172a" strokeWidth="3.5" />
          <rect x="52" y="38" width="8" height="16" rx="4" fill="#eab308" stroke="#0f172a" strokeWidth="3.5" />
        </g>

        {/* ── HANDWRITTEN ANNOTATION: "SAME CREW. BIGGER IDEAS." WITH ARROW ── */}
        <g id="handwrittenAnnotation" transform="translate(545, 45)">
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

          {/* Hand-drawn Curving Arrow pointing down at Crewmate & Robot */}
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
    </div>
  );
}
