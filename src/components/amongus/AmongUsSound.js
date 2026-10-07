// Web Audio API procedural sound generator for Among Us theme
// Generates authentic Among Us sound effects with 0 external audio dependencies!

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play the iconic dramatic "EMERGENCY MEETING" buzzer!
 * Synthesizes a loud warning klaxon + descending dramatic brass hit.
 */
export function playEmergencyMeetingSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Siren sweep
    const sirenOsc = ctx.createOscillator();
    const sirenGain = ctx.createGain();
    sirenOsc.type = 'sawtooth';
    sirenOsc.frequency.setValueAtTime(440, now);
    sirenOsc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    sirenOsc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
    sirenOsc.frequency.exponentialRampToValueAtTime(880, now + 0.45);
    sirenOsc.frequency.exponentialRampToValueAtTime(220, now + 0.9);

    sirenGain.gain.setValueAtTime(0.3, now);
    sirenGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    sirenOsc.connect(sirenGain);
    sirenGain.connect(ctx.destination);
    sirenOsc.start(now);
    sirenOsc.stop(now + 1.2);

    // Deep sub bass impact
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.0);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

/**
 * Play the "Task Completed" high chime sound
 */
export function playTaskCompleteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

/**
 * Play the iconic "Vent / Whoosh" sound when crewmate peeks or jumps into vent
 */
export function playVentSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Metallic clang
    const clang = ctx.createOscillator();
    const clangGain = ctx.createGain();
    clang.type = 'square';
    clang.frequency.setValueAtTime(280, now);
    clang.frequency.exponentialRampToValueAtTime(90, now + 0.15);

    clangGain.gain.setValueAtTime(0.2, now);
    clangGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    clang.connect(clangGain);
    clangGain.connect(ctx.destination);
    clang.start(now);
    clang.stop(now + 0.2);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

/**
 * Play playful crewmate "Squeak / Pop" sound
 */
export function playCrewmatePopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.1);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}
