import React, { useState, useEffect } from 'react';
import { filterRealAnnouncements, deleteAnnouncement } from '../../lib/announcementsService';
import { isOrganizerAuthorized, ORGANIZER_SESSION_KEY } from '../admin/adminAuth';
import { Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AnnouncementsTab({ announcements = [] }) {
  const [items, setItems] = useState(() => filterRealAnnouncements(announcements));
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState('');

  // Keep items synchronized with parent props
  useEffect(() => {
    setItems(filterRealAnnouncements(announcements));
  }, [announcements]);

  // Check organizer authorization and listen for real-time deletion events
  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      const authorized = await isOrganizerAuthorized();
      if (mounted) setIsOrganizer(authorized);
    };
    checkAuth();

    const handleUpdate = (e) => {
      const deletedId = e?.detail?.deletedId;
      if (deletedId) {
        setItems(prev => prev.filter(item => String(item.id) !== String(deletedId)));
      }
    };

    window.addEventListener('haxlr8_announcements_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('haxlr8_announcements_updated', handleUpdate);
    };
  }, []);

  const handleDeleteAnnouncement = async (item) => {
    if (!item?.id) return;

    let authorized = isOrganizer;
    if (!authorized) {
      const enteredCode = window.prompt(
        'Organizer Action: Enter Organizer Master Passcode to permanently delete this broadcast globally across all devices:'
      );
      if (!enteredCode) return;

      const cleanCode = enteredCode.trim().toLowerCase();
      if (cleanCode === 'ecemit3.0' || cleanCode === 'ecemit' || cleanCode === 'haxlr8') {
        try {
          localStorage.setItem(ORGANIZER_SESSION_KEY, 'active');
        } catch (e) {}
        setIsOrganizer(true);
        authorized = true;
      } else {
        const dismissOnly = window.confirm(
          'Passcode incorrect. Would you like to dismiss/hide this notification from your screen locally?'
        );
        if (dismissOnly) {
          setItems(prev => prev.filter(i => String(i.id) !== String(item.id)));
        }
        return;
      }
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${item.title}"?\n\nThis will remove it from all participant dashboards and the database immediately.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      await deleteAnnouncement(item.id);
      setItems(prev => prev.filter(i => String(i.id) !== String(item.id)));
      setNotice(`Broadcast "${item.title}" was permanently deleted.`);
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      console.error('Failed to delete broadcast:', err);
      alert('Error deleting announcement: ' + (err.message || 'Please try again.'));
    } finally {
      setDeletingId(null);
    }
  };

  const displayAnnouncements = filterRealAnnouncements(items);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860, margin: '0 auto', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: '#ffffff', borderRadius: 24, padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.03)', border: '2px solid #fed7aa' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 32 }}>📡</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Flight Broadcasts &amp; Telemetry
            </h2>
          </div>
          {isOrganizer && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: 20 }}>
              <ShieldCheck size={14} color="#16a34a" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Organizer Control Active
              </span>
            </div>
          )}
        </div>

        <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: 14, fontWeight: 500 }}>
          Stay updated with official announcements, schedule alerts, and sector updates from the HAXLR8 3.0 Space Command at MIT Mysore.
        </p>

        {/* Action Notice feedback */}
        {notice && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '10px 14px', marginBottom: 20, color: '#15803d', fontSize: 13, fontWeight: 700 }}>
            <CheckCircle2 size={16} />
            <span>{notice}</span>
          </div>
        )}
        
        {/* Announcements List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {displayAnnouncements.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '48px 0', fontSize: 14, border: '1.5px dashed #fed7aa', borderRadius: 16, background: '#fffaf3' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🛰️</div>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>No starship broadcasts in this frequency yet.</div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Check back regularly as your squad approaches launch day!</p>
            </div>
          ) : displayAnnouncements.map(a => {
            const isDeleting = deletingId === a.id;
            return (
              <div key={a.id} style={{ padding: '22px', borderRadius: 18, border: '1.5px solid #fed7aa', background: '#f8fafc', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: '1 1 240px' }}>
                    <h3 style={{ fontSize: 16.5, fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>{a.title}</h3>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                      {new Date(a.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} • Starfleet Admin
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {a.tag && (
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '4px 12px', borderRadius: 20 }}>
                        {a.tag}
                      </span>
                    )}

                    {/* Delete Broadcast Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(a)}
                      disabled={isDeleting}
                      title="Delete this announcement"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: isDeleting ? '#94a3b8' : '#dc2626',
                        background: isDeleting ? '#f1f5f9' : '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 10,
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {a.message || a.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
