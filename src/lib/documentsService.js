import { supabase } from './supabaseClient';
import { getCloudinaryConfig, sha1Hex } from './cloudinaryService';

const DOCUMENTS_STORAGE_KEY = 'haxlr8_participant_documents';
const ANNOUNCEMENT_TAG = 'DOCUMENTS_REGISTRY';

export const DEFAULT_DOCUMENTS = [
  {
    id: 'doc_rulebook',
    title: 'HAXLR8 3.0 Official Hackathon Rulebook & Protocols',
    category: 'Rulebook',
    badge: 'MANDATORY PROTOCOLS',
    description: 'Comprehensive guidelines, 24-hour offline sprint regulations, code of conduct, and reporting instructions at MIT Mysore.',
    fileUrl: null, // Set by Admin upload
    fileName: 'Pending Admin Upload',
    fileSize: 'Official PDF',
    fileType: 'pdf',
    unlockDate: null,
    isLocked: false,
    uploadedAt: '2026-10-09T10:00:00.000Z',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd'
  },
  {
    id: 'doc_brochure',
    title: 'HAXLR8 3.0 Event Brochure & Mission Dossier',
    category: 'Brochure',
    badge: 'EVENT BROCHURE',
    description: 'Official department brochure highlighting innovation domains, eligibility criteria, cash rewards (₹33,333 bounty), and student mentors.',
    fileUrl: null, // Set by Admin upload
    fileName: 'Pending Admin Upload',
    fileSize: 'Official PDF',
    fileType: 'pdf',
    unlockDate: null,
    isLocked: false,
    uploadedAt: '2026-10-09T11:00:00.000Z',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd'
  }
];

function sanitizeDocumentsList(docs) {
  if (!Array.isArray(docs)) return DEFAULT_DOCUMENTS;
  // Filter out any PPT template documents and locked placeholder problem statements
  const filtered = docs.filter(d => 
    d.id !== 'doc_pptx_template' && 
    d.category !== 'Template' && 
    d.id !== 'doc_problem_statements'
  );
  if (filtered.length === 0) return DEFAULT_DOCUMENTS;
  return filtered.map(d => {
    // Strip dummy generated rulebook PDF so admin can upload the real one
    if (d.id === 'doc_rulebook' && d.fileUrl === '/HAXLR8-3.0-Official-Rulebook.pdf') {
      return {
        ...d,
        fileUrl: null,
        fileName: 'Pending Admin Upload',
        fileSize: 'Official PDF',
      };
    }
    // Strip placeholder brochure URL
    if (d.id === 'doc_brochure' && d.fileUrl === '#brochure') {
      return {
        ...d,
        fileUrl: null,
        fileName: 'Pending Admin Upload',
        fileSize: 'Official PDF',
      };
    }
    return d;
  });
}

/**
 * Get locally cached documents
 */
export function getLocalDocuments() {
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeDocumentsList(parsed);
      }
    }
  } catch (e) {
    console.warn('Error reading local documents:', e);
  }
  return DEFAULT_DOCUMENTS;
}

/**
 * Returns the official rulebook document record
 */
export function getOfficialRulebook(docs) {
  const list = docs || getLocalDocuments();
  return list.find(d => d.id === 'doc_rulebook') || 
         list.find(d => d.category === 'Rulebook' && d.fileUrl && d.fileUrl.startsWith('http')) || 
         list.find(d => d.category === 'Rulebook') || 
         DEFAULT_DOCUMENTS[0];
}

/**
 * Save documents list to localStorage and dispatch update event
 */
export function setLocalDocuments(docs) {
  try {
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(docs));
    window.dispatchEvent(new CustomEvent('haxlr8_documents_updated', { detail: docs }));
  } catch (e) {
    console.warn('Error saving local documents:', e);
  }
}

/**
 * Fetch documents from Supabase cloud registry with local fallback.
 * Uses exact existing column list (id, content, created_at) to avoid SQL column errors.
 */
export async function fetchDocuments() {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, content, created_at')
      .eq('tag', ANNOUNCEMENT_TAG)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && data && data[0]?.content) {
      const parsed = JSON.parse(data[0].content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sanitized = sanitizeDocumentsList(parsed);
        setLocalDocuments(sanitized);
        return sanitized;
      }
    }
  } catch (err) {
    console.warn('Supabase fetchDocuments error:', err);
  }

  return getLocalDocuments();
}

/**
 * Real-time Supabase subscription for instant cross-device updates across all participant and admin accounts
 */
