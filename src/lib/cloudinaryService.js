import { supabase } from './supabaseClient';

const CLOUDINARY_LOCAL_STORAGE_KEY = 'haxlr8_cloudinary_config';
const CLOUDINARY_TAG = 'CLOUDINARY_CONFIG';

// Default credentials verified from Cloudinary account
const DEFAULT_CLOUD_NAME = 'daxycknxl';
const DEFAULT_API_KEY = '218385963343261';
const DEFAULT_API_SECRET = 'OBN1ZlxGRnjyADierOqARDf_yQ4';

/**
 * Universal SHA-1 hex digest that works in both secure and non-secure contexts (HTTP, webviews, older mobile)
 */
function jsSha1(str) {
  function utf8Encode(s) {
    return unescape(encodeURIComponent(s));
  }
  const raw = utf8Encode(str);
  const words = [];
  for (let i = 0; i < raw.length * 8; i += 8) {
    words[i >> 5] |= (raw.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
  }
  const len = raw.length * 8;
  words[len >> 5] |= 0x80 << (24 - (len % 32));
  words[(((len + 64) >> 9) << 4) + 15] = len;

  const w = new Array(80);
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, e = -1009589776;

  for (let i = 0; i < words.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d, olde = e;
    for (let j = 0; j < 80; j++) {
      if (j < 16) w[j] = words[i + j] | 0;
      else {
        const t = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
        w[j] = (t << 1) | (t >>> 31);
      }
      let f, k;
      if (j < 20) { f = (b & c) | ((~b) & d); k = 1518500249; }
      else if (j < 40) { f = b ^ c ^ d; k = 1859775393; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = -1894007588; }
      else { f = b ^ c ^ d; k = -899497514; }

      const t = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) | 0;
      e = d; d = c; c = ((b << 30) | (b >>> 2)) | 0; b = a; a = t;
    }
    a = (a + olda) | 0;
    b = (b + oldb) | 0;
    c = (c + oldc) | 0;
    d = (d + oldd) | 0;
    e = (e + olde) | 0;
  }

  return [a, b, c, d, e].map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
}

export async function sha1Hex(str) {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
      const enc = new TextEncoder().encode(str);
      const buf = await crypto.subtle.digest('SHA-1', enc);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (_) {}
  return jsSha1(str);
}

/**
 * Retrieve active Cloudinary credentials from localStorage, environment, or default verified credentials
 */
export function getCloudinaryConfig() {
  // 1. Check localStorage first (allows admin to configure dynamically in UI)
  try {
    const stored = localStorage.getItem(CLOUDINARY_LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.cloudName) {
        return {
          cloudName: parsed.cloudName.trim(),
          uploadPreset: (parsed.uploadPreset || '').trim(),
          apiKey: (parsed.apiKey || '').trim() || DEFAULT_API_KEY,
          apiSecret: (parsed.apiSecret || '').trim() || DEFAULT_API_SECRET,
          folder: parsed.folder || 'haxlr8',
          source: 'localStorage'
        };
      }
    }
  } catch (e) {
    console.warn('Error reading local Cloudinary config:', e);
  }

  // 2. Check environment variables
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
  const envApiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || DEFAULT_API_KEY;
  const envApiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || DEFAULT_API_SECRET;

  return {
    cloudName: envCloudName.trim(),
    uploadPreset: envUploadPreset.trim(),
    apiKey: envApiKey.trim(),
    apiSecret: envApiSecret.trim(),
    folder: 'haxlr8',
    source: 'env_or_default'
  };
}

/**
 * Check if Cloudinary upload is configured and ready
 */
export function isCloudinaryConfigured() {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && (config.uploadPreset || (config.apiKey && config.apiSecret)));
}

/**
 * Save Cloudinary credentials to localStorage and optionally sync to Supabase
 */
export async function saveCloudinaryConfig(config) {
  const cleanConfig = {
    cloudName: (config?.cloudName || DEFAULT_CLOUD_NAME).trim(),
    uploadPreset: (config?.uploadPreset || '').trim(),
    apiKey: (config?.apiKey || DEFAULT_API_KEY).trim(),
    apiSecret: (config?.apiSecret || DEFAULT_API_SECRET).trim(),
    folder: (config?.folder || 'haxlr8').trim(),
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(CLOUDINARY_LOCAL_STORAGE_KEY, JSON.stringify(cleanConfig));
    window.dispatchEvent(new CustomEvent('haxlr8_cloudinary_updated', { detail: cleanConfig }));
  } catch (e) {
    console.warn('Error saving local Cloudinary config:', e);
  }

  // Sync to Supabase announcements table so other admin sessions have access
  try {
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('tag', CLOUDINARY_TAG)
      .limit(1);

    const payloadStr = JSON.stringify(cleanConfig);

    if (existing && existing.length > 0) {
      await supabase
        .from('announcements')
        .update({
          title: 'Cloudinary CDN Configuration',
          message: 'Cloudinary credentials for high-scale media asset management',
          content: payloadStr
        })
        .eq('id', existing[0].id);
    } else {
      await supabase
        .from('announcements')
        .insert([{
          title: 'Cloudinary CDN Configuration',
          tag: CLOUDINARY_TAG,
          message: 'Cloudinary credentials for high-scale media asset management',
          content: payloadStr
        }]);
    }
  } catch (err) {
    console.warn('Supabase Cloudinary config sync notice:', err);
  }

  return cleanConfig;
}

