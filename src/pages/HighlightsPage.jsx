import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Heart, Trophy, Users, X, ZoomIn, ArrowRight } from 'lucide-react';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import { playCrewmatePopSound } from '../components/amongus/AmongUsSound';

// Highlight photos
import img1 from '../assets/highlights/highlights_image/IMG_0073.JPG';
import img2 from '../assets/highlights/highlights_image/IMG_0078.JPG';
import img3 from '../assets/highlights/highlights_image/IMG_0079.JPG';
import img4 from '../assets/highlights/highlights_image/IMG_0080.JPG';
import img5 from '../assets/highlights/highlights_image/IMG_0083.JPG';
import img6 from '../assets/highlights/highlights_image/IMG_0094.JPG';
import img7 from '../assets/highlights/highlights_image/IMG_0099.JPG';
import img8 from '../assets/highlights/highlights_image/IMG_0545.JPG';
import img9 from '../assets/highlights/highlights_image/IMG_0547.JPG';
import img10 from '../assets/highlights/highlights_image/IMG_0550.JPG';
import img11 from '../assets/highlights/highlights_image/IMG_0555.JPG';
import img12 from '../assets/highlights/highlights_image/IMG_0558.JPG';
import crewImage from '../assets/highlights/crew.png';

const GALLERY = [
  { id: 1, title: 'Inauguration & Keynote', category: 'ceremony', tag: 'KICKOFF', src: img1, rotate: -1.5, bg: '#ffe4e6', border: '#fda4af' },
  { id: 2, title: 'Deep Prototyping Mode', category: 'sprint', tag: 'ZERO-G CODE', src: img2, rotate: 1.8, bg: '#fef9c3', border: '#fde047' },
  { id: 3, title: 'Faculty Mentorship Rounds', category: 'sprint', tag: 'MENTORSHIP', src: img3, rotate: -2, bg: '#e0f2fe', border: '#7dd3fc' },
  { id: 4, title: 'Hardware & IoT Testing', category: 'sprint', tag: 'CIRCUITS LIVE', src: img4, rotate: 1.2, bg: '#dcfce7', border: '#86efac' },
  { id: 5, title: 'Midnight Brainstorming', category: 'sprint', tag: '2:00 AM SPRINT', src: img5, rotate: -1.8, bg: '#f3e8ff', border: '#d8b4fe' },
  { id: 6, title: 'Team Coordination & Sync', category: 'sprint', tag: 'CREW CHAT', src: img6, rotate: 2.2, bg: '#ffedd5', border: '#fed7aa' },
  { id: 7, title: 'Jury Evaluation & Pitching', category: 'ceremony', tag: 'DEMO DAY', src: img7, rotate: -1.2, bg: '#ffe4e6', border: '#fda4af' },
  { id: 8, title: 'Live Project Demonstration', category: 'sprint', tag: 'SHOWCASE', src: img8, rotate: 1.5, bg: '#e0f2fe', border: '#7dd3fc' },
  { id: 9, title: 'Auditorium Celebrations', category: 'ceremony', tag: 'CHEERS', src: img9, rotate: -2.1, bg: '#fef9c3', border: '#fde047' },
  { id: 10, title: 'Victory Trophies Awarded', category: 'ceremony', tag: 'CHAMPIONS', src: img10, rotate: 1.7, bg: '#dcfce7', border: '#86efac' },
  { id: 11, title: 'Participant Squad Memories', category: 'sprint', tag: 'TEAM SPIRIT', src: img11, rotate: -1.4, bg: '#f3e8ff', border: '#d8b4fe' },
  { id: 12, title: 'Grand Finale Group Shot', category: 'ceremony', tag: 'FINALE', src: img12, rotate: 2.0, bg: '#ffedd5', border: '#fed7aa' },
];

