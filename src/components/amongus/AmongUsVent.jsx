import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playVentSound, playCrewmatePopSound } from './AmongUsSound';
import AmongUsCrewmate from './AmongUsCrewmate';

export default function AmongUsVent({ style = {}, crewColor = 'red' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasVented, setHasVented] = useState(false);

  const toggleVent = () => {
    playVentSound();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        playCrewmatePopSound();
        setHasVented(true);
      }, 200);
    } else {
      setHasVented(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        ...style,
      }}
      onClick={toggleVent}
      title="Click to Vent!"
    >
      {/* Impostor / Crewmate Peeking Out of Vent */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, scale: 0.6, opacity: 0 }}
            animate={{ y: -25, scale: 0.85, opacity: 1 }}
            exit={{ y: 50, scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            style={{ position: 'absolute', bottom: '15px', zIndex: 10 }}
          >
            <AmongUsCrewmate
              color={crewColor}
              size={65}
              hat="knife"
              speechText="I SAW YOU!"
              interactive={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vent Metallic Grate Frame */}
      <div
        style={{
          position: 'relative',
          width: '90px',
          height: '42px',
          background: '#1e293b',
          border: '3px solid #0f172a',
          borderRadius: '10px',
          boxShadow: '0 8px 18px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        {/* Vent Slits */}
        <motion.div
          animate={isOpen ? { rotateX: 65, y: -8 } : { rotateX: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            padding: '4px',
            transformOrigin: 'top center',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '78%',
                height: '3.5px',
                background: '#090d16',
                borderRadius: '4px',
                boxShadow: '0 1px 1px rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </motion.div>
      </div>

      <span
        style={{
          fontSize: '9px',
          fontWeight: 800,
          color: '#64748b',
          letterSpacing: '0.1em',
          marginTop: '4px',
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        VENT
      </span>
    </div>
  );
}
