import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function IdCardUpload({ memberName, onComplete, onCancel }) {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');
  
  const [showPopup, setShowPopup] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleFileChange = (side, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError(`File size must be less than 2MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WEBP) are allowed.');
      return;
    }

    setError('');
    const previewUrl = URL.createObjectURL(file);

    if (side === 'front') {
      setFrontFile(file);
      setFrontPreview(previewUrl);
    } else {
      setBackFile(file);
      setBackPreview(previewUrl);
    }

    // If the other side is already selected, show the popup automatically
    if ((side === 'front' && backFile) || (side === 'back' && frontFile)) {
      setTimeout(() => setShowPopup(true), 300);
    }
  };

  const handleUploadAndConfirm = () => {
    if (!frontFile || !backFile || !confirmed) return;
    
    onComplete({
      frontFile,
      backFile,
      frontPreview,
      backPreview
    });
    
    setShowPopup(false);
  };

  const uploadBoxStyle = (preview) => ({
    border: `2px dashed ${preview ? '#38fedc' : 'rgba(56, 254, 220, 0.25)'}`,
    background: preview ? 'rgba(56, 254, 220, 0.08)' : 'rgba(10, 16, 30, 0.75)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    height: '180px',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.85)', borderRadius: '20px', border: '1.5px solid rgba(56, 254, 220, 0.2)', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px 0' }}>Upload Student ID Card</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            {memberName ? `Credentials verification for ${memberName}` : 'Upload the front and back of the college ID card.'}
          </p>
        </div>
        {onCancel && (
          <button onClick={onCancel} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#cbd5e1' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid rgba(239, 68, 68, 0.35)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        {/* Front Upload */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 800, color: '#38fedc', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Front Side</label>
          <div onClick={() => frontInputRef.current?.click()} style={uploadBoxStyle(frontPreview)}>
            {frontPreview ? (
              <img src={frontPreview} alt="Front Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(56, 254, 220, 0.12)', border: '1px solid rgba(56, 254, 220, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: '#38fedc' }}>
                  <Upload size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Click to upload</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>JPEG, PNG max 2MB</div>
              </>
            )}
            <input type="file" ref={frontInputRef} onChange={(e) => handleFileChange('front', e)} accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} />
          </div>
        </div>

        {/* Back Upload */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 800, color: '#38fedc', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Back Side</label>
          <div onClick={() => backInputRef.current?.click()} style={uploadBoxStyle(backPreview)}>
            {backPreview ? (
              <img src={backPreview} alt="Back Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(56, 254, 220, 0.12)', border: '1px solid rgba(56, 254, 220, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: '#38fedc' }}>
                  <ImageIcon size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Click to upload</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>JPEG, PNG max 2MB</div>
              </>
            )}
            <input type="file" ref={backInputRef} onChange={(e) => handleFileChange('back', e)} accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} />
          </div>
        </div>

      </div>

      {frontFile && backFile && !showPopup && (
        <button onClick={() => setShowPopup(true)} style={{ width: '100%', marginTop: '24px', padding: '14px', background: 'linear-gradient(135deg, #0284c7, #38fedc)', color: '#070a13', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 0 20px rgba(56, 254, 220, 0.35)' }}>
          Review &amp; Lock In
        </button>
      )}

      {/* POPUP PREVIEW MODAL */}
      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.98)', borderRadius: '24px', width: '100%', maxWidth: '800px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 40px rgba(56, 254, 220, 0.2)', border: '1.5px solid rgba(56, 254, 220, 0.3)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(56, 254, 220, 0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10, 16, 30, 0.9)' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px 0' }}>Review Crew ID Card</h2>
                <p style={{ fontSize: '13px', color: '#38fedc', margin: 0, fontWeight: 600 }}>Please ensure college affiliation and registration details are legible.</p>
              </div>
              <button onClick={() => setShowPopup(false)} style={{ background: 'none', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(10, 16, 30, 0.75)' }}>
              <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#38fedc', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Front Side</div>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(56, 254, 220, 0.2)' }}>
                  <img src={frontPreview} alt="Front" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }} />
                </div>
              </div>
              <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#38fedc', marginBottom: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Back Side</div>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(56, 254, 220, 0.2)' }}>
                  <img src={backPreview} alt="Back" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }} />
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(56, 254, 220, 0.18)', background: 'rgba(10, 16, 30, 0.95)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(56, 254, 220, 0.08)', padding: '16px 20px', borderRadius: '14px', border: '1.5px solid rgba(56, 254, 220, 0.25)', marginBottom: '20px' }}>
                <input 
                  type="checkbox" 
                  checked={confirmed} 
                  onChange={(e) => setConfirmed(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: '#38fedc', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1' }}>
                  I confirm that both images are clear, legible, and belong to {memberName || 'this crew member'}.
                </span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <button 
                  onClick={() => setShowPopup(false)} 
                  style={{ padding: '12px 24px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255, 255, 255, 0.15)', fontSize: '14px', fontWeight: 700, color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Cancel &amp; Reselect
                </button>
                <button 
                  onClick={handleUploadAndConfirm} 
                  disabled={!confirmed}
                  style={{ padding: '12px 32px', borderRadius: '10px', background: !confirmed ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #0284c7, #38fedc)', border: 'none', fontSize: '14px', fontWeight: 900, color: !confirmed ? '#64748b' : '#070a13', cursor: !confirmed ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: confirmed ? '0 0 20px rgba(56, 254, 220, 0.35)' : 'none' }}
                >
                  Confirm <Check size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