export default function HighlightsPage() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filteredPhotos = filter === 'all' 
    ? GALLERY 
    : GALLERY.filter(p => p.category === filter);

  const openLightbox = (photo) => {
    playCrewmatePopSound();
    setLightbox(photo);
  };

  return (
    <div
      style={{
        backgroundColor: '#fffaf3',
        color: '#0f172a',
        minHeight: '100vh',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
        paddingTop: '150px',
        paddingBottom: '100px',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Decorative Floating Doodles / Crewmates */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 140,
          left: '4%',
          width: 70,
          height: 80,
          pointerEvents: 'none',
          display: 'none',
        }}
        className="hidden md:block"
      >
        <AmongUsCrewmate color="#ff3b69" hat="crown" size={68} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 160,
          right: '5%',
          width: 70,
          height: 80,
          pointerEvents: 'none',
        }}
        className="hidden md:block"
      >
        <AmongUsCrewmate color="#0284c7" hat="pilot" size={68} />
      </motion.div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffe4e6',
              color: '#ff3b69',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <Camera size={16} />
            <span>Past Editions & Telemetry</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            Relive the <span style={{ color: '#ff3b69' }}>Magic</span> & <span style={{ color: '#f59e0b' }}>Moments</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: '#64748b',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            Snapshots from previous HAXLR8 hackathons. High-voltage coding marathons, 
            zero-gravity prototyping, and pure student energy.
          </motion.p>

          {/* Handwritten Annotation */}
          <div
            style={{
              marginTop: '18px',
              display: 'inline-block',
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '20px',
              color: '#0284c7',
              background: '#fff',
              padding: '6px 20px',
              borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
              border: '2px dashed #0284c7',
              transform: 'rotate(-1.5deg)',
            }}
          >
            ★ REAL CREWMATES • REAL PROTOTYPES • ZERO FAKE TEMPLATES ★
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '36px',
            }}
          >
            {[
              { id: 'all', label: 'All Moments (12)', icon: Sparkles },
              { id: 'sprint', label: '🔥 Hackathon Sprint', icon: Heart },
              { id: 'ceremony', label: '🏆 Trophies & Demos', icon: Trophy },
            ].map(tab => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playCrewmatePopSound();
                    setFilter(tab.id);
                  }}
                  style={{
                    backgroundColor: active ? '#ff3b69' : '#fff',
                    color: active ? '#fff' : '#0f172a',
                    border: `2px solid ${active ? '#ff3b69' : '#e2e8f0'}`,
                    padding: '10px 22px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: active ? '0 8px 20px rgba(255, 59, 105, 0.25)' : '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.borderColor = '#ff3b69';
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Polaroid / Photo Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px',
            marginBottom: '80px',
          }}
        >
          <AnimatePresence>
            {filteredPhotos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
                onClick={() => openLightbox(photo)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  border: `2.5px solid ${photo.border}`,
                  padding: '14px 14px 18px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transform: `rotate(${photo.rotate}deg)`,
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                  position: 'relative',
                }}
              >
                {/* Tape sticker simulation */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '20px',
                    backgroundColor: 'rgba(254, 240, 138, 0.85)',
                    borderRadius: '3px',
                    border: '1px solid rgba(250, 204, 21, 0.4)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    zIndex: 2,
                  }}
                />

                {/* Photo Image Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '220px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: photo.bg,
                  }}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />

                  {/* Tag Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(8px)',
                      color: '#0f172a',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {photo.tag}
                  </div>

                  {/* Zoom Icon Hover */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                      color: '#fff',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ZoomIn size={16} />
                  </div>
                </div>

                {/* Caption */}
                <div style={{ marginTop: '14px', padding: '0 4px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                    {photo.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: 600 }}>
                    HAXLR8 Edition // MIT Mysore
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── COMMITTEE CREW SHOWCASE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            border: '3px solid #ff3b69',
            padding: ' clamp(24px, 4vw, 48px)',
            boxShadow: '0 16px 40px rgba(255, 59, 105, 0.1)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px 18px', borderRadius: '9999px', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '14px' }}>
            <Users size={15} />
            <span>Organizing Committee</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
            The Humans Behind <span style={{ color: '#ff3b69' }}>The Mission</span>
          </h2>

          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6, fontWeight: 500 }}>
            Powered by the Department of Electronics & Communication Engineering, EMITERS Club, and our passionate student leads.
          </p>

          <div
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            <img
              src={crewImage}
              alt="HAXLR8 Committee Crew"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>

          <div
            style={{
              marginTop: '24px',
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '22px',
              color: '#ff3b69',
            }}
          >
            ♥ Proudly driven by the faculty and students of MIT Mysore!
          </div>
        </motion.div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '28px',
                padding: '16px',
                maxWidth: '850px',
                width: '100%',
                maxHeight: '90vh',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  backgroundColor: '#ff3b69',
                  color: '#fff',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255, 59, 105, 0.4)',
                }}
              >
                <X size={20} />
              </button>

              <div style={{ borderRadius: '18px', overflow: 'hidden', maxHeight: '70vh' }}>
                <img
                  src={lightbox.src}
                  alt={lightbox.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>

              <div style={{ padding: '16px 8px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                    {lightbox.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    HAXLR8 Hackathon • MIT Mysore
                  </p>
                </div>
                <span
                  style={{
                    backgroundColor: lightbox.bg,
                    color: '#0f172a',
                    border: `1.5px solid ${lightbox.border}`,
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                  }}
                >
                  {lightbox.tag}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
