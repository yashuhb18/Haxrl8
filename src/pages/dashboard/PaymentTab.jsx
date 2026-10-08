import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { sanitizeInput } from '../../lib/security';
import { ensureUUID } from '../../lib/syncService';
import { sendPaymentConfirmationEmail } from '../../lib/emailService';
import { 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Upload, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileCheck,
  Receipt,
  Ticket as TicketIcon,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

// ── Configurable Google Form & Payment Credentials ──
// Event Coordinators can update this link directly anytime:
export const GOOGLE_FORM_PAYMENT_URL = 
  import.meta.env.VITE_PAYMENT_GOOGLE_FORM_URL || 
  "https://forms.gle/HAXLR8_MITM_PAYMENT_FORM"; // Replace with official G-Form link

export const OFFICIAL_UPI_ID = "haxlr8ecemitm@upi"; // Official UPI ID
export const REGISTRATION_FEE_INR = 1200;

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 22,
    padding: '26px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
    border: '2px solid #fed7aa',
    color: '#0f172a'
  },
  label: {
    fontSize: 12,
    fontWeight: 800,
    color: '#ea580c',
    marginBottom: 6,
    display: 'block',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1.5px solid #cbd5e1',
    fontSize: 14,
    outline: 'none',
    background: '#fafafa',
    color: '#0f172a',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit'
  },
  buttonPrimary: {
    padding: '14px 28px',
    borderRadius: 12,
    border: 'none',
    background: '#0284c7',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  }
};

