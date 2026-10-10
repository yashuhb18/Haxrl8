import { supabase } from './supabaseClient';
import { getCloudinaryConfig, sha1Hex } from './cloudinaryService';
import OfficialPPT from '../assets/PPT/SRCAS HACKATHON 3.0.pptx';

const DOCUMENTS_STORAGE_KEY = 'haxlr8_participant_documents';
const ANNOUNCEMENT_TAG = 'DOCUMENTS_REGISTRY';

export const DEFAULT_DOCUMENTS = [
  {
    id: 'doc_rulebook',
    title: 'HAXLR8 3.0 Official Hackathon Rulebook',
    category: 'Rulebook',
    badge: 'OFFICIAL GUIDE',
    description: 'Comprehensive guidelines, 24-hour offline sprint regulations, code of conduct, and reporting instructions at MIT Mysore.',
    fileUrl: '/HAXLR8-3.0-Official-Rulebook.pdf',
    fileName: 'HAXLR8-3.0-Official-Rulebook.pdf',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    unlockDate: null, // immediately available
    isLocked: false,
    uploadedAt: '2026-10-09T10:00:00.000Z',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa'
  },
  {
    id: 'doc_brochure',
    title: 'HAXLR8 3.0 Event Brochure & Mission Dossier',
    category: 'Brochure',
    badge: 'EVENT BROCHURE',
    description: 'Official department brochure highlighting innovation domains, eligibility criteria, cash rewards (₹33,333 bounty), and student mentors.',
    fileUrl: '#brochure',
    fileName: 'HAXLR8-3.0-Event-Brochure.pdf',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    unlockDate: null,
    isLocked: false,
    uploadedAt: '2026-10-09T11:00:00.000Z',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd'
  },
  {
    id: 'doc_pptx_template',
    title: 'Official 24-Hour Pitch & Presentation Template',
    category: 'Template',
    badge: 'PITCH DECK PPTX',
    description: 'Mandatory presentation format for jury evaluations. Contains slide layouts for problem, architecture, prototype demo, and roadmap.',
    fileUrl: OfficialPPT,
    fileName: 'SRCAS-HACKATHON-3.0-Pitch-Template.pptx',
    fileSize: '2.9 MB',
    fileType: 'pptx',
    unlockDate: null,
    isLocked: false,
    uploadedAt: '2026-10-09T12:00:00.000Z',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0'
  },
  {
    id: 'doc_problem_statements',
    title: 'Official Domain Problem Statements & Challenge Dossier',
    category: 'Problem Statements',
    badge: 'OPENS NOV 2',
    description: 'Official industry problem statements for Agriculture, Healthcare, and Smart City. Reveals to all confirmed squads on November 2nd, 2026.',
    fileUrl: '#problem-statements-nov-2',
    fileName: 'HAXLR8-3.0-Problem-Statements.pdf',
    fileSize: 'Pending Release',
    fileType: 'pdf',
    unlockDate: '2026-11-02T12:00:00.000Z',
    isLocked: true,
    uploadedAt: '2026-10-09T14:00:00.000Z',
    color: '#9333ea',
    bg: '#faf5ff',
    border: '#e9d5ff'
  }
];


/**
 * Get locally cached documents
 */
export function getLocalDocuments() {
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local documents:', e);
  }
  return DEFAULT_DOCUMENTS;
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
 * Fetch documents from Supabase cloud registry with local fallback
 */
export async function fetchDocuments() {
  const local = getLocalDocuments();

  try {
    const fetchPromise = supabase
      .from('announcements')
      .select('content, updated_at')
      .eq('tag', ANNOUNCEMENT_TAG)
      .order('created_at', { ascending: false })
      .limit(1);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Documents fetch timeout')), 2500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (!error && data && data[0]?.content) {
      const parsed = JSON.parse(data[0].content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setLocalDocuments(parsed);
        return parsed;
      }
    }
  } catch (err) {
    // Graceful fallback to local documents
  }

  return local;
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