/**
 * Load Cloudinary configuration from Supabase if not present locally
 */
export async function syncCloudinaryFromSupabase() {
  try {
    const { data } = await supabase
      .from('announcements')
      .select('content')
      .eq('tag', CLOUDINARY_TAG)
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data[0]?.content) {
      const parsed = JSON.parse(data[0].content);
      if (parsed?.cloudName) {
        localStorage.setItem(CLOUDINARY_LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not sync Cloudinary config from Supabase:', e);
  }
  return getCloudinaryConfig();
}

/**
 * Upload an image (File or Blob or base64) to Cloudinary via REST API
 * Supports both signed direct uploads (using API Key & Secret) and unsigned preset uploads.
 * @param {File|Blob|string} fileOrData 
 * @param {object} options
 * @returns {Promise<{ url: string, publicId: string, secureUrl: string, bytes: number }>}
 */
export async function uploadToCloudinary(fileOrData, options = {}) {
  const config = getCloudinaryConfig();
  const cloudName = config.cloudName || DEFAULT_CLOUD_NAME;
  const folder = options.folder || config.folder || 'haxlr8';

  const formData = new FormData();
  formData.append('file', fileOrData);
  formData.append('folder', folder);

  const uploadPreset = options.uploadPreset || config.uploadPreset;
  const apiKey = config.apiKey || DEFAULT_API_KEY;
  const apiSecret = config.apiSecret || DEFAULT_API_SECRET;

  // Prioritize verified signed upload so unconfigured or typo presets never break the upload
  if (apiKey && apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = await sha1Hex(stringToSign + apiSecret);

    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
  } else if (uploadPreset) {
    // Fallback: unsigned upload via preset
    formData.append('upload_preset', uploadPreset);
    if (apiKey) formData.append('api_key', apiKey);
  } else {
    throw new Error('Cloudinary credentials missing: Provide an Upload Preset or API Key & Secret.');
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    const errMsg = data.error?.message || `Cloudinary upload failed with status ${response.status}`;
    console.error('Cloudinary upload error:', errMsg, data);
    throw new Error(errMsg);
  }

  // Ensure HEIC/HEIF images are delivered as universal JPG/WebP with auto-quality so all browsers render them
  let secureUrl = data.secure_url || data.url || '';
  if (data.format === 'heic' || data.format === 'heif' || secureUrl.match(/\.(heic|heif)($|\?)/i)) {
    secureUrl = secureUrl.replace(/\.(heic|heif)($|\?)/i, '.jpg$2');
    if (!secureUrl.includes('/f_auto') && secureUrl.includes('/upload/')) {
      secureUrl = secureUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }

  return {
    url: secureUrl,
    secureUrl: secureUrl,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format === 'heic' || data.format === 'heif' ? 'jpg' : data.format,
    bytes: data.bytes
  };
}

/**
 * Client-side Canvas Image Normalizer
 * Converts raw mobile/camera captures into standard JPEG Blobs locally if supported,
 * guaranteeing browser compatibility even before storage upload.
 */
export async function ensureUniversalImage(file, maxDimension = 1920) {
  if (!file || typeof window === 'undefined') return file;

  const isWebStandard = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') && file.size < 2.5 * 1024 * 1024;
  const isHeic = file.name?.match(/\.(heic|heif)$/i) || file.type === 'image/heif' || file.type === 'image/heic';

  if (isWebStandard && !isHeic) return file;

  try {
    const converted = await new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((b) => {
          if (b) {
            const baseName = (file.name || 'photo').replace(/\.[^/.]+$/, '');
            resolve(new File([b], `${baseName}.jpg`, { type: 'image/jpeg' }));
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.88);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
    return converted || file;
  } catch (_) {
    return file;
  }
}

/**
 * Test Cloudinary connection with a 1x1 test pixel
 */
export async function testCloudinaryConnection(cloudName = DEFAULT_CLOUD_NAME, uploadPreset = '') {
  try {
    const config = getCloudinaryConfig();
    const activeCloudName = cloudName || config.cloudName || DEFAULT_CLOUD_NAME;
    const activePreset = uploadPreset || config.uploadPreset;
    const apiKey = config.apiKey || DEFAULT_API_KEY;
    const apiSecret = config.apiSecret || DEFAULT_API_SECRET;

    const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAZb3BhbkFJQUlMb2dv';
    const folder = 'haxlr8_test';
    const formData = new FormData();
    formData.append('file', testPixel);
    formData.append('folder', folder);

    if (activePreset) {
      formData.append('upload_preset', activePreset);
      if (apiKey) formData.append('api_key', apiKey);
    } else if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = await sha1Hex(stringToSign + apiSecret);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${activeCloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok && data.secure_url) {
      return { success: true, message: 'Cloudinary CDN connected & verified successfully!' };
    }
    return { success: false, message: data.error?.message || 'Connection test failed.' };
  } catch (err) {
    return { success: false, message: err.message || 'Network error while testing Cloudinary connection.' };
  }
}
