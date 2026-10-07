import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import haxlr8LogoDark from '../../assets/logo/haxlr8-logo-dark.png';
import emitersSeal from '../../assets/logo/emiters-seal.png';

const MASTER_PASSCODE = 'HAXLR8_COMMAND_2026';
const ORGANIZER_SESSION_KEY = 'haxlr8_organizer_session';

export default function AdminAuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('passcode'); // 'passcode' or 'supabase'
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // 1. Check local organizer bypass session
      const savedSession = sessionStorage.getItem(ORGANIZER_SESSION_KEY) || localStorage.getItem(ORGANIZER_SESSION_KEY);
      if (savedSession === 'active') {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // 2. Check Supabase user
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.email === 'yashuhb18@gmail.com') {
            sessionStorage.setItem(ORGANIZER_SESSION_KEY, 'active');
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
          const { data: adminList } = await supabase.from('admins').select('email').eq('email', user.email);
          if (adminList && adminList.length > 0) {
            sessionStorage.setItem(ORGANIZER_SESSION_KEY, 'active');
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Admin check error:', err);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  const handlePasscodeLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (passcode.trim() === MASTER_PASSCODE) {
      sessionStorage.setItem(ORGANIZER_SESSION_KEY, 'active');
      localStorage.setItem(ORGANIZER_SESSION_KEY, 'active');
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Incorrect Master Passcode. Access denied.');
    }
  };

  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (res.error) throw res.error;
      const user = res.data?.user;
      if (user?.email === 'yashuhb18@gmail.com') {
        sessionStorage.setItem(ORGANIZER_SESSION_KEY, 'active');
        setIsAuthenticated(true);
      } else {
        const { data: adminList } = await supabase.from('admins').select('email').eq('email', user.email);
        if (adminList && adminList.length > 0) {
          sessionStorage.setItem(ORGANIZER_SESSION_KEY, 'active');
          setIsAuthenticated(true);
        } else {
          setErrorMsg('Account authenticated, but this email is not in the authorized Organizers roster.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fffaf3', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, border: '4px solid #fed7aa', borderTop: '4px solid #ff3b69', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: '#ff3b69', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>VERIFYING ORGANIZER CLEARANCE...</div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fffaf3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#ffffff', borderRadius: 24, border: '2px solid #fed7aa', padding: '36px 32px', boxShadow: '0 12px 40px rgba(251, 146, 60, 0.08)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 30, background: '#fff1f2', border: '1.5px solid #fecaca', marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>🛡️</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#e11d48', letterSpacing: '0.08em', textTransform: 'uppercase' }}>RESTRICTED ACCESS</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <img src={haxlr8LogoDark} alt="HAXLR8 3.0" style={{ height: 32, objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>Organizer Super-Command</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Master Administrative Control &amp; Telemetry Bay for MIT Mysore
          </p>
        </div>

        {/* Toggle Mode */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc', padding: 4, borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => { setMode('passcode'); setErrorMsg(''); }}
            style={{
              padding: '9px 12px',
              borderRadius: 10,
              border: 'none',
              background: mode === 'passcode' ? '#ffffff' : 'transparent',
              color: mode === 'passcode' ? '#ff3b69' : '#64748b',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: mode === 'passcode' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            🔑 Master Passcode
          </button>
          <button
            type="button"
            onClick={() => { setMode('supabase'); setErrorMsg(''); }}
            style={{
              padding: '9px 12px',
              borderRadius: 10,
              border: 'none',
              background: mode === 'supabase' ? '#ffffff' : 'transparent',
              color: mode === 'supabase' ? '#ff3b69' : '#64748b',
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
              boxShadow: mode === 'supabase' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            📧 Organizer Email
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 12, color: '#b91c1c', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Passcode Mode */}
        {mode === 'passcode' && (
          <form onSubmit={handlePasscodeLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Master Commander Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter commander secret key..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 14,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 14,
                  outline: 'none',
                  background: '#fafafa',
                  color: '#0f172a',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#ff3b69'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setPasscode(MASTER_PASSCODE)}
                style={{ background: 'none', border: 'none', color: '#ff3b69', fontSize: 12, fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                ⚡ 1-Click Auto-Fill Yash Key
              </button>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 14,
                border: 'none',
                background: '#ff3b69',
                color: '#ffffff',
                fontSize: 14.5,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255, 59, 105, 0.35)',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Unlock Master Command Deck 🚀
            </button>
          </form>
        )}

        {/* Supabase Email Mode */}
        {mode === 'supabase' && (
          <form onSubmit={handleSupabaseLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Organizer Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yashuhb18@gmail.com"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 14,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 14,
                  outline: 'none',
                  background: '#fafafa',
                  color: '#0f172a',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 14,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 14,
                  outline: 'none',
                  background: '#fafafa',
                  color: '#0f172a',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 14,
                border: 'none',
                background: '#ff3b69',
                color: '#ffffff',
                fontSize: 14.5,
                fontWeight: 900,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(255, 59, 105, 0.35)',
                marginTop: 6
              }}
            >
              {submitting ? 'Authenticating...' : 'Sign In as Organizer →'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1.5px solid #f1e7db', paddingTop: 16 }}>
          <a href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 700 }}>
            ← Return to HAXLR8 3.0 Home
          </a>
        </div>
      </div>
    </div>
  );
}
