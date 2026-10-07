import React from 'react';

export default function AnnouncementsTab({ announcements = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860, margin: '0 auto', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: '#ffffff', borderRadius: 24, padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.03)', border: '2px solid #fed7aa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 32 }}>📡</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Flight Broadcasts &amp; Telemetry
          </h2>
        </div>
        <p style={{ color: '#64748b', margin: '0 0 32px 0', fontSize: 14, fontWeight: 500 }}>
          Stay updated with official announcements, schedule alerts, and sector updates from the HAXLR8 3.0 Space Command at MIT Mysore.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {announcements.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '48px 0', fontSize: 14, border: '1.5px dashed #fed7aa', borderRadius: 16, background: '#fffaf3' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🛰️</div>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>No starship broadcasts in this frequency yet.</div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Check back regularly as your squad approaches launch day!</p>
            </div>
          ) : announcements.map(a => (
            <div key={a.id} style={{ padding: '22px', borderRadius: 18, border: '1.5px solid #fed7aa', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>{a.title}</h3>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                    {new Date(a.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} • Starfleet Admin
                  </div>
                </div>
                {a.tag && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '4px 12px', borderRadius: 20 }}>
                    {a.tag}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                {a.message || a.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
