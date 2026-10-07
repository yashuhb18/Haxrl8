import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { sanitizeInput, isValidEmail } from '../lib/security';
import AmongUsCrewmate from '../components/amongus/AmongUsCrewmate';
import { playCrewmatePopSound, playEmergencyMeetingSound, playTaskCompleteSound } from '../components/amongus/AmongUsSound';
import { 
  Mail, Lock, Eye, EyeOff, User, ArrowLeft, ShieldAlert, Sparkles, 
  CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import amongusLoginHero from '../assets/auth/amongus_login_hero.png';
import { sendAccountWelcomeEmail, sendParticipantWelcomeEmail, sendLoginNotificationEmail } from '../lib/emailService';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' or 'signup' — auto-detect from /register or /login route
  const [mode, setMode] = useState(() => {
    return location.pathname === '/register' ? 'signup' : 'login';
  });

  // Impostor modal for non-leader crewmates
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
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  // Keep route synced with tab switcher
  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    playCrewmatePopSound();
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
        // STRICT LOGIN: Authenticate existing credentials with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) {
          console.warn('Sign-in error:', error);
          if (error.message?.toLowerCase().includes('invalid login credentials') || error.message?.toLowerCase().includes('invalid_grant')) {
            setErrorMsg('Invalid email or password. Please verify your credentials or click "Squad Register" to create an account.');
          } else {
            setErrorMsg(error.message || 'Login failed. Please check your credentials.');
          }
          setLoading(false);
          return;
        }

        // Clean up legacy global caches to protect account isolation
        try {
          localStorage.removeItem('haxlr8_teams_db');
          localStorage.removeItem('haxlr8_members_db');
          localStorage.removeItem('haxlr8_submissions_db');
        } catch (e) {}

        // Successfully logged in! Dispatch automated email notification
        sendLoginNotificationEmail({
          recipientEmail: cleanEmail,
          leaderName: data?.user?.user_metadata?.full_name || cleanEmail.split('@')[0],
        }).catch(err => console.warn('Login notification email dispatch error:', err));

        playTaskCompleteSound();
        navigate('/dashboard');
      } else {
        // Sign Up / Register Team Leader
        if (!cleanName) {
          setErrorMsg('Please enter your full name as Team Leader.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
            }
          }
        });

        if (error) {
          setErrorMsg(error.message || 'Registration failed. Please try again.');
          setLoading(false);
          return;
        }

        // Clean up legacy global caches so new user never sees previous user's team
        try {
          localStorage.removeItem('haxlr8_teams_db');
          localStorage.removeItem('haxlr8_members_db');
          localStorage.removeItem('haxlr8_submissions_db');
        } catch (e) {}

        localStorage.setItem('haxlr8_leader_confirmed', 'true');

        // Automated Account Creation Welcome Email
        sendAccountWelcomeEmail({
          recipientEmail: cleanEmail,
          leaderName: cleanName,
        }).catch(e => console.warn('Welcome email error:', e));

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
          setErrorMsg('Google login is pending provider configuration. Please sign in using Email & Password below.');
        } else {
          setErrorMsg(res.error.message || 'Google authentication encountered an issue.');
        }
        return;
      }
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      navigate('/dashboard');
    } catch (e) {
      setErrorMsg(e.message || 'Google authentication encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = () => {
    const demoUser = {
      id: '376a0c53-3c86-487c-8b50-d8a0ac596a72',
      email: 'yashuhb18@gmail.com',
      user_metadata: { full_name: 'Squad Commander Yash' }
    };
    localStorage.setItem('haxlr8_leader_session', JSON.stringify({ user: demoUser }));
    localStorage.setItem('haxlr8_leader_confirmed', 'true');

    // Also trigger automated login notification
    sendLoginNotificationEmail({
      recipientEmail: 'yashuhb18@gmail.com',
      leaderName: 'Squad Commander Yash'
    }).catch(err => console.warn('Demo login email error:', err));

    playTaskCompleteSound();
    navigate('/dashboard');
  };

  const fillQuickDemo = () => {
    setEmail('yashuhb18@gmail.com');
    setPassword('leader123');
    setName('Squad Commander Yash');
    playCrewmatePopSound();
  };

  return (
    <div
      className="auth-page-root"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f6ede3',
        backgroundImage: 'radial-gradient(circle at 50% 15%, #faf4ed 0%, #f4eae0 55%, #eae0d4 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── TOP NAV HEADER BAR ── */}
      <header
        className="auth-top-nav"
        style={{
          width: '100%',
          maxWidth: '1020px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="auth-home-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '9999px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 800,
            color: '#1e293b',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#a8262a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#a8262a',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <span>👑 Leader Portal</span>
          </div>
        </div>
      </header>

      {/* ── MAIN AUTH CONTAINER CARD ── */}
      <motion.div
        className="auth-main-card"
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: '1020px',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(70, 50, 30, 0.12), 0 4px 16px rgba(0,0,0,0.04)',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.15fr',
          minHeight: '580px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
          border: '1.5px solid #f1e7db',
        }}
      >
        {/* ══ LEFT PANEL: AMONG US ARTWORK (Desktop Only) ══ */}
        <div
          className="auth-desktop-hero-panel"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '520px',
            backgroundColor: '#e7d8c5',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <img
            src={amongusLoginHero}
            alt="HAXLR8 3.0 Among Us Team Scene"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />

          {/* Floating Top Badge */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '24px 28px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.95)',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 900,
                color: '#a8262a',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <span>HAXLR8 3.0 • FLIGHT TERMINAL</span>
            </div>
          </div>

          {/* Floating Bottom Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '24px 28px',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
              color: '#ffffff',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#facc15', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              ✦ Commander Mission
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.3 }}>
              24-Hour National Hackathon • MIT Mysore
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Only Team Leader registers. Assemble your 3–4 crewmates inside your flight deck!
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL: AUTH FORM & MOBILE HERO ══ */}
        <div
          className="auth-form-panel"
          style={{
            backgroundColor: '#ffffff',
            padding: '36px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* ── MOBILE EXCLUSIVE HERO HEADER ── */}
          <div className="auth-mobile-header" style={{ display: 'none', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <AmongUsCrewmate 
                color={mode === 'signup' ? 'yellow' : 'red'} 
                hat={mode === 'signup' ? 'crown' : 'cap'} 
                size={58} 
                interactive={false} 
              />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
              HAXLR8 3.0 Flight Deck
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, fontWeight: 600 }}>
              {mode === 'signup' 
                ? 'Register squad leader to assemble your team' 
                : 'Login to access your squad command deck'}
            </p>
          </div>

          {/* ── MODE SWITCHER TABS (Login vs Register) ── */}
          <div
            className="auth-mode-tabs"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#f1f5f9',
              borderRadius: '16px',
              padding: '4px',
              marginBottom: '24px',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => switchMode('login')}
              style={{
                padding: '11px',
                borderRadius: '12px',
                border: 'none',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#0f172a' : '#64748b',
                fontWeight: mode === 'login' ? 900 : 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span>🔑 Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode('signup')}
              style={{
                padding: '11px',
                borderRadius: '12px',
                border: 'none',
                background: mode === 'signup' ? '#ffffff' : 'transparent',
                color: mode === 'signup' ? '#a8262a' : '#64748b',
                fontWeight: mode === 'signup' ? 900 : 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: mode === 'signup' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span>🚀 Squad Register</span>
            </button>
          </div>

          {/* Title on Desktop */}
          <div className="auth-desktop-title-row" style={{ marginBottom: '20px' }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#0f172a',
                margin: '0 0 6px',
                lineHeight: 1.2,
              }}
            >
              {mode === 'login' ? 'Welcome Back!' : 'Create Squad Account'}
            </h1>
            <p
              style={{
                fontSize: '13.5px',
                color: '#64748b',
                margin: 0,
                fontWeight: 500,
              }}
            >
              {mode === 'login'
                ? 'Sign in to access your flight deck and team controls'
                : 'Register as Team Leader (Only 1 leader registers per squad)'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Team Leader Full Name
                </label>
                <div
                  className="auth-input-wrapper"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0 16px',
                    height: '50px',
                    borderRadius: '14px',
                    border: '1.5px solid #cbd5e1',
                    backgroundColor: '#fafafa',
                    transition: 'all 0.2s',
                  }}
                >
                  <User size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Yashwanth B."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '15px',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {mode === 'signup' ? 'Leader Email Address' : 'Email Address'}
              </label>
              <div
                className="auth-input-wrapper"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0 16px',
                  height: '50px',
                  borderRadius: '14px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s',
                }}
              >
                <Mail size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                <input
                  type="email"
                  required
                  placeholder="leader@college.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '15px',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions: Please contact haxlr8ecemitm@gmail.com or register your account if new!')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      color: '#a8262a',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 700,
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div
                className="auth-input-wrapper"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0 16px',
                  height: '50px',
                  borderRadius: '14px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s',
                }}
              >
                <Lock size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '15px',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    fontWeight: 600,
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
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error / Success Feedback */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  color: '#15803d',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Main Action Crimson Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
              style={{
                height: '50px',
                backgroundColor: '#a8262a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15.5px',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(168, 38, 42, 0.28)',
                transition: 'background-color 0.2s, transform 0.1s',
                marginTop: '6px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#932024'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#a8262a'; }}
            >
              <span>{loading ? 'Processing...' : (mode === 'login' ? 'Login to Flight Deck →' : 'Register Squad Leader →')}</span>
            </button>
          </form>

          {/* Divider "OR" */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '18px 0',
              gap: '12px',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.04em' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            style={{
              height: '48px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#1e293b',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
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

          {/* Quick Demo Autofill & Instant Access */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={fillQuickDemo}
              style={{
                background: '#f8fafc',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '11.5px',
                color: '#64748b',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              📝 Fill Demo Credentials
            </button>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              style={{
                background: '#fff7ed',
                border: '1.5px solid #fed7aa',
                borderRadius: '100px',
                padding: '6px 16px',
                fontSize: '12px',
                color: '#ea580c',
                cursor: 'pointer',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚡ 1-Click Instant Demo Access</span>
            </button>
          </div>

          {/* Impostor / Squad Member Help Pill */}
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => { playEmergencyMeetingSound(); setShowImpostorModal(true); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Not a Team Leader? See how Squad Members join →
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          IMPOSTOR EMERGENCY MEETING MODAL
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
              zIndex: 9999,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#ffffff',
                borderRadius: '26px',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(220, 38, 38, 0.35)',
                border: '3px solid #ef4444',
                position: 'relative',
              }}
            >
              {/* Siren Icon */}
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  border: '2px solid #fca5a5',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
                }}
              >
                <AlertTriangle size={28} />
              </div>

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
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#0f172a',
                  margin: '0 0 12px',
                }}
              >
                Crewmate Notice!
              </h3>

              <p
                style={{
                  fontSize: '13.5px',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: '0 0 20px',
                  fontWeight: 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Don't worry, crewmate! <strong>Squad members do NOT need to register a separate account</strong>.
                Your Team Leader will enter your full name, college ID, and email directly when assembling the squad in their flight deck!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    playTaskCompleteSound();
                    setShowImpostorModal(false);
                    switchMode('signup');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#a8262a',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(168, 38, 42, 0.25)',
                  }}
                >
                  👑 I Want To Be The Team Leader!
                </button>

                <button
                  type="button"
                  onClick={() => setShowImpostorModal(false)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  Got It! Return to Screen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #94a3b8; }
        
        .auth-input-wrapper:focus-within {
          border-color: #a8262a !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(168, 38, 42, 0.12) !important;
        }

        @media (max-width: 860px) {
          .auth-main-card {
            grid-template-columns: 1fr !important;
            border-radius: 24px !important;
            min-height: auto !important;
            box-shadow: 0 16px 40px rgba(70, 50, 30, 0.1) !important;
          }
          .auth-desktop-hero-panel {
            display: none !important;
          }
          .auth-mobile-header {
            display: block !important;
          }
          .auth-desktop-title-row {
            display: none !important;
          }
          .auth-form-panel {
            padding: 24px 20px !important;
          }
          .auth-top-nav {
            margin-bottom: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .auth-page-root {
            padding: 16px 12px 28px !important;
          }
          .auth-form-panel {
            padding: 20px 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
