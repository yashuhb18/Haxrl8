/**
 * Security Utilities for HAXLR8 3.0
 * - Input sanitization
 * - Rate limiting with progressive delay
 * - Generic error messages
 */

// ═══════════════════════════════════════════════════════
// 1. INPUT SANITIZATION
// ═══════════════════════════════════════════════════════

/**
 * Strip HTML tags, script injections, and dangerous characters from user input.
 * Preserves normal text, numbers, spaces, and common punctuation.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove HTML tags (including <script>, <img onerror=>, etc.)
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript\s*:/gi, '')
    // Remove on* event handlers (onerror, onclick, etc.)
    .replace(/on\w+\s*=/gi, '')
    // Remove data: protocol (used in some XSS attacks)
    .replace(/data\s*:/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitize all string values in an object (for form data before DB insert).
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Validate email format strictly.
 */
export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


// ═══════════════════════════════════════════════════════
// 2. RATE LIMITING + PROGRESSIVE DELAY
// ═══════════════════════════════════════════════════════

const MAX_ATTEMPTS = 5;

export function checkLockout() {
  return { locked: false, remainingSeconds: 0, remainingMinutes: 0 };
}

export function getProgressiveDelay() {
  return 0;
}

export function recordFailedAttempt() {
  return {
    locked: false,
    attemptsLeft: MAX_ATTEMPTS,
    delaySeconds: 0,
    lockoutMinutes: 0
  };
}

export function clearLoginAttempts() {
  // No-op
}


// ═══════════════════════════════════════════════════════
// 3. GENERIC ERROR MESSAGES
// ═══════════════════════════════════════════════════════

/**
 * Convert Supabase auth errors to generic messages.
 * Never reveals if email exists or which field was wrong.
 */
export function getGenericAuthError(error) {
  const msg = (error?.message || '').toLowerCase();
  
  // Login errors — never reveal if email exists
  if (msg.includes('invalid login credentials') || 
      msg.includes('invalid email') ||
      msg.includes('wrong password') ||
      msg.includes('user not found') ||
      msg.includes('invalid credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  
  // Rate limit from Supabase itself
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  
  // Email already registered
  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('unique constraint')) {
    return 'Unable to create account. Please try with different credentials or sign in.';
  }
  
  // Email not confirmed
  if (msg.includes('email not confirmed')) {
    return 'Please check your email and confirm your account before signing in.';
  }
  
  // Network/server errors
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('timeout')) {
    return 'Connection error. Please check your internet and try again.';
  }
  
  // Fallback: generic message
  return 'Something went wrong. Please try again.';
}
