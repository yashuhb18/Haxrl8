import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  fetchSquadronsConfig, 
  getLocalSquadronsConfig, 
  saveSquadronsConfig, 
  resolveDisplaySquadrons,
  subscribeToSquadronsConfig 
} from '../../lib/crewSquadronsService';

export default function CrewSquadronsControlCard({ currentDbCount = 0, onConfigChange }) {
  const [config, setConfig] = useState(() => getLocalSquadronsConfig());
  const [boostOffset, setBoostOffset] = useState(() => Math.max(0, Number(getLocalSquadronsConfig().boostOffset) || 0));
  const [targetInput, setTargetInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Sync from cloud on mount and listen to realtime updates
  useEffect(() => {
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
  }, []);

  const totalUserDisplay = (currentDbCount || 0) + (boostOffset || 0);

  // Directly apply boost delta (e.g. +10, +20, etc.)
  const handleApplyDelta = async (delta) => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const nextBoost = Math.max(0, (boostOffset || 0) + delta);
      setBoostOffset(nextBoost);
      const updatedConfig = { boostOffset: nextBoost };
      const res = await saveSquadronsConfig(updatedConfig);
      setConfig(res.config);

      const newTotal = (currentDbCount || 0) + nextBoost;
      setSaveStatus({
        type: 'success',
        message: `Pushed ${delta > 0 ? `+${delta}` : delta} to User Dashboard! Participants now see ${newTotal} Crew Squadrons (Real DB: ${currentDbCount}).`
      });

      if (typeof onConfigChange === 'function') {
        onConfigChange(res.config);
      }
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: 'Error saving boost: ' + (err.message || 'Unknown error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Set an exact target total (e.g., admin types 12 -> boostOffset becomes 12 - currentDbCount)
  const handleApplyTargetTotal = async (targetTotal) => {
    const target = parseInt(targetTotal, 10);
    if (isNaN(target) || target < 0) return;

    setIsSaving(true);
    setSaveStatus(null);
    try {
      const nextBoost = Math.max(0, target - (currentDbCount || 0));
      setBoostOffset(nextBoost);
      const updatedConfig = { boostOffset: nextBoost };
      const res = await saveSquadronsConfig(updatedConfig);
      setConfig(res.config);

      setSaveStatus({
        type: 'success',
        message: `Target set to ${target}! User Dashboard now displays ${target} Crew Squadrons (Real DB: ${currentDbCount}, Fake Boost: +${nextBoost}).`
      });

      setTargetInput('');
      if (typeof onConfigChange === 'function') {
        onConfigChange(res.config);
      }
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: 'Error setting target: ' + (err.message || 'Unknown error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to 100% genuine database count
  const handleReset = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      setBoostOffset(0);
      const res = await saveSquadronsConfig({ boostOffset: 0 });
      setConfig(res.config);

      setSaveStatus({
        type: 'success',
        message: `Boost reset to 0! User Dashboard now reflects the genuine real database (${currentDbCount} teams).`
      });

      if (typeof onConfigChange === 'function') {
        onConfigChange(res.config);
      }
      setTimeout(() => setSaveStatus(null), 4000);
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
        background: '#ffffff',
        border: '2px solid #e0e7ff',
        borderRadius: '18px',
        padding: '22px 24px',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
            }}
          >
            ⭐
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                User Dashboard "Crew Squadrons" Boost Control
              </h3>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 100,
                  background: boostOffset > 0 ? '#fef3c7' : '#dcfce7',
                  color: boostOffset > 0 ? '#92400e' : '#15803d',
                  border: '1px solid ' + (boostOffset > 0 ? '#fde68a' : '#86efac'),
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {boostOffset > 0 ? `+${boostOffset} Boost Active` : 'Real DB (No Boost)'}
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '3px 0 0 0' }}>
              Add a numeric boost to the <strong>Crew Squadrons</strong> counter displayed to participants on their user dashboard. Admin dashboard always reflects 100% genuine database records.
            </p>
          </div>
        </div>

        {/* Live Counters Breakdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* 1. Real DB Squads */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Real Database (Admin)
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
              {currentDbCount} <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>squads</span>
            </div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 800, color: '#cbd5e1' }}>+</div>

          {/* 2. Fake Added Boost */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
              Fake Boost Offset
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#b45309' }}>
              +{boostOffset}
            </div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 800, color: '#cbd5e1' }}>=</div>

          {/* 3. Result on User Dashboard */}
          <div style={{ textAlign: 'right', padding: '6px 14px', borderRadius: 12, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              User Dashboard
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#15803d', lineHeight: 1 }}>
              {totalUserDisplay}
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Row */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: 14,
          padding: '16px 18px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          {/* Quick One-Click Boost Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#334155' }}>
              Push Fake Numbers:
            </span>

            <button
              type="button"
              onClick={() => handleApplyDelta(10)}
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 16px',
                borderRadius: 10,
                background: '#6366f1',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 900,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
                transition: 'all 0.15s ease',
              }}
              title="Add +10 to User Dashboard"
            >
              <Plus size={14} strokeWidth={3} /> 10
            </button>

            <button
              type="button"
              onClick={() => handleApplyDelta(20)}
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 16px',
                borderRadius: 10,
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 900,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                transition: 'all 0.15s ease',
              }}
              title="Add +20 to User Dashboard"
            >
              <Plus size={14} strokeWidth={3} /> 20
            </button>

            <button
              type="button"
              onClick={() => handleApplyDelta(5)}
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 12px',
                borderRadius: 10,
                background: '#e0e7ff',
                color: '#4338ca',
                border: '1px solid #c7d2fe',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
              title="Add +5 to User Dashboard"
            >
              <Plus size={12} strokeWidth={3} /> 5
            </button>

            <button
              type="button"
              onClick={() => handleApplyDelta(50)}
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 12px',
                borderRadius: 10,
                background: '#e0e7ff',
                color: '#4338ca',
                border: '1px solid #c7d2fe',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
              title="Add +50 to User Dashboard"
            >
              <Plus size={12} strokeWidth={3} /> 50
            </button>

            {boostOffset > 0 && (
              <button
                type="button"
                onClick={() => handleApplyDelta(-10)}
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
                title="Subtract 10 from Boost"
              >
                <Minus size={12} strokeWidth={3} /> 10
              </button>
            )}
          </div>

          {/* Set Exact Display Total (e.g. 12) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Or Set Total:</span>
            <input
              type="number"
              min="0"
              placeholder={`e.g. 12`}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && targetInput !== '') {
                  handleApplyTargetTotal(targetInput);
                }
              }}
              style={{
                width: 76,
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
        </div>

        {/* Reset and Auto-increment notice */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingTop: 6, borderTop: '1px dashed #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <Zap size={14} color="#f59e0b" />
            <span>
              <strong>Auto-Incrementing:</strong> When a new real user registers, the User Dashboard automatically increases (e.g. <strong>{totalUserDisplay} → {totalUserDisplay + 1}</strong>) while the Admin Dashboard displays the exact real database.
            </span>
          </div>

          {boostOffset > 0 && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#ffffff',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
              title="Remove fake boost and show genuine database numbers"
            >
              <RotateCcw size={12} />
              Reset Boost to 0
            </button>
          )}
        </div>

        {/* Real-time Status Alert */}
        {saveStatus && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: saveStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: '1px solid ' + (saveStatus.type === 'success' ? '#bbf7d0' : '#fecaca'),
              color: saveStatus.type === 'success' ? '#166534' : '#991b1b',
              fontSize: 12.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{saveStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
