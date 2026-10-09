import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, CheckCircle2, AlertCircle, X, ShieldCheck, 
  ExternalLink, Sparkles, RefreshCw, Key, FolderOpen, Save
} from 'lucide-react';
import { 
  getCloudinaryConfig, saveCloudinaryConfig, 
  isCloudinaryConfigured, testCloudinaryConnection 
} from '../../lib/cloudinaryService';

export default function CloudinaryConfigModal({ isOpen, onClose }) {
  const [config, setConfig] = useState({
    cloudName: '',
    uploadPreset: '',
    apiKey: '',
    folder: 'haxlr8'
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const active = getCloudinaryConfig();
      setConfig({
        cloudName: active.cloudName || '',
        uploadPreset: active.uploadPreset || '',
        apiKey: active.apiKey || '',
        folder: active.folder || 'haxlr8'
      });
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = Boolean(config.cloudName && config.uploadPreset);

  const handleTest = async () => {
    if (!config.cloudName || !config.uploadPreset) {
      setTestResult({ success: false, message: 'Please enter both Cloud Name and Upload Preset to test.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testCloudinaryConnection(config.cloudName, config.uploadPreset);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveCloudinaryConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = async () => {
    if (window.confirm('Clear Cloudinary credentials and fall back to Supabase Storage?')) {
      await saveCloudinaryConfig({ cloudName: '', uploadPreset: '', apiKey: '', folder: 'haxlr8' });
      setConfig({ cloudName: '', uploadPreset: '', apiKey: '', folder: 'haxlr8' });
      setTestResult(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: 16
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#ffffff',
            borderRadius: 24,
            maxWidth: 540,
            width: '100%',
            padding: 28,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '2px solid #bae6fd',
            color: '#0f172a',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cloud size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 19, fontWeight: 900, margin: 0, color: '#0f172a' }}>
                  Cloudinary Media Storage
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: isConfigured ? '#dcfce7' : '#f1f5f9',
                    color: isConfigured ? '#16a34a' : '#64748b'
                  }}>
                    {isConfigured ? '● Cloudinary Active' : '○ Supabase Storage Fallback'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: '0 0 18px' }}>
            Offload photos from Supabase to Cloudinary CDN to prevent storage limits and ensure ultra-fast image loading on mobile devices.
          </p>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Cloud Name *
              </label>
              <input
                type="text"
                placeholder="e.g. dxyz123abc"
                value={config.cloudName}
                onChange={(e) => setConfig({ ...config, cloudName: e.target.value })}
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

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Upload Preset (Unsigned) *
              </label>
              <input
                type="text"
                placeholder="e.g. haxlr8_preset"
                value={config.uploadPreset}
                onChange={(e) => setConfig({ ...config, uploadPreset: e.target.value })}
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
              <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                Create an unsigned upload preset in Cloudinary Dashboard &gt; Settings &gt; Upload.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  API Key (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
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

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Folder Name
                </label>
                <input
                  type="text"
                  placeholder="haxlr8"
                  value={config.folder}
                  onChange={(e) => setConfig({ ...config, folder: e.target.value })}
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
            </div>

            {/* Test result message */}
            {testResult && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: testResult.success ? '#dcfce7' : '#fee2e2',
                color: testResult.success ? '#15803d' : '#b91c1c',
                border: `1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}`
              }}>
                {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{testResult.message}</span>
              </div>
            )}

            {savedSuccess && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 700,
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <CheckCircle2 size={16} />
                <span>Cloudinary credentials saved successfully!</span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Reset to Supabase
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing}
                  style={{
                    background: '#f8fafc',
                    color: '#0284c7',
                    border: '1.5px solid #bae6fd',
                    padding: '10px 16px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: testing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
                  <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <button
                  type="submit"
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  <Save size={14} />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
