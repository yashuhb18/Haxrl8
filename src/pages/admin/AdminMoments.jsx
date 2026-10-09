import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Image as ImageIcon, Trash2, ExternalLink, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, 
  Eye, Plus, Tag, ArrowRight, ShieldCheck, Clock, MapPin
} from 'lucide-react';
import { 
  fetchMoments, addMoment, deleteMoment, getLocalMoments 
} from '../../lib/momentsService';
import { playCrewmatePopSound } from '../../components/amongus/AmongUsSound';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

const CATEGORIES = [
  { id: 'ceremony', label: 'Ceremony & Spotlight', color: '#ff3b69', bg: '#ffe4e6' },
  { id: 'sprint', label: 'Hackathon Sprint & Labs', color: '#0284c7', bg: '#e0f2fe' },
  { id: 'crowd', label: 'Squad Camaraderie', color: '#16a34a', bg: '#dcfce7' },
];

export default function AdminMoments({ standalone = false }) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const [viewingMoment, setViewingMoment] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);
  const batchInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: 'Maharaja Institute of Technology Mysore • ECE Department',
    category: 'ceremony',
    tag: 'LIVE MOMENT',
    description: '',
  });

  const loadMomentsList = async () => {
    setLoading(true);
    const data = await fetchMoments();
    setMoments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMomentsList();

    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setMoments(e.detail);
      }
    };
    window.addEventListener('haxlr8_moments_updated', handleUpdate);
    return () => window.removeEventListener('haxlr8_moments_updated', handleUpdate);
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle single file pick
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Auto-generate title if blank
    if (!formData.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormData(prev => ({
        ...prev,
        title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      }));
    }
  };

  // Handle single upload submit
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select or capture a photo first', 'error');
      return;
    }

    setUploading(true);
    playCrewmatePopSound();

    try {
      await addMoment({
        title: formData.title || 'HAXLR8 Hackathon Moment',
        subtitle: formData.subtitle,
        category: formData.category,
        tag: formData.tag || 'LIVE MOMENT',
        description: formData.description,
        imageFile: selectedFile,
      });

      showToast('Photo uploaded and applied to Moments section!', 'success');
      playCrewmatePopSound();

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setFormData({
        title: '',
        subtitle: 'Maharaja Institute of Technology Mysore • ECE Department',
        category: 'ceremony',
        tag: 'LIVE MOMENT',
        description: '',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';

      loadMomentsList();
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Handle batch file pick
  const handleBatchSelect = async (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setBatchFiles(files);
    setBatchUploading(true);
    setBatchProgress(0);

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        const autoTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        await addMoment({
          title: autoTitle || `HAXLR8 Moment #${i + 1}`,
          subtitle: 'Maharaja Institute of Technology Mysore • ECE Department',
          category: 'ceremony',
          tag: 'BATCH UPLOAD',
          description: 'Captured during HAXLR8 3.0 at MIT Mysore.',
          imageFile: file,
        });
        successCount++;
      } catch (err) {
        console.warn('Batch item upload error:', err);
      }
      setBatchProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setBatchUploading(false);
    setBatchFiles([]);
    showToast(`Successfully uploaded ${successCount} photos to Moments section!`, 'success');
    playCrewmatePopSound();
    loadMomentsList();
    if (batchInputRef.current) batchInputRef.current.value = '';
  };

  // Handle Delete
  const handleDeleteMoment = async (moment) => {
    if (!window.confirm(`Delete "${moment.title}" from Moments section?`)) {
      return;
    }

    setDeletingId(moment.id);
    try {
      await deleteMoment(moment);
      showToast('Photo removed from Moments section.', 'success');
      loadMomentsList();
    } catch (err) {
      showToast('Error removing photo', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Copy direct link to clipboard
  const copyDirectLink = () => {
    const link = `${window.location.origin}/admin/moments`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast('Admin Moments link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#0f172a',
    }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 99999,
              background: notification.type === 'error' ? '#ef4444' : '#10b981',
              color: '#ffffff',
              padding: '14px 22px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
        border: '2px solid #fed7aa',
        borderRadius: 24,
        padding: '28px 24px',
        marginBottom: 28,
        boxShadow: '0 8px 24px rgba(249, 115, 22, 0.06)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffedd5', color: '#ea580c', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', marginBottom: 10 }}>
            <Camera size={14} />
            <span>MOMENTS & MEDIA STUDIO</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
            Live Moments <span style={{ color: '#ff3b69' }}>Upload Deck</span>
          </h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0, maxWidth: 620, lineHeight: 1.5 }}>
            Upload event photos directly from your phone or PC. Anything uploaded here is saved to Supabase and immediately applied to the public <strong>Highlights & Moments</strong> page.
          </p>
        </div>

        {/* Action Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/highlights"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#0284c7',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>View Public Moments</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={copyDirectLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              color: '#0f172a',
              border: '1.5px solid #e2e8f0',
              padding: '10px 16px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {copiedLink ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Mobile Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Studio on Left, Live Moments on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Upload Studio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Single Photo Upload Form */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#ffe4e6', color: '#ff3b69', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={16} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Upload New Moment
              </h2>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* File Drop / Camera Trigger Box */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />

                {previewUrl ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 220,
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: '2px solid #0284c7',
                    background: '#f8fafc',
                  }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                      ✓ Image Ready for Upload
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: 18,
                        padding: '30px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.background = '#f0f9ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                    >
                      <ImageIcon size={38} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                        Click to Choose Photo
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Supports JPG, PNG, WebP up to 15MB
                      </div>
                    </div>

                    {/* Quick Camera Capture Button for Mobile */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        background: '#f1f5f9',
                        color: '#0f172a',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: 14,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      <Camera size={16} color="#0284c7" />
                      <span>Take Photo with Camera 📸</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                  Moment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Auditorium Keynote or Hardware Sprint"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 13.5,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontWeight: 600,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#0284c7'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                />
              </div>

              {/* Category Picker */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                  Gallery Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {CATEGORIES.map(cat => {
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 12,
                          border: isSelected ? `2px solid ${cat.color}` : '1.5px solid #e2e8f0',
                          background: isSelected ? cat.bg : '#ffffff',
                          color: isSelected ? cat.color : '#64748b',
                          fontSize: 11.5,
                          fontWeight: 800,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tag / Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                    Tag Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GRAND FINALE"
                    value={formData.tag}
                    onChange={e => setFormData({ ...formData, tag: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: '1.5px solid #e2e8f0',
                      fontSize: 12.5,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                    Location / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MIT Mysore Auditorium"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: '1.5px solid #e2e8f0',
                      fontSize: 12.5,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                  Caption / Memory Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell the story behind this photo..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 12.5,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontWeight: 500,
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                style={{
                  background: uploading || !selectedFile ? '#94a3b8' : '#ff3b69',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 16,
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: uploading || !selectedFile ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: uploading || !selectedFile ? 'none' : '0 8px 20px rgba(255, 59, 105, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {uploading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Uploading & Syncing to Moments...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Apply to Moments Gallery 🚀</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Batch Upload Box */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: 24,
            padding: 22,
            boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles size={16} color="#ea580c" />
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Quick Batch Upload
              </h3>
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '0 0 14px' }}>
              Select multiple photos at once from your phone or PC. They will all be automatically added to the moments gallery.
            </p>

            <input
              ref={batchInputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleBatchSelect}
            />

            <button
              type="button"
              disabled={batchUploading}
              onClick={() => batchInputRef.current?.click()}
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '2px dashed #0284c7',
                borderRadius: 14,
                padding: '12px',
                fontSize: 13,
                fontWeight: 800,
                color: '#0284c7',
                cursor: batchUploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Upload size={15} />
              <span>{batchUploading ? `Uploading Batch (${batchProgress}%)...` : 'Select Multiple Photos (Batch)'}</span>
            </button>

            {batchUploading && (
              <div style={{ marginTop: 10, background: '#e2e8f0', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                <div style={{ background: '#0284c7', height: '100%', width: `${batchProgress}%`, transition: 'width 0.3s ease' }} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Applied Moments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Applied Moments ({moments.length})
              </h2>
            </div>

            <button
              onClick={loadMomentsList}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              Loading applied moments...
            </div>
          ) : moments.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '2px dashed #cbd5e1',
              borderRadius: 24,
              padding: '60px 20px',
              textAlign: 'center',
            }}>
              <Camera size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                No Uploaded Moments Yet
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', maxWidth: 360, margin: '0 auto 16px' }}>
                Use the upload studio on the left to add your first photo. It will instantly appear at the top of the public Moments section!
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Upload First Photo Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {moments.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  {/* Image Frame */}
                  <div style={{ position: 'relative', width: '100%', height: 180, background: '#f1f5f9' }}>
                    <img
                      src={m.src}
                      alt={m.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Category pill */}
                    <span style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(255,255,255,0.95)',
                      color: '#0f172a',
                      padding: '3px 8px',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}>
                      {m.tag || m.category}
                    </span>

                    {/* Zoom / View Button */}
                    <button
                      type="button"
                      onClick={() => setViewingMoment(m)}
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="View Full Size"
                    >
                      <Eye size={14} />
                    </button>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                      {m.title}
                    </h4>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px', lineHeight: 1.4 }}>
                      {m.subtitle}
                    </p>

                    {m.description && (
                      <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '0 0 12px', fontStyle: 'italic', flex: 1 }}>
                        "{m.description}"
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: 10,
                      marginTop: 'auto',
                    }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>

                      <button
                        type="button"
                        disabled={deletingId === m.id}
                        onClick={() => handleDeleteMoment(m)}
                        style={{
                          background: '#fee2e2',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: 8,
                          padding: '6px 10px',
                          fontSize: 11.5,
                          fontWeight: 800,
                          cursor: deletingId === m.id ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Trash2 size={12} />
                        <span>{deletingId === m.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {viewingMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingMoment(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backdropFilter: 'blur(6px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: 24,
                overflow: 'hidden',
                maxWidth: 800,
                width: '100%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', width: '100%', maxHeight: '65vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={viewingMoment.src}
                  alt={viewingMoment.title}
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                />
                <button
                  onClick={() => setViewingMoment(null)}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ padding: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#0284c7', textTransform: 'uppercase' }}>
                  {viewingMoment.tag}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '4px 0 6px' }}>
                  {viewingMoment.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px' }}>
                  {viewingMoment.subtitle}
                </p>
                {viewingMoment.description && (
                  <p style={{ fontSize: 13.5, color: '#475569', margin: 0 }}>
                    {viewingMoment.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
