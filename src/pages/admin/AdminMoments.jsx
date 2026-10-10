import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Image as ImageIcon, Trash2, ExternalLink, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, 
  Eye, Plus, Tag, ArrowRight, ShieldCheck, Clock, MapPin, Cloud, Edit3
} from 'lucide-react';
import { 
  fetchMoments, addMoment, updateMoment, deleteMoment, getLocalMoments 
} from '../../lib/momentsService';
import { isCloudinaryConfigured } from '../../lib/cloudinaryService';
import CloudinaryConfigModal from '../../components/admin/CloudinaryConfigModal';
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
  const [isProcessingHeic, setIsProcessingHeic] = useState(false);
  const [heicFileName, setHeicFileName] = useState('');
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const [viewingMoment, setViewingMoment] = useState(null);
  const [editingMoment, setEditingMoment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    subtitle: 'Maharaja Institute of Technology Mysore • ECE Department',
    category: 'ceremony',
    tag: 'LIVE MOMENT',
    description: 'Captured in the events by Dept. of ECE · MIT Mysore',
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showCloudinaryModal, setShowCloudinaryModal] = useState(false);

  const fileInputRef = useRef(null);
  const batchInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: 'Maharaja Institute of Technology Mysore • ECE Department',
    category: 'ceremony',
    tag: 'LIVE MOMENT',
    description: 'Captured in the events by Dept. of ECE · MIT Mysore',
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

  // Handle single file pick with seamless iPhone HEIC support
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = (file.type && file.type.startsWith('image/')) || 
      /\.(jpg|jpeg|png|webp|gif|heic|heif|bmp|avif)$/i.test(file.name);
    if (!isImg) {
      showToast('Please select a valid image file (JPG, PNG, WebP, HEIC)', 'error');
      return;
    }

    // Auto-generate title if blank
    if (!formData.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormData(prev => ({
        ...prev,
        title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      }));
    }

    const isHeic = file.name?.match(/\.(heic|heif)$/i) || file.type === 'image/heif' || file.type === 'image/heic';

    if (isHeic) {
      setHeicFileName(file.name);
      setIsProcessingHeic(true);
      setSelectedFile(file);

      try {
        const heic2anyModule = await import('heic2any');
        const heic2any = heic2anyModule.default || heic2anyModule;
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.90,
        });
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        const baseName = (file.name || 'photo').replace(/\.[^/.]+$/, '');
        const convertedJpegFile = new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });

        setSelectedFile(convertedJpegFile);
        const objUrl = URL.createObjectURL(blob);
        setPreviewUrl(objUrl);
        setIsProcessingHeic(false);
        showToast('iPhone photo converted to crisp Web JPEG! Ready to upload.', 'success');
        return;
      } catch (err) {
        console.warn('heic2any client conversion notice:', err);
        setIsProcessingHeic(false);
        const rawUrl = URL.createObjectURL(file);
        const testImg = new Image();
        testImg.onload = () => {
          setPreviewUrl(rawUrl);
        };
        testImg.onerror = () => {
          setPreviewUrl('HEIC_PENDING_CLOUD_TRANSCODE');
        };
        testImg.src = rawUrl;
        return;
      }
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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
    const files = Array.from(e.target.files || []).filter(f => 
      (f.type && f.type.startsWith('image/')) || /\.(jpg|jpeg|png|webp|gif|heic|heif|bmp|avif)$/i.test(f.name)
    );
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
          description: 'Captured in the events by Dept. of ECE · MIT Mysore',
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

  // Open Edit Moment Modal
  const handleStartEditMoment = (moment) => {
    setEditingMoment(moment);
    setEditFormData({
      title: moment.title || '',
      subtitle: moment.subtitle || 'Maharaja Institute of Technology Mysore • ECE Department',
      category: moment.category || 'ceremony',
      tag: moment.tag || 'LIVE MOMENT',
      description: moment.description || 'Captured in the events by Dept. of ECE · MIT Mysore',
    });
  };

  // Save Edited Moment (caption, title, details)
  const handleSaveEditMoment = async (e) => {
    e.preventDefault();
    if (!editingMoment) return;
    setSavingEdit(true);
    playCrewmatePopSound();

    try {
      await updateMoment(editingMoment.id, editFormData);
      showToast('Photo caption & details updated successfully! 🚀', 'success');
      playCrewmatePopSound();
      setEditingMoment(null);
      loadMomentsList();
    } catch (err) {
      console.error('Error updating moment:', err);
      showToast('Failed to update photo details', 'error');
    } finally {
      setSavingEdit(false);
    }
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

          <button
            onClick={() => setShowCloudinaryModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: isCloudinaryConfigured() ? '#f0fdf4' : '#f8fafc',
              color: isCloudinaryConfigured() ? '#166534' : '#0369a1',
              border: `1.5px solid ${isCloudinaryConfigured() ? '#bbf7d0' : '#bae6fd'}`,
              padding: '10px 16px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <Cloud size={15} color={isCloudinaryConfigured() ? '#16a34a' : '#0284c7'} />
            <span>{isCloudinaryConfigured() ? 'Cloudinary CDN Active' : 'Configure Cloudinary'}</span>
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

                {isProcessingHeic ? (
                  <div style={{
                    width: '100%',
                    height: 260,
                    borderRadius: 18,
                    border: '2px solid #0284c7',
                    background: '#f0f9ff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    textAlign: 'center',
                  }}>
                    <RefreshCw size={36} color="#0284c7" className="animate-spin" style={{ marginBottom: 14 }} />
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#0369a1', marginBottom: 4 }}>
                      Optimizing iPhone Photo ({heicFileName || 'HEIC'})...
                    </div>
                    <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 600 }}>
                      Transcoding Apple HEIC to high-resolution Web JPEG
                    </div>
                  </div>
                ) : previewUrl === 'HEIC_PENDING_CLOUD_TRANSCODE' ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 260,
                    borderRadius: 18,
                    border: '2px solid #0284c7',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: 54,
                      height: 54,
                      borderRadius: 16,
                      background: '#ffffff',
                      border: '1.5px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.1)',
                    }}>
                      <Camera size={26} color="#0284c7" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#0369a1', marginBottom: 4 }}>
                      iPhone Camera Capture Selected
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 700, marginBottom: 8 }}>
                      {selectedFile?.name || 'IMG_5259.HEIC'} ({(selectedFile?.size ? (selectedFile.size / 1024 / 1024).toFixed(1) : 2)} MB)
                    </div>
                    <div style={{ fontSize: 11.5, color: '#0284c7', background: '#ffffff', padding: '4px 12px', borderRadius: 999, fontWeight: 800, border: '1px solid #bae6fd' }}>
                      ⚡ Cloudinary will auto-transcode this photo into crystal-clear Web format upon upload
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        if (cameraInputRef.current) cameraInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.6)',
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
                  </div>
                ) : previewUrl ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 260,
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: '2px solid #0284c7',
                    background: '#f8fafc',
                  }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.img-preview-fallback')) {
                          const fb = document.createElement('div');
                          fb.className = 'img-preview-fallback';
                          fb.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;background:#f0f9ff;color:#0369a1;';
                          fb.innerHTML = '<div style="font-size:32px;margin-bottom:8px">📸</div><div style="font-weight:900;font-size:14px;color:#0f172a">' + (selectedFile?.name || 'Photo Ready') + '</div><div style="font-size:11.5px;color:#0284c7;font-weight:700;margin-top:4px">Ready to upload to Moments Gallery</div>';
                          parent.appendChild(fb);
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        if (cameraInputRef.current) cameraInputRef.current.value = '';
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
                        zIndex: 10,
                      }}
                    >
                      ✕
                    </button>
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, zIndex: 10 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
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
                  <div style={{ position: 'relative', width: '100%', height: 240, background: '#f1f5f9' }}>
                    <img
                      src={m.src}
                      alt={m.title}
                      onError={(e) => {
                        const current = e.currentTarget.src;
                        if (current.includes('cloudinary.com') && (current.endsWith('.heic') || current.endsWith('.heif') || !current.includes('/f_auto'))) {
                          const repaired = current.replace(/\.(heic|heif)($|\?)/i, '.jpg$2').replace('/upload/', '/upload/f_auto,q_auto/');
                          if (repaired !== current) {
                            e.currentTarget.src = repaired;
                            return;
                          }
                        }
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.img-card-fallback')) {
                          const fb = document.createElement('div');
                          fb.className = 'img-card-fallback';
                          fb.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;text-align:center;background:#fff7ed;color:#ea580c;';
                          fb.innerHTML = '<div style="font-size:26px;margin-bottom:6px">📸</div><div style="font-weight:900;font-size:13px;color:#0f172a">' + (m.title || 'HAXLR8 Moment') + '</div><div style="font-size:11px;color:#ea580c;font-weight:700;margin-top:2px">Synced to Cloud CDN</div>';
                          parent.appendChild(fb);
                        }
                      }}
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => handleStartEditMoment(m)}
                          style={{
                            background: '#e0f2fe',
                            color: '#0284c7',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px 10px',
                            fontSize: 11.5,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Edit3 size={12} />
                          <span>Edit Caption</span>
                        </button>

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

      {/* Edit Caption & Details Modal */}
      <AnimatePresence>
        {editingMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingMoment(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(15, 23, 42, 0.82)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backdropFilter: 'blur(6px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: 24,
                padding: 24,
                maxWidth: 580,
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      Edit Photo Caption & Details
                    </h3>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                      Update title, caption, and display category across the public gallery.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMoment(null)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    fontSize: 16,
                    color: '#64748b',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Thumbnail Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f8fafc', padding: 12, borderRadius: 16, marginBottom: 18, border: '1px solid #e2e8f0' }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                  <img src={editingMoment.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#ff3b69', textTransform: 'uppercase' }}>
                    {editingMoment.tag || 'MOMENT'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {editingMoment.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>
                    Live on public Highlights & Moments gallery
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveEditMoment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1.5px solid #e2e8f0',
                      fontSize: 13.5,
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Caption / Description */}
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                    Photo Caption / Memory Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={editFormData.description}
                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1.5px solid #e2e8f0',
                      fontSize: 13,
                      fontWeight: 500,
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 4 }}>
                    Shown directly in photo cards and interactive viewing modals.
                  </span>
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                    Gallery Category
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {CATEGORIES.map(cat => {
                      const isSelected = editFormData.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setEditFormData({ ...editFormData, category: cat.id })}
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
                          }}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tag & Subtitle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                      Tag Badge
                    </label>
                    <input
                      type="text"
                      value={editFormData.tag}
                      onChange={e => setEditFormData({ ...editFormData, tag: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: '1.5px solid #e2e8f0',
                        fontSize: 12.5,
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box',
                        textTransform: 'uppercase',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                      Location / Subtitle
                    </label>
                    <input
                      type="text"
                      value={editFormData.subtitle}
                      onChange={e => setEditFormData({ ...editFormData, subtitle: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: '1.5px solid #e2e8f0',
                        fontSize: 12.5,
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setEditingMoment(null)}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: 12,
                      padding: '10px 18px',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 12,
                      padding: '10px 22px',
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: savingEdit ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                    }}
                  >
                    {savingEdit ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes 💾</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CloudinaryConfigModal 
        isOpen={showCloudinaryModal} 
        onClose={() => setShowCloudinaryModal(false)} 
      />
    </div>
  );
}
