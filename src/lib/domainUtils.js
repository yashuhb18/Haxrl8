/**
 * Domain Utilities for HAXLR8 3.0
 * Provides robust resolution and formatting for hackathon innovation domains:
 * - Healthcare
 * - Agriculture
 * - Smart City
 */

export const VALID_DOMAINS = ['Healthcare', 'Agriculture', 'Smart City'];

/**
 * Resolves the canonical domain string from team, submission, or user cache.
 * Protects against buggy values like 'Registration Verified' or undefined.
 *
 * @param {Object} [team] - Team object from teams table or state
 * @param {Object} [sub] - Submission object from submissions table
 * @param {Object} [user] - Active user object (for scoped localStorage fallback)
 * @param {string} [defaultDomain='Healthcare'] - Fallback domain if none can be inferred
 * @returns {string} - Canonical domain name (e.g. 'Healthcare', 'Agriculture', 'Smart City')
 */
export function resolveDomain(team = null, sub = null, user = null, defaultDomain = 'Healthcare') {
  // 1. Direct valid domain on team object
  if (team?.domain && typeof team.domain === 'string') {
    const trimmed = team.domain.trim();
    const matched = VALID_DOMAINS.find(d => d.toLowerCase() === trimmed.toLowerCase());
    if (matched) return matched;
    if (trimmed && trimmed !== 'Registration Verified') return trimmed;
  }

  // 2. Check submission object
  if (sub) {
    // 2a. Category
    if (sub.category && typeof sub.category === 'string') {
      const trimmed = sub.category.trim();
      if (trimmed !== 'Registration Verified') {
        const matched = VALID_DOMAINS.find(d => d.toLowerCase() === trimmed.toLowerCase());
        if (matched) return matched;
      }
    }

    // 2b. SDG Goal
    if (sub.sdg_goal && typeof sub.sdg_goal === 'string') {
      const trimmed = sub.sdg_goal.trim();
      if (trimmed !== 'Registration Verified') {
        const matched = VALID_DOMAINS.find(d => d.toLowerCase() === trimmed.toLowerCase());
        if (matched) return matched;
      }
    }

    // 2c. Project Title (e.g. "Tetracare - Healthcare")
    if (sub.project_title && typeof sub.project_title === 'string') {
      for (const d of VALID_DOMAINS) {
        if (new RegExp(`\\b${d}\\b`, 'i').test(sub.project_title)) {
          return d;
        }
      }
    }

    // 2d. Non-verified category / sdg_goal fallback
    if (sub.category && sub.category !== 'Registration Verified') {
      return sub.category;
    }
    if (sub.sdg_goal && sub.sdg_goal !== 'Registration Verified') {
      return sub.sdg_goal;
    }
  }

  // 3. User scoped localStorage cache fallback
  if (typeof window !== 'undefined' && user?.id) {
    try {
      const cached = localStorage.getItem(`haxlr8_team_${user.id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.domain && typeof parsed.domain === 'string') {
          const trimmed = parsed.domain.trim();
          if (trimmed !== 'Registration Verified') {
            const matched = VALID_DOMAINS.find(d => d.toLowerCase() === trimmed.toLowerCase());
            if (matched) return matched;
            return trimmed;
          }
        }
      }
    } catch (e) {}
  }

  return defaultDomain;
}

/**
 * Returns formatted domain label with official emoji badge.
 * @param {string} domain 
 * @returns {string} e.g. "🏥 Healthcare", "🌾 Agriculture", "🏙️ Smart City"
 */
export function formatDomainWithBadge(domain) {
  const norm = (domain || '').trim().toLowerCase();
  if (norm === 'healthcare') return '🏥 Healthcare';
  if (norm === 'agriculture') return '🌾 Agriculture';
  if (norm === 'smart city' || norm === 'smartcity') return '🏙️ Smart City';
  return domain || '🏥 Healthcare';
}
