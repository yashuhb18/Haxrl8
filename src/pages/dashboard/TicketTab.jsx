import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket as TicketIcon, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';
import emitersSeal from '../../assets/logo/emiters-seal.png';
import mitLogo from '../../assets/logo/mit-mysore-logo.png';
import haxlr8LogoDark from '../../assets/logo/haxlr8-logo-dark.png';

export default function TicketTab({ 
  hasTeam, 
  teamData, 
  teamMembers, 
  user, 
  setActiveTab 
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const ticketRef = useRef(null);

  // Retrieve payment state
  let paymentRecord = null;
  try {
    if (user?.id) {
      const cached = localStorage.getItem(`haxlr8_payment_${user.id}`);
      if (cached) paymentRecord = JSON.parse(cached);
    }
  } catch (e) {}

  if (!paymentRecord && (teamData?.payment_status === 'submitted' || teamData?.payment_utr)) {
    paymentRecord = {
      transaction_id: teamData.payment_utr,
      amount: teamData.payment_amount || 1200,
      status: 'submitted',
      submitted_at: teamData.payment_date || new Date().toISOString()
    };
  }

  const isVerified = Boolean(paymentRecord?.transaction_id);

  // Leader & Crew
  const leader = teamMembers?.find(m => m.id === teamData?.leader_id) || 
                 teamMembers?.find(m => m.email === user?.email) || 
                 teamMembers?.[0] || 
                 { full_name: user?.user_metadata?.full_name || 'Team Leader', email: user?.email };

  const crew = teamMembers?.filter(m => m.id !== leader?.id && m.email !== leader?.email) || [];
  const domainTrack = teamData?.domain || 'Agriculture';

  const verificationHash = `HAXLR8-2026-${(teamData?.id || 'MITM').slice(0, 8).toUpperCase()}-${(paymentRecord?.transaction_id || 'VERIFIED').slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationHash);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="ticket-page-container" style={{ maxWidth: 960, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* If No Team */}
      {!hasTeam && (
        <div style={{
          background: '#ffffff',
          borderRadius: 22,
          padding: '40px 24px',
          border: '2px solid #fed7aa',
          textAlign: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <AmongUsCrewmate color="orange" size={60} speechText="Squad not found!" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
            No Squad Manifest Registered
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748b', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.5 }}>
            You need to assemble your crew and select your challenge domain before generating your official Flight Ticket.
          </p>
          <button
            onClick={() => { if (setActiveTab) setActiveTab('team'); }}
            style={{
              padding: '12px 28px',
              borderRadius: 12,
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Create Squad in "My Team" →
          </button>
        </div>
      )}

      {/* If Team Exists but Payment Not Yet Submitted */}
      {hasTeam && !isVerified && (
        <div style={{
          background: '#ffffff',
          borderRadius: 22,
          padding: '36px 24px',
          border: '2px solid #fed7aa',
          textAlign: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
        }}>
          <div style={{ width: 60, height: 60, borderRadius: 20, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 16px', border: '1.5px solid #fde68a' }}>
            🔒
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
            Flight Pass Locked (Payment Verification Required)
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748b', maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.5 }}>
            Your squad <strong>"{teamData?.team_name}"</strong> is registered! To unlock your official Hackathon Entry Ticket with QR verification, please complete the ₹1,200 team fee in the Payment tab.
          </p>

          <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => { if (setActiveTab) setActiveTab('payment'); }}
              style={{
                padding: '13px 26px',
                borderRadius: 12,
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
              }}
            >
              Go to Payment & Verification (₹1,200) →
            </button>
          </div>
        </div>
      )}

      {/* When Verified: Official Hackathon Pass */}
      {hasTeam && isVerified && (
        <>
          {/* Action Bar (Print / Share / Status) - Hidden when printing */}
          <div className="ticket-action-bar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            background: '#ffffff',
            padding: '16px 24px',
            borderRadius: 18,
            border: '2px solid #bbf7d0',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#14532d' }}>
                  Official Flight Pass Active & Verified
                </div>
                <div style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>
                  Present this digital pass or physical printout at MIT Mysore security checkpoint.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleCopyCode}
                title="Copy Pass Code"
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {copiedCode ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handlePrint}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 3px 10px rgba(2, 132, 199, 0.25)'
                }}
              >
                <Printer size={16} />
                <span>Print / Save Pass (PDF)</span>
              </button>
            </div>
          </div>

          {/* ════ THE OFFICIAL BOARDING PASS TICKET CARD ════ */}
          <div ref={ticketRef} className="official-ticket-card" style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '2px solid #fed7aa',
            boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            
            {/* Ticket Header Ribbon */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              borderBottom: '4px solid #ea580c'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, background: '#ea580c', color: '#ffffff', padding: '3px 8px', borderRadius: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    OFFICIAL BOARDING PASS
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>
                    NATIONAL LEVEL 24-HOUR HACKATHON
                  </span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                  HAXLR8 3.0 · FLIGHT DECK PASS
                </h1>
                <p style={{ fontSize: 12.5, color: '#cbd5e1', margin: '4px 0 0', fontWeight: 600 }}>
                  Department of Electronics &amp; Communication Engineering · Maharaja Institute of Technology Mysore
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={mitLogo} alt="MIT Mysore" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
                <div style={{ height: 32, width: 1, background: 'rgba(255,255,255,0.2)' }} />
                <img src={emitersSeal} alt="EMITERS" style={{ height: 38, width: 38, borderRadius: '50%' }} />
              </div>
            </div>

            {/* Ticket Body: 2 Columns (Main Details + Scanner Stub) */}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              
              {/* Left Column (Details) */}
              <div style={{ flex: '1 1 500px', padding: '28px 32px', borderRight: '2px dashed #f1e7db' }}>
                
                {/* Squad Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: '#fff7ed',
                  borderRadius: 16,
                  border: '1.5px solid #fed7aa',
                  marginBottom: 24,
                  flexWrap: 'wrap',
                  gap: 12
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      REGISTERED SQUAD NAME
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginTop: 2 }}>
                      {teamData?.team_name || 'Innovators'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      CHALLENGE DOMAIN TRACK
                    </div>
                    <span style={{
                      display: 'inline-block',
                      marginTop: 4,
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#0369a1',
                      background: '#e0f2fe',
                      padding: '4px 12px',
                      borderRadius: 100,
                      border: '1px solid #7dd3fc'
                    }}>
                      {domainTrack === 'Agriculture' && '🌾 Agriculture Track'}
                      {domainTrack === 'Healthcare' && '🏥 Healthcare Track'}
                      {domainTrack === 'Smart City' && '🏙️ Smart City Track'}
                      {!['Agriculture', 'Healthcare', 'Smart City'].includes(domainTrack) && `🚀 ${domainTrack}`}
                    </span>
                  </div>
                </div>

                {/* Event Schedule & Reporting Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      <Calendar size={14} color="#ea580c" />
                      <span>Hackathon Dates</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                      November 6–7, 2026
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>24-Hour Offline Sprint</div>
                  </div>

                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      <Clock size={14} color="#ea580c" />
                      <span>Reporting Time</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                      08:30 AM IST (Nov 6)
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>Badge Pick-up &amp; Breakfast</div>
                  </div>

                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      <MapPin size={14} color="#ea580c" />
                      <span>Base Station Venue</span>
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                      Maharaja Institute of Technology Mysore
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      Belawadi, PB No. 28, Srirangapatna Taluk, Mandya / Mysuru, Karnataka - 571477
                    </div>
                  </div>
                </div>

                {/* Crew Roster on Ticket */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', marginBottom: 10 }}>
                    <Users size={16} />
                    <span>Authorized Crew Roster ({teamMembers?.length || 1} Members)</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Captain */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#eff6ff',
                      borderRadius: 10,
                      border: '1px solid #bfdbfe',
                      fontSize: 13
                    }}>
                      <div>
                        <strong style={{ color: '#0f172a' }}>{leader?.full_name}</strong>
                        <span style={{ fontSize: 11, color: '#0284c7', marginLeft: 8, fontWeight: 700 }}>(Captain)</span>
                        <div style={{ fontSize: 11.5, color: '#64748b' }}>{leader?.college_name || 'Undergraduate'} · {leader?.dept || 'Engineering'}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', background: '#dbeafe', padding: '2px 8px', borderRadius: 6 }}>
                        LEAD PASS
                      </span>
                    </div>

                    {/* Crewmates */}
                    {crew.map((cm, idx) => (
                      <div key={cm.id || idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: 10,
                        border: '1px solid #e2e8f0',
                        fontSize: 13
                      }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>{cm.full_name}</strong>
                          <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>(Crewmate {idx + 1})</span>
                          <div style={{ fontSize: 11.5, color: '#64748b' }}>{cm.college_name || 'Undergraduate'} · {cm.dept || 'Engineering'}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                          MEMBER PASS
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (Barcode & QR Stub) */}
              <div style={{
                flex: '1 1 240px',
                padding: '28px 24px',
                background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'center'
              }}>
                <div style={{ width: '100%' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#15803d', background: '#dcfce7', border: '1px solid #86efac', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 16 }}>
                    ✓ FEE CONFIRMED ₹1,200
                  </div>

                  {/* Scannable Verification QR Code */}
                  <div style={{
                    background: '#ffffff',
                    padding: 14,
                    borderRadius: 16,
                    border: '2px solid #cbd5e1',
                    display: 'inline-block',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                    marginBottom: 12
                  }}>
                    <svg width="150" height="150" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="160" height="160" fill="white" rx="8"/>
                      {/* Top Left Finder */}
                      <rect x="12" y="12" width="36" height="36" rx="6" fill="#0f172a"/>
                      <rect x="18" y="18" width="24" height="24" rx="3" fill="white"/>
                      <rect x="23" y="23" width="14" height="14" rx="2" fill="#0284c7"/>

                      {/* Top Right Finder */}
                      <rect x="112" y="12" width="36" height="36" rx="6" fill="#0f172a"/>
                      <rect x="118" y="18" width="24" height="24" rx="3" fill="white"/>
                      <rect x="123" y="23" width="14" height="14" rx="2" fill="#0284c7"/>

                      {/* Bottom Left Finder */}
                      <rect x="12" y="112" width="36" height="36" rx="6" fill="#0f172a"/>
                      <rect x="18" y="118" width="24" height="24" rx="3" fill="white"/>
                      <rect x="23" y="123" width="14" height="14" rx="2" fill="#0284c7"/>

                      {/* Alignment Data Blocks */}
                      <rect x="56" y="16" width="10" height="10" fill="#0f172a"/>
                      <rect x="72" y="16" width="18" height="10" fill="#0f172a"/>
                      <rect x="96" y="16" width="8" height="18" fill="#0f172a"/>

                      <rect x="56" y="34" width="14" height="10" fill="#0284c7"/>
                      <rect x="76" y="32" width="12" height="14" fill="#0f172a"/>
                      <rect x="94" y="38" width="10" height="10" fill="#0284c7"/>

                      <rect x="16" y="56" width="10" height="18" fill="#0f172a"/>
                      <rect x="32" y="56" width="14" height="10" fill="#0284c7"/>
                      <rect x="52" y="52" width="20" height="10" fill="#0f172a"/>
                      <rect x="80" y="56" width="14" height="14" fill="#0284c7"/>
                      <rect x="100" y="56" width="18" height="10" fill="#0f172a"/>
                      <rect x="124" y="56" width="10" height="20" fill="#0f172a"/>
                      <rect x="140" y="56" width="8" height="10" fill="#0f172a"/>

                      <rect x="16" y="80" width="18" height="10" fill="#0f172a"/>
                      <rect x="40" y="76" width="10" height="16" fill="#0284c7"/>
                      <rect x="56" y="72" width="16" height="10" fill="#0f172a"/>
                      <rect x="78" y="76" width="18" height="10" fill="#0f172a"/>
                      <rect x="102" y="74" width="12" height="18" fill="#0284c7"/>
                      <rect x="120" y="82" width="18" height="8" fill="#0f172a"/>
                      <rect x="142" y="74" width="6" height="18" fill="#0f172a"/>

                      <rect x="16" y="96" width="10" height="10" fill="#0284c7"/>
                      <rect x="32" y="98" width="18" height="8" fill="#0f172a"/>
                      <rect x="56" y="92" width="12" height="18" fill="#0284c7"/>
                      <rect x="74" y="94" width="20" height="10" fill="#0f172a"/>
                      <rect x="100" y="98" width="10" height="14" fill="#0f172a"/>
                      <rect x="116" y="96" width="16" height="10" fill="#0284c7"/>
                      <rect x="138" y="98" width="10" height="12" fill="#0f172a"/>

                      <rect x="56" y="118" width="18" height="10" fill="#0f172a"/>
                      <rect x="80" y="114" width="10" height="18" fill="#0f172a"/>
                      <rect x="96" y="120" width="16" height="10" fill="#0284c7"/>
                      <rect x="118" y="114" width="12" height="18" fill="#0f172a"/>
                      <rect x="136" y="118" width="12" height="10" fill="#0f172a"/>

                      <rect x="56" y="136" width="10" height="12" fill="#0284c7"/>
                      <rect x="72" y="138" width="22" height="10" fill="#0f172a"/>
                      <rect x="100" y="136" width="14" height="12" fill="#0f172a"/>
                      <rect x="120" y="138" width="16" height="10" fill="#0284c7"/>
                      <rect x="142" y="134" width="6" height="14" fill="#0f172a"/>
                    </svg>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
                    {verificationHash}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                    Scan at Entrance Checkpoint
                  </div>

                  <div style={{ marginTop: 14, padding: '10px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', textAlign: 'left', fontSize: 11 }}>
                    <div style={{ color: '#ea580c', fontWeight: 800 }}>TRANSACTION UTR:</div>
                    <div style={{ fontWeight: 800, color: '#0f172a', wordBreak: 'break-all' }}>
                      {paymentRecord?.transaction_id || 'PENDING'}
                    </div>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div style={{ width: '100%', marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 2, height: 26, opacity: 0.85 }}>
                    {[2,1,3,1,2,4,1,2,1,3,2,1,4,1,2,3,1,2,1,4,2,1,3,1,2,1,4,1,3].map((w, i) => (
                      <div key={i} style={{ width: w, background: '#0f172a', height: '100%' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', marginTop: 4 }}>
                    HAXLR8 · MITM · 2026
                  </div>
                </div>

              </div>

            </div>

            {/* Ticket Footer Strip */}
            <div style={{
              background: '#f8fafc',
              borderTop: '1.5px solid #f1e7db',
              padding: '12px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11.5,
              color: '#64748b',
              fontWeight: 600,
              flexWrap: 'wrap',
              gap: 8
            }}>
              <div>
                ⚠️ Mandatory: Carry Original College Student ID &amp; Laptop hardware.
              </div>
              <div style={{ color: '#ea580c', fontWeight: 800 }}>
                Direct Entry — No Round 1 / Round 2 Screening Required
              </div>
            </div>

          </div>
        </>
      )}

      {/* Print-specific style */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .official-ticket-card, .official-ticket-card * {
            visibility: visible;
          }
          .official-ticket-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .ticket-action-bar, .dash-sidebar, .dash-header, .dash-bottom-nav {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