export function subscribeToDocuments(onUpdate) {
  try {
    const channel = supabase
      .channel('public:documents_registry_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
          filter: `tag=eq.${ANNOUNCEMENT_TAG}`
        },
        (payload) => {
          if (payload.new && payload.new.content) {
            try {
              const parsed = JSON.parse(payload.new.content);
              if (Array.isArray(parsed)) {
                const sanitized = sanitizeDocumentsList(parsed);
                setLocalDocuments(sanitized);
                if (typeof onUpdate === 'function') onUpdate(sanitized);
              }
            } catch (err) {
              console.warn('Error parsing real-time document payload:', err);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Failed to subscribe to documents real-time:', err);
    return () => {};
  }
}

/**
 * Upload a document (PDF, PPTX, DOCX, etc.) to Cloudinary with Supabase Storage fallback
 * @param {File} file 
 * @param {string} folder 
 * @returns {Promise<{ url: string, fileName: string, fileSize: string, fileType: string }>}
 */
export async function uploadDocumentFile(file, folder = 'haxlr8_documents') {
  if (!file) throw new Error('No document file selected');

  const config = getCloudinaryConfig();
  const cloudName = config.cloudName || 'daxycknxl';
  const apiKey = config.apiKey || '218385963343261';
  const apiSecret = config.apiSecret || 'OBN1ZlxGRnjyADierOqARDf_yQ4';

  const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

  // 1. Try Cloudinary raw upload
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = await sha1Hex(stringToSign + apiSecret);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok && data.secure_url) {
      return {
        url: data.secure_url,
        fileName: file.name,
        fileSize: sizeMB,
        fileType: ext
      };
    }
  } catch (cloudErr) {
    console.warn('Cloudinary raw upload exception, trying Supabase Storage:', cloudErr);
  }

  // 2. Supabase Storage fallback
  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
    const path = `documents/${Date.now()}_${cleanName}`;

    const { data: sData, error: sErr } = await supabase.storage
      .from('id-cards')
      .upload(path, file, { cacheControl: '3600', upsert: true });

    if (!sErr && sData) {
      const { data: pubData } = supabase.storage
        .from('id-cards')
        .getPublicUrl(sData.path);

      if (pubData?.publicUrl) {
        return {
          url: pubData.publicUrl,
          fileName: file.name,
          fileSize: sizeMB,
          fileType: ext
        };
      }
    }
  } catch (storageErr) {
    console.warn('Storage upload notice:', storageErr);
  }

  throw new Error('Failed to upload document to CDN. Please check file format and connection.');
}

/**
 * Add or update a document in the registry and sync to cloud
 */
export async function saveDocument(documentRecord) {
  const current = getLocalDocuments();
  let updatedList;

  const existingIndex = current.findIndex(d => d.id === documentRecord.id);
  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = {
      ...updatedList[existingIndex],
      ...documentRecord,
      updatedAt: new Date().toISOString()
    };
  } else {
    const newDoc = {
      id: documentRecord.id || `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      ...documentRecord
    };
    updatedList = [newDoc, ...current];
  }

  setLocalDocuments(updatedList);

  // Sync to Supabase announcements
  try {
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('tag', ANNOUNCEMENT_TAG)
      .limit(1);

    const payloadStr = JSON.stringify(updatedList);

    if (existing && existing.length > 0) {
      await supabase
        .from('announcements')
        .update({
          title: 'HAXLR8 Documents Registry',
          message: 'Official downloadable documents and brochures for participant desk',
          content: payloadStr
        })
        .eq('id', existing[0].id);
    } else {
      await supabase
        .from('announcements')
        .insert([{
          title: 'HAXLR8 Documents Registry',
          tag: ANNOUNCEMENT_TAG,
          message: 'Official downloadable documents and brochures for participant desk',
          content: payloadStr
        }]);
    }
  } catch (cloudErr) {
    console.warn('Cloud sync error for documents:', cloudErr);
  }

  return updatedList;
}

/**
 * Delete a document from registry
 */
export async function deleteDocument(docId) {
  const current = getLocalDocuments();
  const updatedList = current.filter(d => d.id !== docId);
  setLocalDocuments(updatedList);

  try {
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('tag', ANNOUNCEMENT_TAG)
      .limit(1);

    if (existing && existing.length > 0) {
      await supabase
        .from('announcements')
        .update({
          content: JSON.stringify(updatedList)
        })
        .eq('id', existing[0].id);
    }
  } catch (e) {
    console.warn('Error deleting document from cloud:', e);
  }

  return updatedList;
}
