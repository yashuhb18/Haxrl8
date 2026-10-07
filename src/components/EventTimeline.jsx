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
      className="dash-card" 
      style={{ 
        padding: '28px 24px', 
        overflowX: 'auto', 
        background: '#ffffff', 
        borderRadius: 24, 
        boxShadow: '0 8px 24px rgba(251, 146, 60, 0.06)', 
        border: '2px solid #fed7aa',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minWidth: 600, position: 'relative' }}>
        
        {/* Background Conduit Track */}
        <div style={{ position: 'absolute', top: 16, left: `${leftOffset}%`, width: `${lineWidth}%`, height: 4, background: '#f1e7db', borderRadius: 6, zIndex: 0 }} />
        
        {/* Active Conduit Beam */}
        <div style={{ position: 'absolute', top: 16, left: `${leftOffset}%`, height: 4, background: 'linear-gradient(90deg, #ff3b69, #f59e0b)', borderRadius: 6, zIndex: 0, transition: 'width 0.5s ease-in-out', width: `${progressWidth}%`, boxShadow: '0 0 10px rgba(255, 59, 105, 0.4)' }} />

        {steps.map((step, i) => {
          const isDone = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          const isActive = i <= currentStepIndex;

          return (
            <div key={i} style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: 36, height: 36, borderRadius: '50%', 
                background: isDone ? '#16a34a' : isCurrent ? '#ff3b69' : '#ffffff', 
                border: isDone ? '3px solid #16a34a' : isCurrent ? '3px solid #ff3b69' : '2.5px solid #cbd5e1', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: 10, transition: 'all 0.3s ease', 
                boxShadow: isCurrent ? '0 0 16px rgba(255, 59, 105, 0.45)' : isDone ? '0 2px 8px rgba(22, 163, 74, 0.25)' : 'none' 
              }}>
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                ) : isCurrent ? (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 6px #fff' }} />
                ) : (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} />
                )}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: isActive ? '#0f172a' : '#94a3b8', lineHeight: 1.3, marginBottom: 4 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: isCurrent ? '#ff3b69' : isDone ? '#16a34a' : '#64748b' }}>
                {step.date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
