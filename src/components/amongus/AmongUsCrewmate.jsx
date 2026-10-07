import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playCrewmatePopSound } from './AmongUsSound';

// Color map for authentic Among Us crewmates with shadow colors
export const CREWMATE_COLORS = {
  red:     { base: '#C51111', shadow: '#7A0838', name: 'Red', role: 'Impostor?' },
  cyan:    { base: '#38FEDC', shadow: '#24A8BE', name: 'Cyan', role: 'MedBay' },
  lime:    { base: '#50EF39', shadow: '#1E9E22', name: 'Lime', role: 'Hydroponics' },
  blue:    { base: '#132ED1', shadow: '#09158E', name: 'Blue', role: 'Navigation' },
  yellow:  { base: '#F6F657', shadow: '#C38823', name: 'Yellow', role: 'Reactor' },
  purple:  { base: '#6B2FBC', shadow: '#3B177C', name: 'Purple', role: 'Comms' },
  orange:  { base: '#F07D0D', shadow: '#B33E15', name: 'Orange', role: 'O2' },
  pink:    { base: '#ED54BA', shadow: '#AB2C94', name: 'Pink', role: 'Admin' },
  black:   { base: '#3F474E', shadow: '#1E1F26', name: 'Black', role: 'Security' },
  white:   { base: '#D7E1F1', shadow: '#8397B7', name: 'White', role: 'Shields' },
};

/**
 * Authentic SVG Vector Among Us Crewmate
 */
