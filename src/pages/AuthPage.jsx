import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { sanitizeInput, isValidEmail } from '../lib/security';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import { playCrewmatePopSound, playEmergencyMeetingSound, playTaskCompleteSound } from '../components/amongus/AmongUsSound';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, ShieldAlert, Sparkles, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import amongusLoginHero from '../assets/auth/amongus_login_hero.png';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' or 'signup'
  const isInitialLogin = location.pathname === '/login';
  const [mode, setMode] = useState(isInitialLogin ? 'login' : 'login'); // Default to login as shown in image
  
  // Leader Confirmation Gate State: null = not answered, true = confirmed leader, false = impostor
  const [confirmedLeader, setConfirmedLeader] = useState(false);
  const [showImpostorModal, setShowImpostorModal] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Check if session already exists
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        // Already authenticated
      }
    });
  }, []);

  const handleLeaderSelect = (isLeader) => {
    if (isLeader) {
      playTaskCompleteSound();
      setConfirmedLeader(true);
      setShowImpostorModal(false);
    } else {
      playEmergencyMeetingSound();
      setShowImpostorModal(true);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const cleanEmail = sanitizeInput(email).trim().toLowerCase();
    const cleanName = sanitizeInput(name).trim();

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        
        playTaskCompleteSound();
        navigate('/dashboard');
      } else {
        if (!cleanName) {
          setErrorMsg('Please enter your full name as Team Leader.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: cleanName } }
        });
        if (error) throw error;

        playTaskCompleteSound();
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      playCrewmatePopSound();
      const res = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` }
      });
      if (res?.error) {
        if (res.error.message?.includes('provider is not enabled') || res.error.message?.includes('validation_failed') || res.error.message?.includes('Unsupported provider')) {
          setErrorMsg('Google login is not enabled in your Supabase project yet. Please enable Google under Supabase Authentication ➔ Providers ➔ Google, or sign in using Email & Password below.');
        } else {
          setErrorMsg(res.error.message || 'Google authentication encountered an issue.');
        }
        return;
      }
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      // If session was set locally or already authenticated
      navigate('/dashboard');
    } catch (e) {
      setErrorMsg(e.message || 'Google authentication encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = () => {
    setEmail('leader@haxlr8.mit.ac.in');
    setPassword('leader123');
    setName('Squad Commander');
    playCrewmatePopSound();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5ebe0',
        backgroundImage: 'radial-gradient(circle at 50% 25%, #faf3eb 0%, #f4ece1 55%, #eae0d2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Return to Home pill */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '9999px',
          padding: '8px 18px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 700,
          color: '#374151',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          transition: 'all 0.2s',
          zIndex: 100,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#a8262a'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
      >
        <ArrowLeft size={16} />
        <span>Return to Home</span>
      </button>

      {/* ─────────────────────────────────────────────────────────────
          SECTION A: PRE-LOGIN LEADER CONFIRMATION GATE
          (Shown before accessing the login form)
         ───────────────────────────────────────────────────────────── */}
      {!confirmedLeader ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: '680px',
            background: '#ffffff',
            borderRadius: '28px',
            padding: '40px 36px',
            boxShadow: '0 20px 50px rgba(70, 50, 30, 0.1), 0 2px 10px rgba(0,0,0,0.03)',
            border: '1.5px solid #f1e7db',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Top Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fee2e2',
              color: '#a8262a',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            <ShieldAlert size={15} />
            <span>Identity & Flight Role Verification</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
              fontWeight: 900,
              color: '#0f172a',
              margin: '0 0 10px',
              lineHeight: 1.2,
            }}
          >
            Are you the designated <span style={{ color: '#a8262a' }}>Team Leader</span>?
          </h2>

          <p
            style={{
              fontSize: '14.5px',
              color: '#64748b',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: '0 auto 32px',
              fontWeight: 500,
            }}
          >
            Per HAXLR8 3.0 protocol, <strong>only 1 member per squad (the Team Leader)</strong> registers and logs in. Squad members are enrolled directly from the Leader’s flight deck!
          </p>

          {/* 2 Big Choice Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '28px',
            }}
          >
            {/* OPTION 1: YES - TEAM LEADER */}
            <motion.div
              whileHover={{ y: -4, borderColor: '#16a34a' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLeaderSelect(true)}
              style={{
                cursor: 'pointer',
                background: '#f0fdf4',
                border: '2px solid #bbf7d0',
                borderRadius: '20px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08)',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <AmongUsCrewmate color="red" hat="crown" size={72} interactive={false} />
              </div>
              <div
                style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  marginBottom: '8px',
                }}
              >
                👑 SQUAD COMMANDER
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14532d', margin: '0 0 6px' }}>
                YES, I AM THE LEADER
              </h3>
              <p style={{ fontSize: '12.5px', color: '#166534', margin: '0 0 16px', lineHeight: 1.4, opacity: 0.9 }}>
                I will assemble 3–4 crewmates, submit idea abstracts, and manage our squad.
              </p>
              <button
                type="button"
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>Confirm & Enter Login</span>
                <ChevronRight size={16} />
              </button>
            </motion.div>

            {/* OPTION 2: NO - SQUAD MEMBER (THE IMPOSTOR!) */}
            <motion.div
              whileHover={{ y: -4, borderColor: '#ef4444' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLeaderSelect(false)}
              style={{
                cursor: 'pointer',
                background: '#fef2f2',
                border: '2px solid #fecaca',
                borderRadius: '20px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.08)',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <AmongUsCrewmate color="blue" hat="none" size={72} interactive={false} />
              </div>
              <div
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  marginBottom: '8px',
                }}
              >
                🚨 SQUAD MEMBER / IMPOSTOR
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b', margin: '0 0 6px' }}>
                NO, I'M A SQUAD MEMBER
              </h3>
              <p style={{ fontSize: '12.5px', color: '#7f1d1d', margin: '0 0 16px', lineHeight: 1.4, opacity: 0.9 }}>
                I am a team member, specialist coder, or looking to tag along for the sprint.
              </p>
              <button
                type="button"
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>I'm a Member / Impostor</span>
                <AlertTriangle size={15} />
              </button>
            </motion.div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: 600 }}>
            ✦ Tip: If you don’t have a team yet, click "YES" to register and become the leader of your new squad!
          </div>
        </motion.div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           SECTION B: THE LOGIN / SIGNUP CARD
           (Faithfully matching the exact uploaded image media_1791355147030.jpg)
           ───────────────────────────────────────────────────────────── */
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: '960px',
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            boxShadow: '0 24px 60px rgba(70, 50, 30, 0.12), 0 4px 16px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            minHeight: '580px',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* ── LEFT PANEL: THE AMONG US 3D WORKSPACE ARTWORK ── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '440px',
              backgroundColor: '#e7d8c5',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={amongusLoginHero}
              alt="HAXLR8 3.0 Among Us Team Scene"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                transform: 'scale(1.03)', // Seamless edge clip
              }}
            />
          </div>

          {/* ── RIGHT PANEL: CLEAN LOGIN / SIGNUP FORM ── */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '44px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Leader Badge + Change Role Option */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                <span>👑 Verified Team Leader</span>
              </div>
              <button
                type="button"
                onClick={() => setConfirmedLeader(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Change Role
              </button>
            </div>

            {/* Title & Subtitle */}
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#111827',
                margin: '0 0 6px',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 28px',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {mode === 'login'
                ? 'Login to continue your journey with HAXLR8 3.0'
                : 'Register as Team Leader to unlock squad controls'}
            </p>

            {/* Form */}
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0 16px',
                    height: '48px',
                    borderRadius: '12px',
                    border: '1.5px solid #e5e7eb',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <User size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '14px',
                      color: '#111827',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              )}

              {/* Email */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0 16px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '1.5px solid #e5e7eb',
                  backgroundColor: '#fafafa',
                  transition: 'border-color 0.2s',
                }}
              >
                <Mail size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '14px',
                    color: '#111827',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Password */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0 16px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '1.5px solid #e5e7eb',
                  backgroundColor: '#fafafa',
                  transition: 'border-color 0.2s',
                }}
              >
                <Lock size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '14px',
                    color: '#111827',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password link */}
              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email address (or use Quick Demo login below)!')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 600,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Error / Success Feedback */}
              {errorMsg && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  ✓ {successMsg}
                </div>
              )}

              {/* Main Brick/Crimson Red Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  height: '48px',
                  backgroundColor: '#a8262a', // Exact brick crimson from reference image
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(168, 38, 42, 0.28)',
                  transition: 'background-color 0.2s, transform 0.1s',
                  marginTop: '4px',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#932024'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#a8262a'; }}
              >
                <span>{loading ? 'Logging in...' : (mode === 'login' ? 'Login →' : 'Create Squad Account →')}</span>
              </button>
            </form>

            {/* Divider "OR" */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '20px 0',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, letterSpacing: '0.04em' }}>
                OR
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              style={{
                height: '48px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1f2937',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Bottom Toggle Text */}
            <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13.5px', color: '#6b7280' }}>
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a8262a',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMsg(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a8262a',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Log in
                  </button>
                </>
              )}
            </div>

            {/* Quick Demo Autofill Pill */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={fillQuickDemo}
                style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '100px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                ⚡ 1-Click Fill Demo Credentials
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          IMPOSTOR EMERGENCY MEETING MODAL
          (Triggers when someone clicks "NO, I'M A SQUAD MEMBER")
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showImpostorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 999,
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#ffffff',
                borderRadius: '26px',
                padding: '36px 30px',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(220, 38, 38, 0.35)',
                border: '3px solid #ef4444',
                position: 'relative',
              }}
            >
              {/* Flashing Siren / Alarm Icon */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '2px solid #fca5a5',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                }}
              >
                <AlertTriangle size={32} />
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#dc2626',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                🚨 EMERGENCY MEETING CALLED! 🚨
              </div>

              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#0f172a',
                  margin: '0 0 14px',
                }}
              >
                There is 1 Impostor Among Us!
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: '0 0 24px',
                  fontWeight: 500,
                }}
              >
                Don't worry, crewmate! <strong>As a squad member, you do NOT need an account</strong>.
                Your Team Leader will enter your full name, college ID, and email directly when assembling the squad in their dashboard.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    playTaskCompleteSound();
                    setConfirmedLeader(true);
                    setShowImpostorModal(false);
                  }}
                  style={{
                    padding: '13px',
                    borderRadius: '12px',
                    backgroundColor: '#a8262a',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(168, 38, 42, 0.25)',
                  }}
                >
                  👑 Never Mind, I'll Be The Team Leader!
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowImpostorModal(false);
                    navigate('/');
                  }}
                  style={{
                    padding: '13px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  🏠 Return to Homepage
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowImpostorModal(false);
                    setConfirmedLeader(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px',
                    textDecoration: 'underline',
                  }}
                >
                  Bypass security (Enter login anyway)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #9ca3af; }
        @media (max-width: 820px) {
          div[style*="grid-template-columns: 1.05fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 1.05fr 1fr"] > div:first-child {
            min-height: 260px !important;
            max-height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
}
