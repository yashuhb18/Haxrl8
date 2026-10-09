import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, User, Radio, Sparkles, ExternalLink } from 'lucide-react';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import { playCrewmatePopSound } from '../components/amongus/AmongUsSound';
import { fetchCoordinators, getLocalCoordinators } from '../lib/coordinatorsService';

export default function ContactSection() {
  const [coordinators, setCoordinators] = useState(() => getLocalCoordinators());

  useEffect(() => {
    fetchCoordinators().then(res => {
      if (res) setCoordinators(res);
    });

    const handler = (e) => {
      if (e.detail) {
        setCoordinators(e.detail);
      }
    };
    window.addEventListener('haxlr8_coordinators_updated', handler);
    return () => window.removeEventListener('haxlr8_coordinators_updated', handler);
  }, []);

  const FACULTY_COORDINATORS = coordinators.faculty || [];
  const STUDENT_COORDINATORS = coordinators.students || [];
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    playCrewmatePopSound();

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
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
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <Radio size={16} />
            <span>Comms Room & Support</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            Connect With Our <span style={{ color: '#ff3b69' }}>Flight Crew</span>
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
            Direct telemetry lines to our Faculty Coordinators and Student Flight Directors.
            Reach out for team clearance, travel coordinates, and mission inquiries.
          </motion.p>

          {/* Hand-drawn doodle */}
          <div
            style={{
              marginTop: '16px',
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
            ★ WE DON'T BITE • CALL OR MESSAGE OUR SQUAD ANYTIME! 🚀 ★
          </div>
        </div>

        {/* 2-Column Grid: Contacts on Left, Dispatch Form on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* LEFT: Phone Directory & Venue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Faculty Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span
                  style={{
                    backgroundColor: '#ff3b69',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '13px',
                  }}
                >
                  ✦
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Faculty Coordinators
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {FACULTY_COORDINATORS.map((fac, idx) => {
                  const facPhoto = fac.photo || fac.defaultPhoto;
                  const crewColor = fac.crewColor || '#9333ea';
                  const bg = fac.bg || '#f3e8ff';
                  const border = fac.border || '#d8b4fe';
                  const badge = fac.badge || 'FACULTY COORDINATOR';
                  const phoneNum = fac.phone || '';

                  return (
                    <motion.div
                      key={fac.id || idx}
                      whileHover={{ y: -3, scale: 1.01 }}
                      style={{
                        backgroundColor: bg,
                        border: `2px solid ${border}`,
                        borderRadius: '22px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {facPhoto ? (
                          <div
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '14px',
                              overflow: 'hidden',
                              border: `2px solid ${border}`,
                              flexShrink: 0,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                              background: '#fff',
                            }}
                          >
                            <img
                              src={facPhoto}
                              alt={fac.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center 15%',
                              }}
                            />
                          </div>
                        ) : (
                          <div style={{ width: '42px', height: '48px', flexShrink: 0 }}>
                            <AmongUsCrewmate color={fac.color || 'purple'} size={42} />
                          </div>
                        )}
                        <div>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              letterSpacing: '0.06em',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: '#fff',
                              color: crewColor,
                              display: 'inline-block',
                              marginBottom: '4px',
                            }}
                          >
                            {badge}
                          </span>
                          <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                            {fac.name}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0', fontWeight: 600 }}>
                            {fac.designation || fac.role}
                          </p>
                        </div>
                      </div>

                      {phoneNum && (
                        <a
                          href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                          style={{
                            backgroundColor: '#ffffff',
                            color: crewColor,
                            border: `1.5px solid ${border}`,
                            padding: '10px 14px',
                            borderRadius: '14px',
                            fontWeight: 800,
                            fontSize: '13px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Phone size={14} />
                          <span>{phoneNum}</span>
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Student Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '13px',
                  }}
                >
                  ✦
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Student Flight Directors
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {STUDENT_COORDINATORS.map((stu, idx) => {
                  const stuPhoto = stu.photo || stu.defaultPhoto;
                  const crewColor = stu.crewColor || '#0284c7';
                  const bg = stu.bg || '#e0f2fe';
                  const border = stu.border || '#7dd3fc';
                  const badge = stu.badge || 'STUDENT COORDINATOR';
                  const phoneNum = stu.phone || '';

                  return (
                    <motion.div
                      key={stu.id || idx}
                      whileHover={{ y: -3, scale: 1.01 }}
                      style={{
                        backgroundColor: bg,
                        border: `2px solid ${border}`,
                        borderRadius: '22px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {stuPhoto ? (
                          <div
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '14px',
                              overflow: 'hidden',
                              border: `2px solid ${border}`,
                              flexShrink: 0,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                              background: '#fff',
                            }}
                          >
                            <img
                              src={stuPhoto}
                              alt={stu.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center 15%',
                              }}
                            />
                          </div>
                        ) : (
                          <div style={{ width: '42px', height: '48px', flexShrink: 0 }}>
                            <AmongUsCrewmate color={stu.color || 'yellow'} size={42} />
                          </div>
                        )}
                        <div>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              letterSpacing: '0.06em',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: '#fff',
                              color: crewColor,
                              display: 'inline-block',
                              marginBottom: '4px',
                            }}
                          >
                            {badge}
                          </span>
                          <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                            {stu.name}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0', fontWeight: 600 }}>
                            {stu.station || stu.role}
                          </p>
                        </div>
                      </div>

                      {phoneNum && (
                        <a
                          href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                          style={{
                            backgroundColor: '#ffffff',
                            color: crewColor,
                            border: `1.5px solid ${border}`,
                            padding: '10px 14px',
                            borderRadius: '14px',
                            fontWeight: 800,
                            fontSize: '13px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Phone size={14} />
                          <span>{phoneNum}</span>
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Campus Coordinates Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '24px',
                padding: '26px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#ef4444',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={20} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Campus Coordinates & Venue
                </h4>
              </div>

              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px', fontWeight: 500 }}>
                <strong>Department of Electronics & Communication Engineering</strong><br />
                Maharaja Institute of Technology Mysore (MITM)<br />
                Belavadi, Srirangapatna Taluk, Mandya / Mysuru, Karnataka 571477
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://maps.google.com/?q=Maharaja+Institute+of+Technology+Mysore"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} />
                </a>

                <a
                  href="mailto:haxlr8mitm@gmail.com"
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Mail size={14} />
                  <span>haxlr8mitm@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Transmission Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '32px',
              border: '3px solid #ff3b69',
              padding: 'clamp(28px, 4vw, 44px)',
              boxShadow: '0 16px 40px rgba(255, 59, 105, 0.08)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffe4e6', color: '#ff3b69', padding: '6px 16px', borderRadius: '9999px', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '14px' }}>
              <Send size={14} />
              <span>Direct Dispatch</span>
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>
              Dispatch a Message
            </h3>

            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 28px', lineHeight: 1.5, fontWeight: 500 }}>
              Need assistance with registration or problem statements? Leave your transmission below and our crew will respond quickly.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #86efac',
                  borderRadius: '24px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#166534', margin: '0 0 8px' }}>
                  Transmission Received!
                </h4>
                <p style={{ fontSize: '14px', color: '#15803d', margin: '0 0 20px', fontWeight: 500 }}>
                  Your message has been beamed to the HAXLR8 3.0 coordinating flight deck. We'll be in touch shortly!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    backgroundColor: '#166534',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Send Another Transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Alex Carter"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      color: '#0f172a',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#ff3b69'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@college.edu"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '16px',
                        border: '2px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        color: '#0f172a',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#ff3b69'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '16px',
                        border: '2px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        color: '#0f172a',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#ff3b69'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    Your Transmission / Query
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you need help with regarding team registration, idea papers, accommodation..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      color: '#0f172a',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#ff3b69'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#ff3b69',
                    color: '#ffffff',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '18px',
                    fontSize: '15px',
                    fontWeight: 900,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(255, 59, 105, 0.35)',
                    transition: 'all 0.2s ease',
                    marginTop: '8px',
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 59, 105, 0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 59, 105, 0.35)';
                    }
                  }}
                >
                  <Send size={18} />
                  <span>{loading ? 'Beaming Transmission...' : 'Transmit Message →'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