export default function AmongUsCrewmate({
  color = 'red',
  size = 120,
  hat = 'none', // 'sprout' (Agri), 'cap' (Smart City), 'med' (Healthcare), 'knife', 'egg', 'none'
  facing = 'right', // 'left' or 'right'
  floating = false,
  interactive = true,
  speechText = '',
  className = '',
  style = {},
  onClick,
}) {
  const [clicked, setClicked] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);
  const palette = CREWMATE_COLORS[color] || CREWMATE_COLORS.red;

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    setShowSpeech(true);
    playCrewmatePopSound();
    if (onClick) onClick(e);
    setTimeout(() => setClicked(false), 300);
    setTimeout(() => setShowSpeech(false), 2400);
  };

  const isFlip = facing === 'left';

  return (
    <div
      className={`amongus-crewmate-wrap ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size * 1.25,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
      onClick={interactive ? handleClick : undefined}
      onMouseEnter={() => interactive && setShowSpeech(true)}
      onMouseLeave={() => interactive && !clicked && setShowSpeech(false)}
    >
      {/* Speech Bubble */}
      {speechText && showSpeech && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '105%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffff',
            border: '2.5px solid #111',
            borderRadius: '12px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 900,
            color: '#111',
            whiteSpace: 'nowrap',
            zIndex: 100,
            boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
            letterSpacing: '0.02em',
            pointerEvents: 'none',
          }}
        >
          {speechText}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #111',
            }}
          />
        </motion.div>
      )}

      {/* Crewmate SVG with Squash-and-Stretch Animation */}
      <motion.svg
        viewBox="0 0 100 125"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          transform: `${isFlip ? 'scaleX(-1)' : 'scaleX(1)'}`,
        }}
        animate={
          clicked
            ? { scaleY: 0.82, scaleX: 1.15 }
            : floating
            ? { y: [0, -6, 0], rotate: [0, 2, -2, 0] }
            : { scaleY: 1, scaleX: 1 }
        }
        transition={
          floating
            ? { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 450, damping: 15 }
        }
      >
        <defs>
          <clipPath id={`body-clip-${color}-${hat}`}>
            <path d="M 32 18 C 32 8, 72 8, 72 18 L 72 90 C 72 102, 60 102, 60 92 L 60 84 L 44 84 L 44 92 C 44 102, 32 102, 32 90 Z" />
          </clipPath>
        </defs>

        {/* 1. BACKPACK (OXYGEN TANK) */}
        <g id="backpack">
          {/* Backpack Shadow */}
          <rect
            x="12"
            y="38"
            width="22"
            height="46"
            rx="10"
            fill={palette.shadow}
            stroke="#111111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Backpack Base Highlight */}
          <rect
            x="12"
            y="38"
            width="22"
            height="32"
            rx="10"
            fill={palette.base}
            stroke="#111111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </g>

        {/* 2. MAIN BODY */}
        <g id="body">
          {/* Full body outline & shadow base */}
          <path
            d="M 32 24 C 32 6, 74 6, 74 24 L 74 94 C 74 108, 58 108, 58 96 L 58 86 L 46 86 L 46 96 C 46 108, 30 108, 30 94 Z"
            fill={palette.shadow}
            stroke="#111111"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* Top illuminated body curve */}
          <path
            d="M 32 24 C 32 6, 74 6, 74 24 L 74 68 C 66 64, 42 66, 32 74 Z"
            fill={palette.base}
          />
        </g>

        {/* 3. VISOR */}
        <g id="visor">
          {/* Visor Outer Border */}
          <rect
            x="50"
            y="26"
            width="34"
            height="24"
            rx="12"
            fill="#1c3040"
            stroke="#111111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Visor Glass Base */}
          <rect
            x="53"
            y="28"
            width="28"
            height="19"
            rx="9.5"
            fill="#71e1ff"
          />
          {/* Visor Shadow lower crescent */}
          <path
            d="M 53 38 C 60 44, 74 44, 81 38 L 81 38 C 81 44, 73 47, 67 47 C 60 47, 53 44, 53 38 Z"
            fill="#3290b2"
          />
          {/* Visor Specular Reflection (White Pill) */}
          <ellipse
            cx="63"
            cy="33"
            rx="8"
            ry="3.5"
            transform="rotate(-15 63 33)"
            fill="#ffffff"
            opacity="0.95"
          />
        </g>

        {/* 4. HATS & ACCESSORIES */}
        {hat === 'sprout' && (
          // Agriculture Track: Plant Sprout Hat
          <g id="hat-sprout" transform="translate(48, -2)">
            <path
              d="M 4 12 C 4 2, 2 2, 2 0 C 8 2, 14 0, 16 6 C 14 10, 8 10, 4 12 Z"
              fill="#22c55e"
              stroke="#111"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 4 12 C 4 2, 0 2, -4 6 C -6 10, 0 10, 4 12 Z"
              fill="#16a34a"
              stroke="#111"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M 4 12 L 4 16" stroke="#111" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {hat === 'cap' && (
          // Smart City Track: Commander / Pilot Police Cap
          <g id="hat-cap" transform="translate(38, -4)">
            <path
              d="M -2 14 Q 18 6 38 14 L 38 18 Q 18 12 -2 18 Z"
              fill="#111"
              stroke="#111"
              strokeWidth="2"
            />
            <path
              d="M 2 12 Q 18 2 34 12 L 32 4 Q 18 0 4 4 Z"
              fill="#1e3a8a"
              stroke="#111"
              strokeWidth="3"
            />
            <circle cx="18" cy="8" r="3" fill="#facc15" stroke="#111" strokeWidth="1.5" />
          </g>
        )}

        {hat === 'med' && (
          // Healthcare Track: Doctor Head Mirror / Medical Cross
          <g id="hat-med" transform="translate(42, -4)">
            <circle cx="14" cy="10" r="8" fill="#ffffff" stroke="#111" strokeWidth="3" />
            <path d="M 14 6 L 14 14 M 10 10 L 18 10" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="0" y="14" width="28" height="3" fill="#cbd5e1" stroke="#111" strokeWidth="1" />
          </g>
        )}

        {hat === 'knife' && (
          // Impostor Knife on head
          <g id="hat-knife" transform="translate(48, -10)">
            <path d="M 6 0 L 12 12 L 4 12 Z" fill="#e2e8f0" stroke="#111" strokeWidth="2.5" />
            <rect x="5" y="12" width="4" height="8" fill="#78350f" stroke="#111" strokeWidth="2" />
          </g>
        )}

        {hat === 'mini' && (
          // Mini Crewmate sitting on head
          <g id="hat-mini" transform="translate(44, -14) scale(0.35)">
            <rect x="12" y="38" width="20" height="36" rx="8" fill={palette.base} stroke="#111" strokeWidth="8" />
            <path d="M 32 24 C 32 6, 74 6, 74 24 L 74 84 C 74 96, 32 96, 32 84 Z" fill={palette.base} stroke="#111" strokeWidth="8" />
            <rect x="52" y="26" width="30" height="20" rx="10" fill="#71e1ff" stroke="#111" strokeWidth="7" />
          </g>
        )}
      </motion.svg>
    </div>
  );
}
