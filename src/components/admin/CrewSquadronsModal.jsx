import React, { useState, useEffect } from 'react';
import { 
  X,
  Plus, 
  Minus, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Sliders
} from 'lucide-react';
import { 
  fetchSquadronsConfig, 
  getLocalSquadronsConfig, 
  saveSquadronsConfig, 
  subscribeToSquadronsConfig 
} from '../../lib/crewSquadronsService';

export default function CrewSquadronsModal({ isOpen, onClose, currentDbCount = 0, onConfigChange }) {
  const [config, setConfig] = useState(() => getLocalSquadronsConfig());
  const [boostOffset, setBoostOffset] = useState(() => Math.max(0, Number(getLocalSquadronsConfig().boostOffset) || 0));
  const [targetInput, setTargetInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetchSquadronsConfig().then(cloudCfg => {
      if (isMounted && cloudCfg) {
        setConfig(cloudCfg);
        setBoostOffset(Math.max(0, Number(cloudCfg.boostOffset) || 0));
      }
    });

    const unsubscribe = subscribeToSquadronsConfig(newCfg => {
      if (isMounted && newCfg) {
        setConfig(newCfg);
        setBoostOffset(Math.max(0, Number(newCfg.boostOffset) || 0));
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalUserDisplay = (currentDbCount || 0) + (boostOffset || 0);

  const handleApplyDelta = async (delta) => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const nextBoost = Math.max(0, (boostOffset || 0) + delta);
      setBoostOffset(nextBoost);
      const res = await saveSquadronsConfig({ boostOffset: nextBoost });
      setConfig(res.config);

      const newTotal = (currentDbCount || 0) + nextBoost;
      setSaveStatus({
        type: 'success',
        message: `Updated! Participant dashboard now displays ${newTotal} Squadrons.`
      });

      if (typeof onConfigChange === 'function') {
        onConfigChange(res.config);
      }
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: 'Update error: ' + (err.message || 'Unknown error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyTargetTotal = async (targetTotal) => {
    const target = parseInt(targetTotal, 10);
    if (isNaN(target) || target < 0) return;

    setIsSaving(true);
    setSaveStatus(null);
    try {
      const nextBoost = Math.max(0, target - (currentDbCount || 0));
      setBoostOffset(nextBoost);
      const res = await saveSquadronsConfig({ boostOffset: nextBoost });
      setConfig(res.config);

      setSaveStatus({
        type: 'success',
        message: `Set to ${target}! Participant dashboard now displays ${target} Squadrons.`
      });

      setTargetInput('');
      if (typeof onConfigChange === 'function') {
        onConfigChange(res.config);
      }
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: 'Update error: ' + (err.message || 'Unknown error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      setBoostOffset(0);
      const res = await saveSquadronsConfig({ boostOffset: 0 });
      setConfig(res.config);

      setSaveStatus({
        type: 'success',
        message: `Reset complete. Participant dashboard reflects exact database count (${currentDbCount}).`
      });

      if (typeof onConfigChange === 'function') {
        onConfigChange(res.config);
      }
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: 'Reset error: ' + err.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#ede9fe',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sliders size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                Public Telemetry Calibration
              </h3>
              <p style={{ margin: 0, fontSize: 11.5, color: '#64748b' }}>
                Adjust the counter displayed on participant dashboards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Numbers Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1.2fr',
              alignItems: 'center',
              background: '#f8fafc',
              padding: '14px 16px',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Database
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
                {currentDbCount}
              </div>
            </div>

            <div style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8' }}>+</div>

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase' }}>
                Offset
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#4f46e5', marginTop: 2 }}>
                +{boostOffset}
              </div>
            </div>

            <div style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8' }}>=</div>

            <div style={{ background: '#f0fdf4', padding: '6px 10px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                Participant View
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#15803d', lineHeight: 1.1 }}>
                {totalUserDisplay}
              </div>
            </div>
          </div>

          {/* Quick Adjustment Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
              Quick Add / Adjust:
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleApplyDelta(10)}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Plus size={14} strokeWidth={3} /> 10
              </button>

              <button
                type="button"
                onClick={() => handleApplyDelta(20)}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Plus size={14} strokeWidth={3} /> 20
              </button>

              <button
                type="button"
                onClick={() => handleApplyDelta(5)}
                disabled={isSaving}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: '#ede9fe',
                  color: '#4338ca',
                  border: '1px solid #c7d2fe',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
              >
                +5
              </button>

              {boostOffset > 0 && (
                <button
                  type="button"
                  onClick={() => handleApplyDelta(-10)}
                  disabled={isSaving}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Minus size={12} strokeWidth={3} /> 10
                </button>
              )}
            </div>
          </div>

          {/* Set Target Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
              Or Set Total Count:
            </span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 12"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && targetInput !== '') {
                  handleApplyTargetTotal(targetInput);
                }
              }}
              style={{
                width: 80,
                padding: '7px 8px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 800,
                textAlign: 'center',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => handleApplyTargetTotal(targetInput)}
              disabled={isSaving || targetInput === ''}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                background: targetInput === '' ? '#f1f5f9' : '#059669',
                color: targetInput === '' ? '#94a3b8' : '#ffffff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: targetInput === '' ? 'not-allowed' : 'pointer',
              }}
            >
              Apply
            </button>
          </div>

          {/* Behavior Clarification */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11.5,
              color: '#64748b',
            }}
          >
            <Zap size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span>
              Real user registrations automatically advance the public count (e.g., <strong>{totalUserDisplay} → {totalUserDisplay + 1}</strong>) while the Admin Dashboard always displays only genuine database records.
            </span>
          </div>

          {/* Status Message */}
          {saveStatus && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: saveStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: '1px solid ' + (saveStatus.type === 'success' ? '#bbf7d0' : '#fecaca'),
                color: saveStatus.type === 'success' ? '#166534' : '#991b1b',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {saveStatus.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{saveStatus.message}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #f1f5f9',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {boostOffset > 0 ? (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                borderRadius: 8,
                background: '#ffffff',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
            >
              <RotateCcw size={12} />
              Reset Offset to 0
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
