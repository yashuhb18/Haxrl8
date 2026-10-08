import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OfficialPPT from '../../assets/PPT/SRCAS HACKATHON 3.0.pptx';
import ProblemStatementPDF from '../../assets/PS_example/Hackathon Problem Statement 2026.pdf';

const RESOURCES = [
  { icon: '💳', label: 'Payment Google Form', desc: 'Official Google Form link for ₹1,200 fee & UTR submission', tag: 'G-FORM', href: 'https://forms.gle/pw945ievXT9bH1wV7', target: '_blank', color: '#ff3b69', bg: '#fef2f2', border: '#fecaca' },
  { icon: '📄', label: 'Hackathon Rulebook', desc: 'Official rules and judging criteria', tag: 'PDF', href: '#', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  { icon: '🧩', label: 'Sample Problem Statements', desc: 'Download sample problem statements for 2026', tag: 'PDF', href: ProblemStatementPDF, download: 'HAXLR8-Problem-Statements-2026.pdf', color: '#0284c7', bg: '#eff6ff', border: '#bfdbfe' },
  { icon: '👑', label: 'Leader vs. Impostor Protocol', desc: 'Official flight manifest rules & role guide', tag: 'GUIDE', href: '#leader-protocol', color: '#9333ea', bg: '#fdf4ff', border: '#f5d0fe' },
  { icon: '🏆', label: 'Prize Bounty Breakdown', desc: 'Learn about the ₹30,000 cash prizes & awards', tag: 'AWARDS', href: '/prizes', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
];

const FAQS = [
  {
    q: "How do I register?",
    a: (
      <>
        You can register through the official hackathon registration portal at{" "}
        <a
          href="/register"
          style={{ color: '#ff3b69', textDecoration: 'underline', fontWeight: 700 }}
        >
          the registration page
        </a>
        . Only the Team Leader needs to register. Once logged in, the leader selects the domain, adds 3–4 crew members in the My Team tab, and completes payment verification.
      </>
    ),
  },
  {
    q: "Who can participate in HAXLR8 3.0?",
    a: "The hackathon is open to undergraduate students from any recognized college or university across India. Inter-college teams are officially permitted.",
  },
  {
    q: "How many team members do I need?",
    a: "Each team must consist of 3 to 4 members. Solo participation or 2-member teams are strictly not permitted.",
  },
  {
    q: "Can team members be from different colleges?",
    a: "Yes! Inter-college teams are permitted. Undergraduate students from any college or university are allowed to collaborate and form teams for HAXLR8 3.0.",
  },
  {
    q: "Is there a registration fee?",
    a: "Yes, the registration fee is ₹1,200 per team (for 3 to 4 members). It covers complete 24-hour hackathon entry, Wi-Fi, mentorship, catering, meals, and official certificates.",
  },
  {
    q: "What should I bring to HAXLR8 3.0 at MIT Mysore?",
    a: "Please bring your laptop, charger, required hardware/IoT sensors, student ID card, and enthusiasm. Refreshments, Wi-Fi, and workspace will be provided at Maharaja Institute of Technology Mysore.",
  },
  {
    q: "Are we allowed to use AI tools or \"vibe code\" during the hackathon?",
    a: "Yes! \"Vibe coding\" (using AI assistants to generate and shape your code) is officially allowed during the 24-hour hackathon. We encourage using modern tools to build faster, as long as the actual development and logic are implemented during the event.",
  },
  {
    q: "We are building an IoT/Hardware project. Do we have to build hardware from scratch?",
    a: "No. Hardware teams may procure and test components beforehand. However, software development and complete end-to-end integration must take place during the 24-hour offline hackathon.",
  },
  {
    q: "How are the winners selected?",
    a: "Projects will be evaluated by industry judges and academic experts based on innovation (25%), domain impact (25%), technical complexity (25%), and presentation & feasibility (25%).",
  },
  {
    q: "Will the hackathon be in person or online?",
    a: "HAXLR8 3.0 is a 100% in-person 24-hour Grand Hackathon hosted at Maharaja Institute of Technology Mysore on November 6–7, 2026. There are no screening or elimination rounds—all registered teams advance directly!",
  },
];

const STATUS_STYLE = {
  done:     { dot: '#16a34a', line: '#16a34a', label: 'Completed',   labelColor: '#16a34a', labelBg: '#dcfce7' },
  active:   { dot: '#ff3b69', line: '#fed7aa', label: 'In Progress', labelColor: '#ff3b69', labelBg: '#ffe4e6' },
  upcoming: { dot: '#cbd5e1', line: '#e2e8f0', label: 'Upcoming',   labelColor: '#64748b', labelBg: '#f1f5f9' },
};

export default function ResourcesTab({ hasTeam, submissions }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [showRulebook, setShowRulebook] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const hasSubmitted = submissions?.length > 0;

  useEffect(() => {
    if (showRulebook || showProtocol) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showRulebook, showProtocol]);

  const EVENTS = [
    { date: 'Oct 09', event: 'Registration Opens', status: 'done', desc: 'Team registration opens for undergraduate students.', time: 'All day' },
    { date: 'Oct 28', event: 'Squad & Fee Lock', status: hasTeam ? 'done' : 'active', desc: 'Assemble 3–4 members, pay ₹1,200 team fee, & submit verification.', time: '11:59 PM IST' },
    { date: 'Nov 02', event: 'Flight Pass Clearance', status: hasTeam ? 'active' : 'upcoming', desc: 'Download your official 24-hour hackathon entry boarding pass.', time: '12:00 PM IST' },
    { date: 'Nov 06–07', event: 'Grand Finale', status: 'upcoming', desc: '24-hour offline hackathon finale and prize ceremony at MIT Mysore.', time: '08:30 AM IST' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Resources grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff3b69' }} />
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Official Mission Artifacts &amp; Resources
          </h2>
        </div>

        <div className="dash-grid-resources" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
          {RESOURCES.map((r, i) => (
            <a
              key={i}
              href={r.href}
              download={r.download}
              target={r.target || (r.href?.startsWith('http') ? '_blank' : undefined)}
              rel={r.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (r.label === 'Hackathon Rulebook') {
                  e.preventDefault();
                  setShowRulebook(true);
                } else if (r.label === 'Leader vs. Impostor Protocol') {
                  e.preventDefault();
                  setShowProtocol(true);
                }
              }}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div 
                style={{ 
                  background: '#ffffff', 
                  borderRadius: 20, 
                  padding: '22px', 
                  border: `2px solid ${r.border}`, 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 12, 
                  flex: 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 24px rgba(0,0,0,0.08)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 32 }}>{r.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: r.color, background: r.bg, border: `1px solid ${r.border}`, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {r.tag}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{r.label}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5 }}>{r.desc}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ea580c' }} />
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Full Event Schedule &amp; Milestones
          </h2>
        </div>

        <div className="dash-card" style={{ background: '#ffffff', borderRadius: 22, padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '2px solid #fed7aa' }}>
          {EVENTS.map((ev, i) => {
            const s = STATUS_STYLE[ev.status];
            return (
              <div key={i} style={{ display: 'flex', gap: 18, paddingBottom: i < EVENTS.length - 1 ? 24 : 0, position: 'relative' }}>
                {i < EVENTS.length - 1 && (
                  <div style={{ position: 'absolute', left: 11, top: 24, width: 2, bottom: 0, background: '#f1e7db' }}>
                    <div style={{ width: '100%', height: EVENTS[i].status === 'done' ? '100%' : '0%', background: '#16a34a', transition: 'height 0.4s ease' }} />
                  </div>
                )}
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.dot, flexShrink: 0, zIndex: 1, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: ev.status === 'active' ? '0 0 10px rgba(255, 59, 105, 0.4)' : 'none' }}>
                  {ev.status === 'done' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{ev.event}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: s.labelColor, background: s.labelBg, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#ff3b69', fontWeight: 700, marginBottom: 4 }}>{ev.date} · {ev.time}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{ev.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284c7' }} />
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: 16, border: '1.5px solid #fed7aa', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}
              >
                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a' }}>{f.q}</span>
                <span style={{ fontSize: 18, color: '#ff3b69', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontWeight: 900 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 18px', fontSize: 13.5, color: '#475569', lineHeight: 1.6, borderTop: '1px solid #f1e7db', paddingTop: 14 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rulebook Modal */}
      <AnimatePresence>
        {showRulebook && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#ffffff', border: '2px solid #fed7aa', borderRadius: 24, width: '100%', maxWidth: 640, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #f1e7db', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffaf3' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>📜 HAXLR8 3.0 Flight Rulebook</div>
                <button onClick={() => setShowRulebook(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto', fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
                <h4 style={{ color: '#0f172a', fontWeight: 900, margin: '0 0 6px' }}>1. Team Composition &amp; Eligibility</h4>
                <p>Squads must consist of 3 to 4 undergraduate students. Inter-college and inter-branch teams are 100% permitted. All participants must carry official college identity cards.</p>

                <h4 style={{ color: '#0f172a', fontWeight: 900, margin: '0 0 6px' }}>2. 24-Hour Offline Hackathon</h4>
                <p>The finale will be conducted live on campus at Maharaja Institute of Technology Mysore on November 06–07, 2026. High-speed Wi-Fi, power workstations, meals, and midnight snacks are provided.</p>

                <h4 style={{ color: '#0f172a', fontWeight: 900, margin: '0 0 6px' }}>3. Evaluation &amp; Judging (100 Points)</h4>
                <ul style={{ paddingLeft: 20 }}>
                  <li>Innovation &amp; Originality (25%)</li>
                  <li>Technical Feasibility &amp; Depth (25%)</li>
                  <li>Real-world Impact &amp; Scalability (25%)</li>
                  <li>Live Pitch &amp; Working Demonstration (25%)</li>
                </ul>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1.5px solid #f1e7db', display: 'flex', justifyContent: 'flex-end', background: '#fafafa' }}>
                <button onClick={() => setShowRulebook(false)} style={{ padding: '10px 20px', borderRadius: 12, background: '#ff3b69', color: '#fff', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Leader vs Impostor Protocol Modal */}
      <AnimatePresence>
        {showProtocol && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#ffffff', border: '2px solid #fed7aa', borderRadius: 24, width: '100%', maxWidth: 640, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #f1e7db', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffaf3' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>👑 Leader vs. Impostor Protocol</div>
                <button onClick={() => setShowProtocol(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '70vh', overflowY: 'auto', fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 16, padding: '16px' }}>
                  <h4 style={{ color: '#166534', fontWeight: 900, margin: '0 0 6px' }}>👑 Team Leader (Squad Commander)</h4>
                  <p style={{ margin: 0, color: '#15803d' }}>Only the designated Team Leader creates an account. The leader selects the domain track, registers 3–4 squad members, completes the ₹1,200 team payment, and receives official passes &amp; announcements.</p>
                </div>

                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 16, padding: '16px' }}>
                  <h4 style={{ color: '#991b1b', fontWeight: 900, margin: '0 0 6px' }}>🚨 Squad Member / "The Impostor"</h4>
                  <p style={{ margin: 0, color: '#b91c1c' }}>Squad members do NOT need separate accounts! Your team leader enrolls your college ID and email directly into the squad manifest. Anyone attempting to register separately without being a team captain is flagged as an Impostor!</p>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1.5px solid #f1e7db', display: 'flex', justifyContent: 'flex-end', background: '#fafafa' }}>
                <button onClick={() => setShowProtocol(false)} style={{ padding: '10px 20px', borderRadius: 12, background: '#ff3b69', color: '#fff', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