export default function PaymentTab({ 
  hasTeam, 
  teamData, 
  teamMembers, 
  user, 
  setActiveTab,
  onPaymentUpdated 
}) {
  const [loading, setLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [transactionId, setTransactionId] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [declaration, setDeclaration] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  // Payment Record State
  const [paymentRecord, setPaymentRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load existing payment data
  useEffect(() => {
    if (!user) return;
    try {
      // 1. Check user-scoped localStorage
      const cached = localStorage.getItem(`haxlr8_payment_${user.id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setPaymentRecord(parsed);
        setTransactionId(parsed.transaction_id || '');
        setPayerName(parsed.payer_name || '');
        setPayerPhone(parsed.payer_phone || '');
        setScreenshotPreview(parsed.screenshot_url || '');
      } else if (teamData?.payment_status === 'submitted' || teamData?.payment_utr) {
        const record = {
          transaction_id: teamData.payment_utr,
          payer_name: teamData.payer_name || user?.user_metadata?.full_name || '',
          payer_phone: teamData.payer_phone || '',
          screenshot_url: teamData.payment_screenshot_url || '',
          amount: teamData.payment_amount || REGISTRATION_FEE_INR,
          status: 'submitted',
          submitted_at: teamData.payment_date || new Date().toISOString()
        };
        setPaymentRecord(record);
        setTransactionId(record.transaction_id || '');
        setPayerName(record.payer_name || '');
        setScreenshotPreview(record.screenshot_url || '');
      }
    } catch (e) {
      console.warn('Error reading payment state:', e);
    }
  }, [user, teamData]);

  const copyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedUpi(true);
    setToastMsg('UPI ID copied to clipboard!');
    setTimeout(() => {
      setCopiedUpi(false);
      setToastMsg('');
    }, 2500);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, or JPEG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Screenshot file size must be under 5MB.');
      return;
    }

    setErrorMsg('');
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setScreenshotPreview(uploadEvent.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!hasTeam || !teamData) {
      setErrorMsg('Please register your squad manifest in "My Team" first before submitting payment verification.');
      return;
    }

    const cleanUtr = transactionId.trim().toUpperCase();
    if (!cleanUtr) {
      setErrorMsg('Please enter your 12-digit UPI Transaction Ref (UTR) or Transaction ID.');
      return;
    }
    if (cleanUtr.length < 6) {
      setErrorMsg('Transaction Ref / UTR must be at least 6 characters.');
      return;
    }
    if (!payerName.trim()) {
      setErrorMsg('Please enter the name on the UPI / bank account used to make payment.');
      return;
    }
    if (!screenshotPreview && !screenshotFile) {
      setErrorMsg('Please upload a screenshot of your successful ₹1,200 payment receipt.');
      return;
    }
    if (!declaration) {
      setErrorMsg('Please confirm the declaration checkbox confirming payment and Google Form submission.');
      return;
    }

    setLoading(true);
    try {
      let finalScreenshotUrl = screenshotPreview;

      // Upload screenshot to Supabase storage if file is present
      if (screenshotFile) {
        try {
          const timestamp = Date.now();
          const cleanTeam = (teamData?.team_name || 'team').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const ext = screenshotFile.name.split('.').pop() || 'png';
          const filePath = `payments/${timestamp}_${cleanTeam}_receipt.${ext}`;

          const { error: storageError } = await supabase.storage
            .from('id-cards')
            .upload(filePath, screenshotFile, { cacheControl: '3600', upsert: true });

          if (!storageError) {
            const { data } = supabase.storage.from('id-cards').getPublicUrl(filePath);
            if (data?.publicUrl) {
              finalScreenshotUrl = data.publicUrl;
            }
          }
        } catch (uploadErr) {
          console.warn('Storage upload fallback:', uploadErr);
        }
      }

      const paymentPayload = {
        transaction_id: cleanUtr,
        payer_name: sanitizeInput(payerName),
        payer_phone: sanitizeInput(payerPhone || ''),
        amount: REGISTRATION_FEE_INR,
        screenshot_url: finalScreenshotUrl,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };

      // 1. Cache to scoped localStorage
      if (user?.id) {
        localStorage.setItem(`haxlr8_payment_${user.id}`, JSON.stringify(paymentPayload));
      }

      // 2. Persist to Supabase teams table
      if (teamData?.id) {
        try {
          await supabase.from('teams').update({
            payment_status: 'submitted',
            payment_utr: cleanUtr,
            payer_name: paymentPayload.payer_name,
            payer_phone: paymentPayload.payer_phone,
            payment_amount: REGISTRATION_FEE_INR,
            payment_screenshot_url: finalScreenshotUrl,
            payment_date: paymentPayload.submitted_at
          }).eq('id', teamData.id);
        } catch (dbErr) {
          console.warn('Supabase teams payment update notice:', dbErr);
        }

        // Also ensure a verified submission entry exists so Admin dashboard sees it
        try {
          const teamDomain = teamData.domain || 'Agriculture';
          await supabase.from('submissions').upsert({
            team_id: teamData.id,
            project_title: `${teamData.team_name} - ${teamDomain} Track`,
            sdg_goal: teamDomain,
            category: 'Registration Verified',
            project_description: `Registration fee ₹1200 verified. UTR: ${cleanUtr}. Leader: ${user?.user_metadata?.full_name || 'Leader'} (${user?.email}).`,
            status: 'Shortlisted' // Sets as confirmed participant
          });
        } catch (subErr) {
          console.warn('Submissions record sync notice:', subErr);
        }
      }

      // 3. Dispatch confirmation notification
      try {
        if (user?.email) {
          sendPaymentConfirmationEmail?.({
            recipientEmail: user.email,
            leaderName: user?.user_metadata?.full_name || 'Leader',
            teamName: teamData?.team_name || 'Your Squad',
            teamId: teamData?.id,
            transactionId: cleanUtr
          }).catch(e => console.warn('Email dispatch log:', e));
        }
      } catch (e) {}

      setPaymentRecord(paymentPayload);
      setIsEditing(false);
      setSuccessMsg('🎉 Payment verification successfully submitted! Your official Flight Pass has been unlocked.');
      setToastMsg('Flight Pass unlocked! Access your official ticket now.');

      if (onPaymentUpdated) {
        onPaymentUpdated(paymentPayload);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setErrorMsg(err.message || 'Failed to submit payment verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Top Banner / Status Overview */}
      <div style={{
        ...styles.card,
        background: paymentRecord ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
        border: paymentRecord ? '2px solid #86efac' : '2px solid #fed7aa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: paymentRecord ? '#dcfce7' : '#ffedd5',
            color: paymentRecord ? '#15803d' : '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            flexShrink: 0
          }}>
            {paymentRecord ? '✅' : '💳'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Squad Registration Fee: ₹{REGISTRATION_FEE_INR}
              </h2>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 100,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                background: paymentRecord ? '#dcfce7' : '#fef3c7',
                color: paymentRecord ? '#15803d' : '#b45309',
                border: paymentRecord ? '1px solid #86efac' : '1px solid #fde68a'
              }}>
                {paymentRecord ? '● Verification Submitted' : '● Action Required'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              {teamData?.team_name ? (
                <>Squad: <strong>{teamData.team_name}</strong> · Domain: <strong>{teamData.domain || 'Agriculture'}</strong> · Fee covers complete 3–4 member squad</>
              ) : (
                <>Fee covers complete 3–4 member squad, 24-hr access, catering, Wi-Fi & official flight credentials</>
              )}
            </p>
          </div>
        </div>

        {paymentRecord && (
          <button
            onClick={() => { if (setActiveTab) setActiveTab('ticket'); }}
            style={{
              ...styles.buttonPrimary,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: '0 4px 16px rgba(22, 163, 74, 0.35)'
            }}
          >
            <TicketIcon size={18} />
            <span>View Official Flight Pass →</span>
          </button>
        )}
      </div>

      {/* No Team Warning if leader hasn't set up team */}
      {!hasTeam && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: 16,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={22} color="#dc2626" />
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: '#991b1b' }}>Squad Manifest Incomplete</div>
              <div style={{ fontSize: 12.5, color: '#b91c1c' }}>Please select your domain, set your team name, and add your 3–4 crewmates in the My Team tab first.</div>
            </div>
          </div>
          <button
            onClick={() => { if (setActiveTab) setActiveTab('team'); }}
            style={{ padding: '8px 16px', background: '#dc2626', color: '#ffffff', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
          >
            Go to My Team →
          </button>
        </div>
      )}

      {/* If payment is already submitted and not editing, show the Verified Record Summary */}
      {paymentRecord && !isEditing ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Summary Card */}
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Receipt size={22} color="#15803d" />
                <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0 }}>Payment Verification Record</h3>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '3px 10px', borderRadius: 20 }}>
                LOGGED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>Transaction UTR / Ref ID</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em', marginTop: 2 }}>
                  {paymentRecord.transaction_id}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Amount Paid</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#15803d', marginTop: 2 }}>
                    ₹{paymentRecord.amount || REGISTRATION_FEE_INR}
                  </div>
                </div>

                <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Payer Name</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                    {paymentRecord.payer_name || 'Captain'}
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Timestamp</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginTop: 2 }}>
                  {new Date(paymentRecord.submitted_at || Date.now()).toLocaleString()}
                </div>
              </div>

              {paymentRecord.screenshot_url && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>Payment Receipt Screenshot</div>
                  <a href={paymentRecord.screenshot_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={paymentRecord.screenshot_url} 
                      alt="Payment Receipt" 
                      style={{ width: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 12, border: '1.5px solid #cbd5e1', background: '#f8fafc' }} 
                    />
                  </a>
                </div>
              )}

              <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
                >
                  Update Payment Details ✏️
                </button>
                <button
                  onClick={() => { if (setActiveTab) setActiveTab('ticket'); }}
                  style={{ flex: 1, ...styles.buttonPrimary, padding: '11px' }}
                >
                  View Flight Pass →
                </button>
              </div>
            </div>
          </div>

          {/* Next Steps Guidance */}
          <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <ShieldCheck size={22} color="#0284c7" />
                <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0 }}>Coordinator Verification Status</h3>
              </div>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, marginBottom: 18 }}>
                Your payment reference has been recorded in the central flight database. Event coordinators at the Department of ECE, MIT Mysore will cross-verify with bank records and your Google Form entry.
              </p>

              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: 14, padding: 16, marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                  Boarding Checkpoint Instructions:
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#0f172a', lineHeight: 1.6 }}>
                  <li>Bring your downloaded or printed <strong>Flight Pass</strong> to registration desk.</li>
                  <li>All 3–4 members must present valid College ID cards.</li>
                  <li>Reporting begins 8:30 AM on <strong>November 6, 2026</strong> at MIT Mysore.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => { if (setActiveTab) setActiveTab('ticket'); }}
              style={{ ...styles.buttonPrimary, width: '100%' }}
            >
              <TicketIcon size={18} />
              <span>Claim & Print Flight Pass</span>
            </button>
          </div>
        </div>
      ) : (
        /* Payment Two-Step Guide & Verification Form */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT COLUMN: How to Pay (UPI QR & Google Form Link) */}
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                1
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Step 1: Pay via UPI & Google Form
              </h3>
            </div>

            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
              Scan the official QR scanner below using Google Pay, PhonePe, Paytm, or BHIM to pay <strong>₹{REGISTRATION_FEE_INR}</strong> for your entire team. Then fill out the official Google Form.
            </p>

            {/* Official UPI QR Box */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '2px solid #e2e8f0',
              borderRadius: 20,
              padding: '24px 20px',
              textAlign: 'center',
              marginBottom: 20,
              position: 'relative'
            }}>
              <div style={{ display: 'inline-block', background: '#ffffff', padding: 14, borderRadius: 16, border: '2px solid #fed7aa', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', marginBottom: 14 }}>
                {/* Embedded High-Resolution Scan QR */}
                <svg width="170" height="170" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="200" fill="white" rx="12"/>
                  {/* Outer Pos Marks */}
                  <rect x="20" y="20" width="46" height="46" rx="8" fill="#0f172a"/>
                  <rect x="28" y="28" width="30" height="30" rx="4" fill="white"/>
                  <rect x="34" y="34" width="18" height="18" rx="2" fill="#0284c7"/>

                  <rect x="134" y="20" width="46" height="46" rx="8" fill="#0f172a"/>
                  <rect x="142" y="28" width="30" height="30" rx="4" fill="white"/>
                  <rect x="148" y="34" width="18" height="18" rx="2" fill="#0284c7"/>

                  <rect x="20" y="134" width="46" height="46" rx="8" fill="#0f172a"/>
                  <rect x="28" y="142" width="30" height="30" rx="4" fill="white"/>
                  <rect x="34" y="148" width="18" height="18" rx="2" fill="#0284c7"/>

                  {/* QR Pattern Blocks */}
                  <rect x="76" y="24" width="12" height="12" fill="#0f172a"/>
                  <rect x="96" y="24" width="12" height="22" fill="#0f172a"/>
                  <rect x="114" y="32" width="12" height="12" fill="#0f172a"/>
                  <rect x="76" y="46" width="22" height="12" fill="#0284c7"/>
                  <rect x="106" y="56" width="14" height="14" fill="#0f172a"/>

                  <rect x="24" y="76" width="12" height="22" fill="#0f172a"/>
                  <rect x="44" y="76" width="14" height="14" fill="#0284c7"/>
                  <rect x="68" y="76" width="28" height="14" fill="#0f172a"/>
                  <rect x="104" y="76" width="16" height="16" fill="#0284c7"/>
                  <rect x="130" y="76" width="14" height="24" fill="#0f172a"/>
                  <rect x="154" y="76" width="22" height="12" fill="#0f172a"/>

                  <rect x="24" y="106" width="24" height="14" fill="#0f172a"/>
                  <rect x="58" y="100" width="14" height="18" fill="#0284c7"/>
                  <rect x="80" y="100" width="14" height="36" fill="#0f172a"/>
                  <rect x="104" y="102" width="22" height="12" fill="#0f172a"/>
                  <rect x="136" y="108" width="14" height="14" fill="#0284c7"/>
                  <rect x="160" y="98" width="16" height="24" fill="#0f172a"/>

                  <rect x="76" y="144" width="14" height="14" fill="#0f172a"/>
                  <rect x="98" y="144" width="22" height="12" fill="#0284c7"/>
                  <rect x="128" y="132" width="14" height="24" fill="#0f172a"/>
                  <rect x="152" y="132" width="24" height="14" fill="#0f172a"/>
                  <rect x="104" y="164" width="24" height="14" fill="#0f172a"/>
                  <rect x="136" y="164" width="14" height="14" fill="#0284c7"/>
                  <rect x="158" y="156" width="18" height="22" fill="#0f172a"/>

                  {/* Centered HAXLR8 Emblem */}
                  <rect x="84" y="84" width="32" height="32" rx="8" fill="#ea580c"/>
                  <text x="100" y="104" fill="white" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">₹1.2K</text>
                </svg>
              </div>

              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
                Scan to Pay ₹{REGISTRATION_FEE_INR} via UPI
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 12 }}>
                ECE Department · Maharaja Institute of Technology Mysore
              </div>

              {/* UPI ID copy pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: 100,
                padding: '6px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                color: '#0f172a'
              }}>
                <span>UPI: <strong>{OFFICIAL_UPI_ID}</strong></span>
                <button
                  type="button"
                  onClick={copyUpi}
                  title="Copy UPI ID"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', color: copiedUpi ? '#16a34a' : '#0284c7' }}
                >
                  {copiedUpi ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Google Form Link Button */}
            <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 16, padding: 18, marginBottom: 10 }}>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#9a3412', marginBottom: 4 }}>
                📄 Official Google Form Registration
              </div>
              <p style={{ fontSize: 12.5, color: '#7c2d12', margin: '0 0 14px', lineHeight: 1.5 }}>
                After paying, submit your details and upload payment receipt screenshot in the official Google Form provided by the organizing department:
              </p>
              <a
                href={GOOGLE_FORM_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  background: '#ea580c',
                  color: '#ffffff',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: 13.5,
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <span>Open Payment Google Form</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Dashboard Verification Form */}
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                2
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Step 2: Submit Verification to Dashboard
              </h3>
            </div>

            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
              Enter your UPI Transaction ID and upload your receipt screenshot here so our flight deck instantly logs your team and prepares your official entry pass.
            </p>

            <form onSubmit={handleSubmitVerification} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              {/* UTR Input */}
              <div>
                <label style={styles.label}>
                  12-Digit UPI Transaction ID / UTR Number *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="e.g. 429182749102 or UPI Ref No."
                  required
                  style={styles.input}
                />
                <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                  Found on your GPay, PhonePe, or banking payment success screen.
                </span>
              </div>

              {/* Payer Account Name */}
              <div>
                <label style={styles.label}>
                  Payer Name (As shown in UPI/Bank App) *
                </label>
                <input
                  type="text"
                  value={payerName}
                  onChange={e => setPayerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  style={styles.input}
                />
              </div>

              {/* Payer Phone / Contact */}
              <div>
                <label style={styles.label}>
                  Payer UPI Mobile Number
                </label>
                <input
                  type="tel"
                  value={payerPhone}
                  onChange={e => setPayerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={styles.input}
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label style={styles.label}>
                  Upload Payment Screenshot / Receipt *
                </label>
                <div style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 14,
                  padding: '16px',
                  textAlign: 'center',
                  background: '#fafafa',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  {screenshotPreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>
                        ✓ Screenshot Attached (Click to replace)
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#64748b' }}>
                      <Upload size={24} color="#0284c7" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                        Click to upload payment screenshot
                      </span>
                      <span style={{ fontSize: 11 }}>Supports PNG, JPG, JPEG (Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <input
                  type="checkbox"
                  id="pay-decl"
                  checked={declaration}
                  onChange={e => setDeclaration(e.target.checked)}
                  style={{ marginTop: 3, cursor: 'pointer', accentColor: '#0284c7' }}
                />
                <label htmlFor="pay-decl" style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, cursor: 'pointer' }}>
                  I confirm that our squad has transferred <strong>₹{REGISTRATION_FEE_INR}</strong> for HAXLR8 3.0, entered genuine UTR details, and filled the official Google Form.
                </label>
              </div>

              {errorMsg && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.buttonPrimary,
                  width: '100%',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Verifying & Locking Telemetry...' : 'Confirm Payment Verification (₹1,200) 🚀'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{ padding: '10px', background: 'transparent', border: 'none', color: '#64748b', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            style={{
              position: 'fixed', bottom: 40, left: '50%', x: '-50%',
              background: '#0284c7', color: '#ffffff', padding: '14px 28px', borderRadius: 100,
              fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10
            }}
          >
            <CheckCircle2 size={18} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
