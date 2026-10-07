import React from 'react';

export default function EventTimeline({ steps, currentStepIndex }) {
  // Steps evenly distributed
  const leftOffset = 100 / (2 * steps.length);
  const lineWidth = 100 - (2 * leftOffset);

  // Progress width
  const progressRatio = currentStepIndex / Math.max(1, steps.length - 1);
  const progressWidth = progressRatio * lineWidth;

  return (
    <div 
      className="dash-card event-timeline-card" 
      style={{ 
        padding: '24px 20px', 
        overflowX: 'auto', 
        background: '#ffffff', 
        borderRadius: 22, 
        boxShadow: '0 6px 20px rgba(251, 146, 60, 0.05)', 
        border: '2px solid #fed7aa',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="event-timeline-track" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minWidth: 480, position: 'relative' }}>
        
        {/* Background Conduit Track */}
        <div className="event-track-line" style={{ position: 'absolute', top: 16, left: `${leftOffset}%`, width: `${lineWidth}%`, height: 4, background: '#f1e7db', borderRadius: 6, zIndex: 0 }} />
        
        {/* Active Conduit Beam */}
        <div className="event-track-active" style={{ position: 'absolute', top: 16, left: `${leftOffset}%`, height: 4, background: 'linear-gradient(90deg, #0284c7, #06b6d4)', borderRadius: 6, zIndex: 0, transition: 'width 0.5s ease-in-out', width: `${progressWidth}%`, boxShadow: '0 0 10px rgba(2, 132, 199, 0.4)' }} />

        {steps.map((step, i) => {
          const isDone = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          const isActive = i <= currentStepIndex;

          return (
            <div key={i} className="event-step-node" style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 2px' }}>
              <div className="event-step-circle" style={{ 
                width: 34, height: 34, borderRadius: '50%', 
                background: isDone ? '#16a34a' : isCurrent ? '#0284c7' : '#ffffff', 
                border: isDone ? '3px solid #16a34a' : isCurrent ? '3px solid #0284c7' : '2.5px solid #cbd5e1', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: 8, transition: 'all 0.3s ease', 
                boxShadow: isCurrent ? '0 0 14px rgba(2, 132, 199, 0.45)' : isDone ? '0 2px 8px rgba(22, 163, 74, 0.25)' : 'none' 
              }}>
                {isDone ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                ) : isCurrent ? (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 6px #fff' }} />
                ) : (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} />
                )}
              </div>
              <div className="event-step-title" style={{ fontSize: 13, fontWeight: 800, color: isActive ? '#0f172a' : '#94a3b8', lineHeight: 1.25, marginBottom: 3 }}>
                {step.title}
              </div>
              <div className="event-step-date" style={{ fontSize: 11, fontWeight: 800, color: isCurrent ? '#0284c7' : isDone ? '#16a34a' : '#64748b' }}>
                {step.date}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .event-timeline-card {
            padding: 16px 10px !important;
          }
          .event-timeline-track {
            min-width: 320px !important;
          }
          .event-track-line, .event-track-active {
            top: 13px !important;
            height: 3px !important;
          }
          .event-step-circle {
            width: 26px !important;
            height: 26px !important;
            margin-bottom: 6px !important;
          }
          .event-step-circle svg {
            width: 11px !important;
            height: 11px !important;
          }
          .event-step-title {
            font-size: 10.5px !important;
            letter-spacing: -0.01em !important;
          }
          .event-step-date {
            font-size: 9.5px !important;
          }
        }
      `}</style>
    </div>
  );
}
