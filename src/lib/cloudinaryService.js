import { supabase } from './supabaseClient';

const CLOUDINARY_LOCAL_STORAGE_KEY = 'haxlr8_cloudinary_config';
const CLOUDINARY_TAG = 'CLOUDINARY_CONFIG';

// Default credentials verified from Cloudinary account
const DEFAULT_CLOUD_NAME = 'daxycknxl';
const DEFAULT_API_KEY = '218385963343261';
const DEFAULT_API_SECRET = 'OBN1ZlxGRnjyADierOqARDf_yQ4';

/**
 * Native Web Crypto SHA-1 digest for browser and node
 */
async function sha1Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-1', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
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

  if (uploadPreset) {
    // Unsigned upload via preset
    formData.append('upload_preset', uploadPreset);
    if (apiKey) formData.append('api_key', apiKey);
  } else if (apiKey && apiSecret) {
    // Direct signed upload
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = await sha1Hex(stringToSign + apiSecret);

    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
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

  return {
    url: data.secure_url || data.url,
    secureUrl: data.secure_url || data.url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes
  };
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
