import React from 'react';
import { motion } from 'framer-motion';

export default function ChalkboardSignpost() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
      animate={{ opacity: 1, rotate: -3, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 180 }}
      whileHover={{ rotate: 0, scale: 1.04 }}
      style={{
        display: 'inline-block',
        position: 'relative',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <svg
        width="130"
        height="180"
        viewBox="0 0 130 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Wooden Legs / Posts */}
        {/* Left Post */}
        <polygon points="34,80 44,80 40,175 30,175" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        {/* Right Post */}
        <polygon points="86,80 96,80 98,175 88,175" fill="#78350f" stroke="#451a03" strokeWidth="2" />

        {/* Grass Mound at Base of Posts */}
        <ellipse cx="64" cy="172" rx="42" ry="8" fill="#22c55e" />
        <path d="M40 170 L43 162 L46 170 M60 170 L64 160 L68 170 M85 170 L88 163 L91 170" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />

        {/* Chalkboard Outer Wooden Frame */}
        <rect
          x="10"
          y="10"
          width="110"
          height="120"
          rx="8"
          fill="#92400e"
          stroke="#451a03"
          strokeWidth="3.5"
          filter="drop-shadow(0 6px 12px rgba(0,0,0,0.15))"
        />

        {/* Inner Dark Slate Blackboard */}
        <rect
          x="18"
          y="18"
          width="94"
          height="104"
          rx="5"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* Corner Bolts */}
        <circle cx="15" cy="15" r="2.5" fill="#fde047" stroke="#451a03" strokeWidth="1" />
        <circle cx="115" cy="15" r="2.5" fill="#fde047" stroke="#451a03" strokeWidth="1" />
        <circle cx="15" cy="125" r="2.5" fill="#fde047" stroke="#451a03" strokeWidth="1" />
        <circle cx="115" cy="125" r="2.5" fill="#fde047" stroke="#451a03" strokeWidth="1" />

        {/* Handwritten Chalk Text */}
        <g fill="#ffffff" fontFamily="'Fredoka', sans-serif" fontWeight="900" textAnchor="middle">
          <text x="65" y="38" fontSize="13" letterSpacing="0.08em">IDEA</text>
          <text x="65" y="56" fontSize="13" letterSpacing="0.08em">BUILD</text>
          <text x="65" y="74" fontSize="11" letterSpacing="0.05em">COLLABORATE</text>
          <text x="65" y="92" fontSize="11" letterSpacing="0.05em">INNOVATE</text>
          <text x="65" y="112" fontSize="15" fill="#fde047" letterSpacing="0.06em">WIN!</text>
        </g>

        {/* Chalk Underline / Scribble under WIN! */}
        <path d="M42 116 C55 119, 75 115, 88 117" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </motion.div>
  );
}
