import React from 'react';

// Domain Brand Colors:
// Agriculture: Greens (#16A34A, #22C55E)
// Smart City: Blues (#0284C7, #06B6D4)
// Healthcare: Crimson & Rose (#E11D48, #F43F5E)
export const DOMAIN_COLORS = [
  '#16A34A', // Agriculture - Deep Emerald
  '#22C55E', // Agriculture - Vibrant Sprout
  '#0284C7', // Smart City - Electric Blue
  '#06B6D4', // Smart City - Tech Cyan
  '#E11D48', // Healthcare - Crimson Red
  '#F43F5E', // Healthcare - Coral Rose
];

export const DOMAIN_THEMES = {
  agriculture: {
    primary: '#16A34A',
    secondary: '#22C55E',
    light: '#ECFDF5',
    border: '#A7F3D0',
    name: 'Agriculture',
    subtitle: 'Smart Farming & Agritech',
  },
  smartCity: {
    primary: '#0284C7',
    secondary: '#06B6D4',
    light: '#F0F9FF',
    border: '#BAE6FD',
    name: 'Smart City',
    subtitle: 'Urban Tech & Connected Infra',
  },
  healthcare: {
    primary: '#E11D48',
    secondary: '#F43F5E',
    light: '#FFF1F2',
    border: '#FECDD3',
    name: 'Healthcare',
    subtitle: 'MedTech & AI Diagnostics',
  },
};

/**
 * DomainWheel — Custom circular segmented wheel for HAXLR8 3.0
 * Represents the 3 Innovation Domains: Agriculture, Smart City, Healthcare.
 */
export default function DomainWheel({ 
  size = 40, 
  blur = 0, 
  innerRatio = 0.44, 
  showCenterIcon = false,
  centerIconType = 'bolt', // 'bolt' | 'dot' | 'none'
  style = {},
  className = ''
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const ri = r * innerRatio;
  const n = DOMAIN_COLORS.length;
  const gap = 0.05; // Gap between segments in radians

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: blur ? `blur(${blur}px)` : 'none',
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Drop shadow filter for crisp depth */}
        <defs>
          <filter id={`dw-glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter={`url(#dw-glow-${size})`}>
          {DOMAIN_COLORS.map((color, i) => {
            const startAngle = (2 * Math.PI / n) * i - Math.PI / 2 + gap / 2;
            const endAngle   = (2 * Math.PI / n) * (i + 1) - Math.PI / 2 - gap / 2;
            const x1 = cx + r  * Math.cos(startAngle);
            const y1 = cy + r  * Math.sin(startAngle);
            const x2 = cx + r  * Math.cos(endAngle);
            const y2 = cy + r  * Math.sin(endAngle);
            const x3 = cx + ri * Math.cos(endAngle);
            const y3 = cy + ri * Math.sin(endAngle);
            const x4 = cx + ri * Math.cos(startAngle);
            const y4 = cy + ri * Math.sin(startAngle);

            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 0 0 ${x4} ${y4} Z`}
                fill={color}
              />
            );
          })}
        </g>

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={ri * 0.9} fill="#ffffff" />
        <circle cx={cx} cy={cy} r={ri * 0.75} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={size > 60 ? 1 : 0.5} />

        {/* Optional center icon for larger displays */}
        {showCenterIcon && size >= 48 && (
          centerIconType === 'bolt' ? (
            <path
              d={`M ${cx - size * 0.04} ${cy - size * 0.16} L ${cx + size * 0.08} ${cy - size * 0.02} L ${cx} ${cy} L ${cx + size * 0.05} ${cy + size * 0.16} L ${cx - size * 0.08} ${cy + size * 0.02} L ${cx} ${cy} Z`}
              fill="#0562F8"
            />
          ) : (
            <circle cx={cx} cy={cy} r={ri * 0.35} fill="#0562F8" />
          )
        )}
      </svg>
    </div>
  );
}
