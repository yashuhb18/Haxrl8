import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export default function LegalPage() {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      style={{
        backgroundColor: '#fffaf3',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#0f172a',
        fontFamily: "'Fredoka', 'Plus Jakarta Sans', sans-serif",
        position: 'relative',
        paddingTop: '150px',
        paddingBottom: '80px',
      }}
    >
      <div style={{ flex: 1, padding: '0 24px', maxWidth: '860px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            padding: ' clamp(28px, 4vw, 48px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
            border: '2px solid #e2e8f0',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '36px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
            <Link 
              to="/terms" 
              style={{ 
                textDecoration: 'none', 
                fontWeight: 800, 
                fontSize: '14px',
                padding: '10px 22px',
                borderRadius: '9999px',
                backgroundColor: !isPrivacy ? '#ff3b69' : '#f8fafc',
                color: !isPrivacy ? '#ffffff' : '#64748b',
                border: !isPrivacy ? '2px solid #ff3b69' : '2px solid #e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              Terms & Conditions
            </Link>
            <Link 
              to="/privacy" 
              style={{ 
                textDecoration: 'none', 
                fontWeight: 800, 
                fontSize: '14px',
                padding: '10px 22px',
                borderRadius: '9999px',
                backgroundColor: isPrivacy ? '#ff3b69' : '#f8fafc',
                color: isPrivacy ? '#ffffff' : '#64748b',
                border: isPrivacy ? '2px solid #ff3b69' : '2px solid #e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              Privacy Policy
            </Link>
          </div>

          <div style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {!isPrivacy ? (
              // TERMS AND CONDITIONS
              <>
                <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                  Terms & Conditions
                </h1>
                <p style={{ color: '#ff3b69', marginBottom: '28px', fontSize: '13px', fontWeight: 800 }}>
                  HAXLR8 3.0 // Official Flight Directives • October 2026
                </p>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  1. Acceptance of Terms
                </h2>
                <p>By registering for and participating in HAXLR8 3.0, hosted by Maharaja Institute of Technology Mysore, you agree to abide by these Terms and Conditions. If you do not agree with any part of these terms, you may not participate in the event.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  2. Eligibility & Team Formation
                </h2>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Participation is open to undergraduate students from any recognized college or university across India.</li>
                  <li>Teams must consist of exactly 3 to 4 members. Solo participation or 2-member teams are strictly not permitted.</li>
                  <li>Inter-college teams are permitted. Team members may belong to different departments or educational institutions.</li>
                  <li>Participants must present a valid college ID card to verify undergraduate status and eligibility at check-in.</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  3. Event Rules & Domains
                </h2>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Project Scope:</strong> Projects must align with the official domains: <strong>AI / ML</strong>, <strong>Cybersecurity</strong>, <strong>IoT & Embedded Systems</strong>, <strong>Web & App Development</strong>, or <strong>Open Innovation</strong>.</li>
                  <li><strong>Development Window:</strong> Software application development must occur during the hackathon period. The use of completely pre-built projects is prohibited.</li>
                  <li><strong>Hardware/IoT Exception:</strong> Teams building hardware solutions may procure, assemble, and test physical microcontrollers/sensors beforehand, but software integration and prototype testing must happen during the hackathon.</li>
                  <li><strong>AI Assistance:</strong> Use of modern developer tools and AI coding assistants is permitted to accelerate prototyping.</li>
                  <li><strong>Originality:</strong> Direct copies of existing public projects without substantial original contribution will be disqualified.</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  4. Intellectual Property
                </h2>
                <p>Teams retain full ownership of the intellectual property (IP), code, and prototypes created during the hackathon. By participating, you grant HAXLR8 3.0 and MIT Mysore a non-exclusive license to feature project descriptions and media for promotional and academic reporting purposes.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  5. Offline Finale at MIT Mysore
                </h2>
                <p>Shortlisted teams must attend the grand finale on November 6–7, 2026 at Maharaja Institute of Technology Mysore. Participants are responsible for their own devices and hardware equipment.</p>
              </>
            ) : (
              // PRIVACY POLICY
              <>
                <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                  Privacy Policy
                </h1>
                <p style={{ color: '#ff3b69', marginBottom: '28px', fontSize: '13px', fontWeight: 800 }}>
                  HAXLR8 3.0 // Data Telemetry Protocols • October 2026
                </p>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  1. Information We Collect
                </h2>
                <p>To facilitate HAXLR8 3.0 at Maharaja Institute of Technology Mysore, we collect personal information from participants during registration:</p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <li><strong>Identity Data:</strong> Full name, phone number, and email address.</li>
                  <li><strong>Academic Data:</strong> College name, department, and university registration numbers.</li>
                  <li><strong>Verification Media:</strong> Digital image uploads of official college ID cards.</li>
                  <li><strong>Technical Data:</strong> Essential session authentication tokens managed via Supabase.</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  2. How We Use Your Information
                </h2>
                <p>Collected telemetry is used exclusively for event administration, team verification, shortlisting, and official updates.</p>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '28px', marginBottom: '10px' }}>
                  3. Data Security & Retention
                </h2>
                <p>All participant data is encrypted and stored safely. We do not sell or monetize personal information. Data is retained only for the duration needed to evaluate and conduct the event.</p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
