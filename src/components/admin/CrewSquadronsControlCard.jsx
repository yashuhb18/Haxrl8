import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Sliders,
  TrendingUp
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
  const [mode, setMode] = useState(config.mode || 'auto');
  const [customValue, setCustomValue] = useState(
    config.mode === 'custom' && typeof config.customCount === 'number' 
      ? config.customCount 
      : (config.mode === 'boost' ? currentDbCount + (config.boostOffset || 0) : currentDbCount)
  );
  const [boostOffset, setBoostOffset] = useState(config.boostOffset || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Hydrate from cloud on mount
  useEffect(() => {
    let isMounted = true;
    fetchSquadronsConfig().then(cloudCfg => {
      if (isMounted && cloudCfg) {
        setConfig(cloudCfg);
        setMode(cloudCfg.mode || 'auto');
        if (cloudCfg.mode === 'custom') {
          setCustomValue(cloudCfg.customCount ?? currentDbCount);
        } else if (cloudCfg.mode === 'boost') {
          setBoostOffset(cloudCfg.boostOffset ?? 0);
          setCustomValue(currentDbCount + (cloudCfg.boostOffset ?? 0));
        } else {
          setCustomValue(currentDbCount);
        }
      }
    });

    const unsubscribe = subscribeToSquadronsConfig(newCfg => {
      if (isMounted && newCfg) {
        setConfig(newCfg);
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentDbCount]);

  // Keep customValue aligned with currentDbCount if in auto mode and customValue was 0
  useEffect(() => {
    if (mode === 'auto') {
      setCustomValue(currentDbCount);
    }
  }, [currentDbCount, mode]);

  const activeDisplayCount = resolveDisplaySquadrons(currentDbCount, config);

  const handleIncrement = (amount) => {
    setCustomValue(prev => {
      const next = Math.max(0, (Number(prev) || 0) + amount);
      if (mode === 'auto') {
        setMode('custom');
      }
      return next;
    });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'auto') {
      setCustomValue(currentDbCount);
    } else if (newMode === 'custom') {
      if (customValue === currentDbCount) {
        // keep current value as initial custom value
      }
    } else if (newMode === 'boost') {
      setBoostOffset(Math.max(0, customValue - currentDbCount));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      let updatedConfig = {};
      const numVal = Math.max(0, parseInt(customValue, 10) || 0);

      if (mode === 'custom') {
        updatedConfig = {
          mode: 'custom',
          customCount: numVal,
          boostOffset: 0,
        };
      } else if (mode === 'boost') {
        const offset = Math.max(0, numVal - currentDbCount);
        updatedConfig = {
          mode: 'boost',
          customCount: numVal,
          boostOffset: offset,
        };
      } else {
        updatedConfig = {
          mode: 'auto',
          customCount: currentDbCount,
          boostOffset: 0,
        };
      }

      const result = await saveSquadronsConfig(updatedConfig);
      setConfig(result.config);
      setSaveStatus({
        type: 'success',
        message: `Saved & Broadcasted! User dashboard now displays ${resolveDisplaySquadrons(currentDbCount, result.config)} Crew Squadrons.`
      });

      if (typeof onConfigChange === 'function') {
        onConfigChange(result.config);
      }

      setTimeout(() => {
        setSaveStatus(null);
      }, 5000);
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: 'Error saving config: ' + (err.message || 'Unknown error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToLive = async () => {
    setIsSaving(true);
    try {
      const resetConfig = {
        mode: 'auto',
        customCount: currentDbCount,
        boostOffset: 0,
      };
      setMode('auto');
      setCustomValue(currentDbCount);
      const result = await saveSquadronsConfig(resetConfig);
      setConfig(result.config);
      setSaveStatus({
        type: 'success',
        message: `Reset to live database! User dashboard now reflects exact ${currentDbCount} teams.`
      });
      if (typeof onConfigChange === 'function') {
        onConfigChange(result.config);
      }
      setTimeout(() => setSaveStatus(null), 5000);
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
                Crew Squadrons Telemetry Control
              </h3>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 100,
                  background: config.mode === 'custom' ? '#fef3c7' : config.mode === 'boost' ? '#e0f2fe' : '#dcfce7',
                  color: config.mode === 'custom' ? '#92400e' : config.mode === 'boost' ? '#0369a1' : '#15803d',
                  border: '1px solid ' + (config.mode === 'custom' ? '#fde68a' : config.mode === 'boost' ? '#bae6fd' : '#86efac'),
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {config.mode === 'custom' ? 'Custom Override' : config.mode === 'boost' ? 'Live + Boost' : 'Live DB Sync'}
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '3px 0 0 0' }}>
              Control the number of <strong>Crew Squadrons</strong> displayed to participants on their user dashboard.
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Actual DB Squads</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#334155' }}>{currentDbCount}</div>
          </div>
          <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Live User Dashboard
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#15803d', lineHeight: 1 }}>
              {activeDisplayCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Controls Grid */}
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
        {/* Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
            Display Mode:
          </div>
          <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: 3, borderRadius: 10, gap: 4 }}>
            <button
              type="button"
              onClick={() => handleModeChange('custom')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: mode === 'custom' ? '#ffffff' : 'transparent',
                color: mode === 'custom' ? '#4f46e5' : '#64748b',
                fontWeight: mode === 'custom' ? 800 : 600,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: mode === 'custom' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Exact Number (Custom)
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('boost')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: mode === 'boost' ? '#ffffff' : 'transparent',
                color: mode === 'boost' ? '#0284c7' : '#64748b',
                fontWeight: mode === 'boost' ? 800 : 600,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: mode === 'boost' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Live DB + Boost
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('auto')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: mode === 'auto' ? '#ffffff' : 'transparent',
                color: mode === 'auto' ? '#15803d' : '#64748b',
                fontWeight: mode === 'auto' ? 800 : 600,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: mode === 'auto' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Auto (Exact Database)
            </button>
          </div>
        </div>

        {/* Counter Adjustment Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          {/* Number Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Target Count:</span>
            
            <button
              type="button"
              onClick={() => handleIncrement(-10)}
              disabled={customValue <= 0 || mode === 'auto'}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: 11,
                fontWeight: 800,
                cursor: customValue <= 0 || mode === 'auto' ? 'not-allowed' : 'pointer',
                opacity: customValue <= 0 || mode === 'auto' ? 0.5 : 1,
              }}
              title="Decrease by 10"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => handleIncrement(-1)}
              disabled={customValue <= 0 || mode === 'auto'}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: customValue <= 0 || mode === 'auto' ? 'not-allowed' : 'pointer',
                opacity: customValue <= 0 || mode === 'auto' ? 0.5 : 1,
              }}
              title="Decrease by 1"
            >
              <Minus size={14} />
            </button>

            {/* Direct Number Input */}
            <input
              type="number"
              min="0"
              value={customValue}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                setCustomValue(val);
                if (mode === 'auto') setMode('custom');
              }}
              disabled={mode === 'auto'}
              style={{
                width: 80,
                height: 36,
                borderRadius: 8,
                border: '2px solid #6366f1',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 900,
                color: '#1e1b4b',
                background: mode === 'auto' ? '#f1f5f9' : '#ffffff',
                cursor: mode === 'auto' ? 'not-allowed' : 'text',
              }}
            />

            <button
              type="button"
              onClick={() => handleIncrement(1)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #6366f1',
                background: '#ede9fe',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Increase by 1"
            >
              <Plus size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleIncrement(5)}
              style={{
                padding: '0 8px',
                height: 32,
                borderRadius: 8,
                border: '1px solid #6366f1',
                background: '#ede9fe',
                color: '#4f46e5',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="Increase by 5"
            >
              +5
            </button>
            <button
              type="button"
              onClick={() => handleIncrement(10)}
              style={{
                padding: '0 8px',
                height: 32,
                borderRadius: 8,
                border: '1px solid #6366f1',
                background: '#6366f1',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="Increase by 10"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => handleIncrement(25)}
              style={{
                padding: '0 8px',
                height: 32,
                borderRadius: 8,
                border: '1px solid #4338ca',
                background: '#4338ca',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="Increase by 25"
            >
              +25
            </button>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Presets:</span>
            {[15, 25, 40, 50, 75, 100].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setCustomValue(val);
                  setMode('custom');
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: customValue === val && mode === 'custom' ? '#dbeafe' : '#ffffff',
                  color: customValue === val && mode === 'custom' ? '#1e40af' : '#475569',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons & Feedback */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 800,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 10px rgba(22, 163, 74, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <Save size={15} />
              {isSaving ? 'Publishing...' : 'Publish to User Dashboard 🚀'}
            </button>

            {mode !== 'auto' && (
              <button
                type="button"
                onClick={handleResetToLive}
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 14px',
                  borderRadius: 10,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
                title="Reset display to exact database count"
              >
                <RotateCcw size={13} />
                Reset to Live DB
              </button>
            )}
          </div>

          <div style={{ fontSize: 11.5, color: '#64748b', fontStyle: 'italic' }}>
            {config.updatedAt ? `Last published: ${new Date(config.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Synchronized with Starfleet backend'}
          </div>
        </div>

        {/* Status Message */}
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
