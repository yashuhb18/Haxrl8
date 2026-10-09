import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Trash2, Download, ExternalLink, 
  CheckCircle2, AlertCircle, RefreshCw, FileUp, Sparkles, 
  Lock, Unlock, ShieldCheck, Eye, Copy, Check, Plus
} from 'lucide-react';
import { 
  fetchDocuments, saveDocument, deleteDocument, 
  uploadDocumentFile, DEFAULT_DOCUMENTS, getLocalDocuments 
} from '../../lib/documentsService';
import { playCrewmatePopSound } from '../../components/amongus/AmongUsSound';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

const CATEGORIES = [
  { id: 'Rulebook', label: 'Rulebook', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  { id: 'Brochure', label: 'Brochure', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { id: 'Problem Statements', label: 'Problem Statements', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff' },
  { id: 'Template', label: 'Presentation Template', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  { id: 'Guidelines', label: 'Guidelines & Notices', color: '#e11d48', bg: '#ffe4e6', border: '#fecdd3' },
];

export default function AdminDocuments() {
  const [documents, setDocuments] = useState(getLocalDocuments());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Rulebook',
    description: '',
    isLocked: false,
    unlockDate: '2026-11-02T12:00',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadDocumentsList = async (forceSpinner = false) => {
    if (forceSpinner || documents.length === 0) setLoading(true);
    try {
      const data = await fetchDocuments();
      if (data && data.length > 0) {
        setDocuments(data);
      }
    } catch (e) {
      console.warn('Doc fetch notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentsList(false);

    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setDocuments(e.detail);
      }
    };
    window.addEventListener('haxlr8_documents_updated', handleUpdate);
    return () => window.removeEventListener('haxlr8_documents_updated', handleUpdate);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.title) {
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setFormData(prev => ({ ...prev, title: baseName }));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a document title', 'error');
      return;
    }
    if (!selectedFile) {
      showToast('Please select a PDF or document file to upload', 'error');
      return;
    }

    try {
      setUploading(true);
      playCrewmatePopSound();

      // 1. Upload to Cloudinary / Supabase
      const uploadRes = await uploadDocumentFile(selectedFile);

      // 2. Select matching category colors
      const catObj = CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[0];

      // 3. Construct record
      const docRecord = {
        id: `doc_${Date.now()}`,
        title: formData.title.trim(),
        category: formData.category,
        badge: formData.isLocked ? 'OPENS NOV 2' : formData.category.toUpperCase(),
        description: formData.description.trim() || `Official ${formData.category} for HAXLR8 3.0 participants.`,
        fileUrl: uploadRes.url,
        fileName: uploadRes.fileName,
        fileSize: uploadRes.fileSize,
        fileType: uploadRes.fileType,
        isLocked: formData.isLocked,
        unlockDate: formData.isLocked ? formData.unlockDate : null,
        color: catObj.color,
        bg: catObj.bg,
        border: catObj.border,
      };

      await saveDocument(docRecord);

      // Reset form
      setFormData({
        title: '',
        category: 'Rulebook',
        description: '',
        isLocked: false,
        unlockDate: '2026-11-02T12:00',
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      showToast('Document uploaded & published to Participant Desk!', 'success');
      loadDocumentsList();
    } catch (err) {
      console.error('Document upload error:', err);
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm('Delete this document from the Participant Desk?')) {
      setDeletingId(docId);
      try {
        await deleteDocument(docId);
        showToast('Document removed successfully', 'info');
        loadDocumentsList();
      } catch (err) {
        showToast('Could not delete document', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const copyFileLink = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#0f172a',
      paddingBottom: 40,
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
              background: notification.type === 'error' ? '#ef4444' : notification.type === 'info' ? '#0284c7' : '#10b981',
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
        boxShadow: '0 8px 24px rgba(234, 88, 12, 0.06)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#ffedd5',
            color: '#c2410c',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: 10
          }}>
            <ShieldCheck size={14} />
            <span>PARTICIPANT DESK • DOCUMENT DISPATCH STUDIO</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
            Publish Rulebooks, <span style={{ color: '#ea580c' }}>Brochures &amp; PDFs</span>
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, maxWidth: 640, lineHeight: 1.5 }}>
            Upload official PDF rulebooks, brochures, problem statement dossiers, and presentation templates. 
            All uploaded files <strong>instantly appear in the Participant Dashboard</strong> under the Resources desk.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/dashboard"
            target="_blank"
            rel="noopener noreferrer"
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
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span>View Participant Desk</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Grid: Upload Studio on Left, Live Published Documents on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, alignItems: 'start' }}>
        
        {/* Upload Form Box */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #e2e8f0',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileUp size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Upload &amp; Dispatch Document
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>PDF, PPTX, DOCX, or ZIP files up to 50MB</div>
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* File Selector */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select File *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.pptx,.ppt,.docx,.doc,.zip,.png,.jpg"
                onChange={handleFileChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 12,
                  border: '1.5px dashed #0284c7',
                  background: '#f8fafc',
                  fontSize: 13,
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              />
              {selectedFile && (
                <div style={{ marginTop: 6, fontSize: 12, color: '#16a34a', fontWeight: 700 }}>
                  ✓ Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                </div>
              )}
            </div>

            {/* Document Title */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Document Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Official Hackathon Rulebook & Guidelines"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 12,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13.5,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Document Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 12,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13.5,
                  outline: 'none',
                  fontFamily: 'inherit',
                  background: '#fff',
                  boxSizing: 'border-box'
                }}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Participant Instructions / Description
              </label>
              <textarea
                placeholder="Explain what this document contains and who should read it..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 12,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Lock / Release Toggle */}
            <div style={{
              background: formData.isLocked ? '#faf5ff' : '#f8fafc',
              border: `1.5px solid ${formData.isLocked ? '#e9d5ff' : '#e2e8f0'}`,
              borderRadius: 14,
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={formData.isLocked}
                  onChange={e => setFormData({ ...formData, isLocked: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#9333ea', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                  🔒 Lock Document until November 2nd (Problem Statements release)
                </span>
              </label>
              {formData.isLocked && (
                <div style={{ fontSize: 12, color: '#7c3aed', paddingLeft: 28 }}>
                  Participants will see a "Unlocks on Nov 2nd" badge until the official reveal date.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              style={{
                background: uploading ? '#94a3b8' : '#ea580c',
                color: '#ffffff',
                border: 'none',
                padding: '13px 20px',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 900,
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: uploading ? 'none' : '0 4px 14px rgba(234, 88, 12, 0.3)',
                marginTop: 6
              }}
            >
              {uploading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Uploading to Cloud CDN...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload &amp; Publish to Participant Desk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Published Documents List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Live Published Documents ({documents.length})
            </h2>
            <button
              onClick={loadDocumentsList}
              disabled={loading}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
              Loading documents registry...
            </div>
          ) : documents.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: 40,
              textAlign: 'center',
              border: '2px dashed #cbd5e1'
            }}>
              <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>No Documents Published Yet</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                Upload the rulebook, brochure, or problem statements on the left to publish them.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${doc.border || '#fed7aa'}`,
                    borderRadius: 20,
                    padding: 20,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{
                          fontSize: 10.5,
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: doc.bg || '#fff7ed',
                          color: doc.color || '#ea580c',
                          border: `1px solid ${doc.border || '#fed7aa'}`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          {doc.badge || doc.category}
                        </span>
                        {doc.isLocked && (
                          <span style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: '#faf5ff',
                            color: '#9333ea',
                            border: '1px solid #e9d5ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <Lock size={10} /> Locked until Nov 2
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                          {doc.fileSize || 'PDF'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
                        {doc.title}
                      </h3>
                      {doc.fileName && (
                        <div style={{ fontSize: 11.5, color: '#64748b', fontFamily: 'monospace' }}>
                          📄 {doc.fileName}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      title="Delete Document"
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 10,
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#dc2626',
                        cursor: deletingId === doc.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {doc.description && (
                    <p style={{ fontSize: 12.5, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                      {doc.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                    {doc.fileUrl && doc.fileUrl !== '#' && !doc.fileUrl.startsWith('#') ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={doc.fileName || 'document.pdf'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#0284c7',
                          color: '#ffffff',
                          padding: '7px 14px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 800,
                          textDecoration: 'none'
                        }}
                      >
                        <Download size={13} />
                        <span>Download / View</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                        Release scheduled for Nov 2nd
                      </span>
                    )}

                    {doc.fileUrl && doc.fileUrl.startsWith('http') && (
                      <button
                        onClick={() => copyFileLink(doc.fileUrl, doc.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                          padding: '7px 12px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {copiedId === doc.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                        <span>{copiedId === doc.id ? 'Copied Link!' : 'Copy CDN URL'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
