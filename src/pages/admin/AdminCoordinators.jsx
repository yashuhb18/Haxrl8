import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Award, Sparkles, Camera, Upload, Trash2, Plus, 
  Check, RefreshCw, AlertCircle, CheckCircle2, Phone, 
  ExternalLink, RotateCcw, Save, ShieldCheck, UserCheck, Eye, Cloud
} from 'lucide-react';
import { 
  fetchCoordinators, saveCoordinators, uploadCoordinatorPhoto, 
  resetCoordinatorsToDefault, getLocalCoordinators, DEFAULT_LEAD_ARCHITECT 
} from '../../lib/coordinatorsService';
import yashwanthImg from '../../assets/humans/yashwanth.png';
import { isCloudinaryConfigured } from '../../lib/cloudinaryService';
import CloudinaryConfigModal from '../../components/admin/CloudinaryConfigModal';
import { playCrewmatePopSound } from '../../components/amongus/AmongUsSound';
import AmongUsCrewmate from '../../components/amongus/AmongUsCrewmate';

export default function AdminCoordinators() {
  const [activeTab, setActiveTab] = useState('faculty'); // 'faculty' | 'student' | 'architect'
  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [leadArchitect, setLeadArchitect] = useState(DEFAULT_LEAD_ARCHITECT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCoordId, setUploadingCoordId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [showCloudinaryModal, setShowCloudinaryModal] = useState(false);

  // Hidden file inputs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const currentUploadTargetRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCoordinators();
    if (data) {
      setFacultyList(data.faculty || []);
      setStudentList(data.students || []);
      if (data.leadArchitect) setLeadArchitect(data.leadArchitect);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = (e) => {
      if (e.detail) {
        if (Array.isArray(e.detail.faculty)) setFacultyList(e.detail.faculty);
        if (Array.isArray(e.detail.students)) setStudentList(e.detail.students);
        if (e.detail.leadArchitect) setLeadArchitect(e.detail.leadArchitect);
      }
    };
    window.addEventListener('haxlr8_coordinators_updated', handleUpdate);
    return () => window.removeEventListener('haxlr8_coordinators_updated', handleUpdate);
  }, []);

  // Save all changes to cloud & local
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveCoordinators({
        faculty: facultyList,
        students: studentList,
        leadArchitect: leadArchitect,
      });
      playCrewmatePopSound();
      showToast('All coordinators & Lead Architect photo saved! Live changes applied 🚀', 'success');
    } catch (err) {
      console.error('Failed to save coordinators:', err);
      showToast('Error saving coordinators. Check connection.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (!window.confirm('Reset all faculty and student coordinators to initial default data? Any custom uploaded photos will be reverted.')) {
      return;
    }
    setSaving(true);
    try {
      const def = await resetCoordinatorsToDefault();
      setFacultyList(def.faculty);
      setStudentList(def.students);
      playCrewmatePopSound();
      showToast('Coordinators reset to system defaults!', 'success');
    } catch (err) {
      showToast('Failed to reset defaults', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Trigger file picker for specific coordinator
  const triggerPhotoUpload = (coordId, isCamera = false) => {
    currentUploadTargetRef.current = coordId;
    if (isCamera && cameraInputRef.current) {
      cameraInputRef.current.click();
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle Photo File selection & Supabase Upload
  const handlePhotoPicked = async (e) => {
    const file = e.target.files?.[0];
    const targetId = currentUploadTargetRef.current;
    if (!file || !targetId) return;

    const isImg = (file.type && file.type.startsWith('image/')) || 
      /\.(jpg|jpeg|png|webp|gif|heic|heif|bmp|avif)$/i.test(file.name);
    if (!isImg) {
      showToast('Please select a valid image file (JPG, PNG, WebP, HEIC)', 'error');
      return;
    }

    const isHeic = file.name?.match(/\.(heic|heif)$/i) || file.type === 'image/heif' || file.type === 'image/heic';
    if (isHeic) {
      showToast('iPhone photo detected — auto-optimizing for web compatibility...', 'info');
    }

    setUploadingCoordId(targetId);
    try {
      const publicUrl = await uploadCoordinatorPhoto(file, targetId);
      
      let nextFaculty = facultyList;
      let nextStudents = studentList;
      let nextArchitect = leadArchitect;

      if (targetId === 'lead_architect') {
        nextArchitect = { ...leadArchitect, photo: publicUrl };
        setLeadArchitect(nextArchitect);
      } else {
        nextFaculty = facultyList.map(c => c.id === targetId ? { ...c, photo: publicUrl } : c);
        nextStudents = studentList.map(c => c.id === targetId ? { ...c, photo: publicUrl } : c);
        setFacultyList(nextFaculty);
        setStudentList(nextStudents);
      }

      // Auto-save immediately to Supabase and localStorage so the photo is never lost!
      await saveCoordinators({
        faculty: nextFaculty,
        students: nextStudents,
        leadArchitect: nextArchitect,
      });

      playCrewmatePopSound();
      showToast('Photo uploaded and published live to website! 🚀', 'success');
    } catch (err) {
      console.error('Photo upload failed:', err);
      showToast('Failed to upload photo', 'error');
    } finally {
      setUploadingCoordId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  // Remove photo from coordinator
  const handleRemovePhoto = async (coordId) => {
    let nextFaculty = facultyList;
    let nextStudents = studentList;
    let nextArchitect = leadArchitect;

    if (coordId === 'lead_architect') {
      nextArchitect = { ...leadArchitect, photo: null };
      setLeadArchitect(nextArchitect);
    } else {
      nextFaculty = facultyList.map(c => c.id === coordId ? { ...c, photo: null, defaultPhoto: null } : c);
      nextStudents = studentList.map(c => c.id === coordId ? { ...c, photo: null, defaultPhoto: null } : c);
      setFacultyList(nextFaculty);
      setStudentList(nextStudents);
    }

    // Auto-save removal immediately
    await saveCoordinators({
      faculty: nextFaculty,
      students: nextStudents,
      leadArchitect: nextArchitect,
    });
    showToast('Photo removed. Live changes applied.', 'info');
  };

  // Update specific field
  const updateFacultyField = (id, field, value) => {
    setFacultyList(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateStudentField = (id, field, value) => {
    setStudentList(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Add new Faculty Coordinator
  const handleAddFaculty = () => {
    const newId = `fac_${Date.now()}`;
    const newFaculty = {
      id: newId,
      name: '',
      role: 'Faculty Coordinator',
      type: 'faculty',
      designation: 'Assistant Professor, Dept of ECE',
      station: 'Faculty Advisor',
      org: 'Maharaja Institute of Technology Mysore',
      phone: '',
      badge: 'FACULTY COORDINATOR',
      color: 'blue',
      hat: 'crown',
      crewColor: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      photo: null,
    };
    setFacultyList(prev => [...prev, newFaculty]);
    showToast('New Faculty Coordinator added. Fill details and save!', 'info');
  };

  // Add new Student Coordinator
  const handleAddStudent = () => {
    const newId = `stu_${Date.now()}`;
    const newStudent = {
      id: newId,
      name: '',
      role: 'Student Coordinator',
      type: 'student',
      station: 'Student Flight Operations Lead',
      org: 'HAXLR8 3.0 · MIT Mysore',
      phone: '',
      badge: 'STUDENT COORDINATOR',
      color: 'pink',
      hat: 'pilot',
      crewColor: '#ff3b69',
      bg: '#ffe4e6',
      border: '#fecdd3',
      photo: null,
    };
    setStudentList(prev => [...prev, newStudent]);
    showToast('New Student Coordinator added. Fill details and save!', 'info');
  };

  // Delete Coordinator
  const handleDeleteCoordinator = (id, type) => {
    if (!window.confirm('Are you sure you want to delete this coordinator?')) return;
    if (type === 'faculty') {
      setFacultyList(prev => prev.filter(c => c.id !== id));
    } else {
      setStudentList(prev => prev.filter(c => c.id !== id));
    }
    showToast('Coordinator removed from list.', 'info');
  };

  return (
    <div style={{
      maxWidth: 1280,
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#0f172a',
    }}>
      {/* Hidden File & Camera Pickers */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoPicked}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handlePhotoPicked}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 99999,
              background: notification.type === 'error' ? '#ef4444' : notification.type === 'info' ? '#0284c7' : '#10b981',
              color: '#ffffff',
              padding: '14px 22px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: '2px solid #bbf7d0',
        borderRadius: 24,
        padding: '28px 24px',
        marginBottom: 28,
        boxShadow: '0 8px 24px rgba(34, 197, 94, 0.06)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#dcfce7',
            color: '#16a34a',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: 10
          }}>
            <ShieldCheck size={14} />
            <span>ORGANIZER DIRECTORY & ROSTER CONTROL</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
            Flight Crew & <span style={{ color: '#16a34a' }}>Coordinators Studio</span>
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, maxWidth: 640, lineHeight: 1.5 }}>
            Update Faculty & Student Coordinators, contact details, designations, and upload real photos. 
            All modifications here <strong>instantly update the live website</strong> on the <strong>Humans</strong> and <strong>Contact</strong> pages.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/humans"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              color: '#0f172a',
              border: '1.5px solid #e2e8f0',
              padding: '10px 16px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span>View /humans</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={handleReset}
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#fef2f2',
              color: '#dc2626',
              border: '1.5px solid #fecaca',
              padding: '10px 16px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setShowCloudinaryModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: isCloudinaryConfigured() ? '#f0fdf4' : '#f8fafc',
              color: isCloudinaryConfigured() ? '#166534' : '#0369a1',
              border: `1.5px solid ${isCloudinaryConfigured() ? '#bbf7d0' : '#bae6fd'}`,
              padding: '10px 16px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <Cloud size={15} color={isCloudinaryConfigured() ? '#16a34a' : '#0284c7'} />
            <span>{isCloudinaryConfigured() ? 'Cloudinary CDN Active' : 'Configure Cloudinary'}</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: saving ? '#94a3b8' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '11px 22px',
              borderRadius: 14,
              fontSize: 13.5,
              fontWeight: 900,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 6px 18px rgba(22, 163, 74, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Syncing with Supabase...' : 'Save All Changes 💾'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: 16,
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 14,
              border: 'none',
              background: activeTab === 'faculty' ? '#0284c7' : '#f1f5f9',
              color: activeTab === 'faculty' ? '#ffffff' : '#64748b',
              fontWeight: 900,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Award size={16} />
            <span>Faculty Coordinators ({facultyList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('student')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 14,
              border: 'none',
              background: activeTab === 'student' ? '#ff3b69' : '#f1f5f9',
              color: activeTab === 'student' ? '#ffffff' : '#64748b',
              fontWeight: 900,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={16} />
            <span>Student Coordinators ({studentList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architect')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 14,
              border: 'none',
              background: activeTab === 'architect' ? '#0ea5e9' : '#f1f5f9',
              color: activeTab === 'architect' ? '#ffffff' : '#64748b',
              fontWeight: 900,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ShieldCheck size={16} />
            <span>Lead Platform Architect</span>
          </button>
        </div>

        {/* Action / Add button */}
        {activeTab === 'faculty' ? (
          <button
            type="button"
            onClick={handleAddFaculty}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#e0f2fe',
              color: '#0284c7',
              border: '1.5px solid #7dd3fc',
              padding: '9px 16px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>Add Faculty Coordinator</span>
          </button>
        ) : activeTab === 'student' ? (
          <button
            type="button"
            onClick={handleAddStudent}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffe4e6',
              color: '#ff3b69',
              border: '1.5px solid #fecdd3',
              padding: '9px 16px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>Add Student Coordinator</span>
          </button>
        ) : (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#e0f2fe',
            color: '#0284c7',
            border: '1.5px solid #bae6fd',
            padding: '8px 14px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 12.5,
          }}>
            <span>Separate Photo &amp; Social Profile</span>
          </div>
        )}
      </div>

      {/* Coordinators Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: 15 }}>
          Loading coordinators registry from Supabase...
        </div>
      ) : activeTab === 'faculty' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
          {facultyList.map((coord, index) => (
            <CoordinatorCard
              key={coord.id || index}
              coordinator={coord}
              type="faculty"
              accentColor="#0284c7"
              accentBg="#e0f2fe"
              onUpdate={(field, val) => updateFacultyField(coord.id, field, val)}
              onUploadPhoto={(isCamera) => triggerPhotoUpload(coord.id, isCamera)}
              onRemovePhoto={() => handleRemovePhoto(coord.id)}
              onDelete={() => handleDeleteCoordinator(coord.id, 'faculty')}
              isUploading={uploadingCoordId === coord.id}
              onPreviewPhoto={(src) => setPreviewModalImg(src)}
            />
          ))}
        </div>
      ) : activeTab === 'student' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
          {studentList.map((coord, index) => (
            <CoordinatorCard
              key={coord.id || index}
              coordinator={coord}
              type="student"
              accentColor="#ff3b69"
              accentBg="#ffe4e6"
              onUpdate={(field, val) => updateStudentField(coord.id, field, val)}
              onUploadPhoto={(isCamera) => triggerPhotoUpload(coord.id, isCamera)}
              onRemovePhoto={() => handleRemovePhoto(coord.id)}
              onDelete={() => handleDeleteCoordinator(coord.id, 'student')}
              isUploading={uploadingCoordId === coord.id}
              onPreviewPhoto={(src) => setPreviewModalImg(src)}
            />
          ))}
        </div>
      ) : (
        <LeadArchitectEditorCard
          architect={leadArchitect}
          onUpdate={(field, val) => setLeadArchitect(prev => ({ ...prev, [field]: val }))}
          onUploadPhoto={(isCamera) => triggerPhotoUpload('lead_architect', isCamera)}
          onRemovePhoto={() => handleRemovePhoto('lead_architect')}
          isUploading={uploadingCoordId === 'lead_architect'}
          onPreviewPhoto={(src) => setPreviewModalImg(src)}
        />
      )}

      {/* Floating Save Bar on Bottom */}
      <div style={{
        position: 'sticky',
        bottom: 24,
        marginTop: 40,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '2px solid #e2e8f0',
        borderRadius: 20,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserCheck size={20} color="#16a34a" />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#334155' }}>
            Remember to save changes to persist them to the database and update the live website.
          </span>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: saving ? '#94a3b8' : '#16a34a',
            color: '#ffffff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 900,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 6px 18px rgba(22, 163, 74, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Syncing...' : 'Save All Changes 💾'}</span>
        </button>
      </div>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {previewModalImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewModalImg(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backdropFilter: 'blur(6px)',
            }}
          >
            <div style={{ position: 'relative', maxWidth: 480, width: '100%', background: '#fff', borderRadius: 24, overflow: 'hidden' }}>
              <img src={previewModalImg} alt="Preview" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', background: '#0f172a' }} />
              <button
                onClick={() => setPreviewModalImg(null)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CloudinaryConfigModal 
        isOpen={showCloudinaryModal} 
        onClose={() => setShowCloudinaryModal(false)} 
      />
    </div>
  );
}

/**
 * Individual Coordinator Editor Card
 */
function CoordinatorCard({
  coordinator,
  type,
  accentColor,
  accentBg,
  onUpdate,
  onUploadPhoto,
  onRemovePhoto,
  onDelete,
  isUploading,
  onPreviewPhoto,
}) {
  const photoSrc = coordinator.photo || coordinator.defaultPhoto || null;

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: 24,
      padding: 22,
      boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative',
    }}>
      {/* Top Header with Photo & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Photo Container */}
        <div style={{
          width: 106,
          height: 106,
          borderRadius: 22,
          border: `2.5px solid ${accentColor}`,
          overflow: 'hidden',
          background: accentBg,
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}>
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={20} className="animate-spin" color={accentColor} />
              <span style={{ fontSize: 9, fontWeight: 800, color: accentColor }}>Uploading</span>
            </div>
          ) : photoSrc ? (
            <>
              <img
                src={photoSrc}
                alt={coordinator.name}
                onError={(e) => {
                  if (coordinator.defaultPhoto && e.currentTarget.src !== coordinator.defaultPhoto) {
                    e.currentTarget.src = coordinator.defaultPhoto;
                  }
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
              />
              <button
                type="button"
                onClick={() => onPreviewPhoto(photoSrc)}
                style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: 3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="View Full Photo"
              >
                <Eye size={11} />
              </button>
            </>
          ) : (
            <AmongUsCrewmate
              color={coordinator.color || (type === 'faculty' ? 'lime' : 'yellow')}
              hat={coordinator.hat || (type === 'faculty' ? 'crown' : 'pilot')}
              size={80}
            />
          )}
        </div>

        {/* Photo Upload Controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            fontSize: 10.5,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: accentColor,
            background: accentBg,
            padding: '3px 8px',
            borderRadius: 8,
            alignSelf: 'flex-start',
            letterSpacing: '0.04em',
          }}>
            {type === 'faculty' ? 'Faculty Advisor' : 'Student Lead'}
          </span>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => onUploadPhoto(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '6px 10px',
                borderRadius: 10,
                fontSize: 11.5,
                fontWeight: 800,
                color: '#0f172a',
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
            >
              <Upload size={12} />
              <span>{photoSrc ? 'Change Photo' : 'Upload Photo'}</span>
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => onUploadPhoto(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '6px 10px',
                borderRadius: 10,
                fontSize: 11.5,
                fontWeight: 800,
                color: '#0f172a',
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
              title="Take Photo with Mobile Camera"
            >
              <Camera size={12} />
              <span>Camera</span>
            </button>
          </div>

          {photoSrc && (
            <button
              type="button"
              onClick={onRemovePhoto}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                padding: 0,
                marginTop: 2,
              }}
            >
              ✕ Remove custom photo
            </button>
          )}
        </div>

        {/* Delete Card Button */}
        <button
          type="button"
          onClick={onDelete}
          style={{
            background: '#fee2e2',
            border: 'none',
            color: '#ef4444',
            borderRadius: 10,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            alignSelf: 'flex-start',
          }}
          title="Delete Coordinator"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Editable Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Name */}
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            value={coordinator.name || ''}
            onChange={e => onUpdate('name', e.target.value)}
            placeholder="e.g. Dr. Balakrishna K"
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 10,
              border: '1.5px solid #e2e8f0',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Phone */}
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
            Direct Contact / WhatsApp Number
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={coordinator.phone || ''}
              onChange={e => onUpdate('phone', e.target.value)}
              placeholder="e.g. +91 80506 14849"
              style={{
                width: '100%',
                padding: '9px 12px 9px 32px',
                borderRadius: 10,
                border: '1.5px solid #e2e8f0',
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Designation / Role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              Role Title
            </label>
            <input
              type="text"
              value={coordinator.role || ''}
              onChange={e => onUpdate('role', e.target.value)}
              placeholder="Faculty Coordinator"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1.5px solid #e2e8f0',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              Badge Tag
            </label>
            <input
              type="text"
              value={coordinator.badge || ''}
              onChange={e => onUpdate('badge', e.target.value)}
              placeholder="e.g. HOD & PROFESSOR"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1.5px solid #e2e8f0',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                textTransform: 'uppercase',
              }}
            />
          </div>
        </div>

        {/* Designation / Subtitle */}
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
            {type === 'faculty' ? 'Designation & Department' : 'Flight Station / Operational Role'}
          </label>
          <input
            type="text"
            value={type === 'faculty' ? (coordinator.designation || '') : (coordinator.station || '')}
            onChange={e => onUpdate(type === 'faculty' ? 'designation' : 'station', e.target.value)}
            placeholder={type === 'faculty' ? 'Associate Prof & HoD, Dept of ECE' : 'Chief Flight Engineer & Tech Lead'}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 10,
              border: '1.5px solid #e2e8f0',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Organization / Institute */}
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
            Organization / Department
          </label>
          <input
            type="text"
            value={coordinator.org || ''}
            onChange={e => onUpdate('org', e.target.value)}
            placeholder="Maharaja Institute of Technology Mysore"
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 10,
              border: '1.5px solid #e2e8f0',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Lead Platform Architect Dedicated Editor Card
 */
function LeadArchitectEditorCard({
  architect,
  onUpdate,
  onUploadPhoto,
  onRemovePhoto,
  isUploading,
  onPreviewPhoto,
}) {
  const photoSrc = architect.photo || architect.defaultPhoto || yashwanthImg;

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #bae6fd',
      borderRadius: 28,
      padding: '32px 28px',
      boxShadow: '0 10px 30px rgba(2, 132, 199, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 820,
      margin: '0 auto',
    }}>
      {/* Notice Banner */}
      <div style={{
        background: '#f0f9ff',
        border: '1.5px solid #bae6fd',
        borderRadius: 18,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{ fontSize: 24 }}>🚀</div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 900, color: '#0369a1' }}>
            Distinct Profile &amp; Photo for Lead Platform Architect
          </div>
          <div style={{ fontSize: 12, color: '#0284c7', marginTop: 2, lineHeight: 1.4 }}>
            This section updates the dedicated Lead Platform Architect card displayed on <strong>/humans</strong>.
            The photo uploaded here is stored <em>independently</em> from Yashwanth's Student Coordinator photo.
          </div>
        </div>
      </div>

      {/* Photo & Actions Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        flexWrap: 'wrap',
        paddingBottom: 20,
        borderBottom: '1.5px solid #f1f5f9',
      }}>
        {/* Photo Container */}
        <div style={{
          width: 140,
          height: 140,
          borderRadius: 28,
          border: '3.5px solid #0284c7',
          overflow: 'hidden',
          background: '#f0f9ff',
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.15)',
        }}>
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={24} className="animate-spin" color="#0284c7" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7' }}>Uploading...</span>
            </div>
          ) : photoSrc ? (
            <>
              <img
                src={photoSrc}
                alt={architect.name}
                onError={(e) => {
                  if (e.currentTarget.src !== yashwanthImg) {
                    e.currentTarget.src = yashwanthImg;
                  }
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
              />
              <button
                type="button"
                onClick={() => onPreviewPhoto(photoSrc)}
                style={{
                  position: 'absolute',
                  bottom: 6,
                  right: 6,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="View Full Photo"
              >
                <Eye size={13} />
              </button>
            </>
          ) : (
            <AmongUsCrewmate color="cyan" hat="crown" size={96} />
          )}
        </div>

        {/* Upload Buttons */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#0284c7',
              background: '#e0f2fe',
              padding: '4px 10px',
              borderRadius: 8,
              letterSpacing: '0.04em',
            }}>
              Lead Architect Photo
            </span>
            {architect.photo ? (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>● Custom Photo Active</span>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>● Default Photo</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onUploadPhoto(false)}
              disabled={isUploading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '9px 14px',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
            >
              <Upload size={14} />
              <span>Upload Separate Photo</span>
            </button>

            <button
              type="button"
              onClick={() => onUploadPhoto(true)}
              disabled={isUploading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#f8fafc',
                color: '#334155',
                border: '1.5px solid #cbd5e1',
                padding: '9px 14px',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
            >
              <Camera size={14} />
              <span>Camera</span>
            </button>

            {architect.photo && (
              <button
                type="button"
                onClick={onRemovePhoto}
                disabled={isUploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1.5px solid #fecaca',
                  padding: '9px 14px',
                  borderRadius: 12,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                }}
              >
                <Trash2 size={14} />
                <span>Reset to Default</span>
              </button>
            )}
          </div>
          <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
            Supports JPG, PNG, WebP &amp; iPhone camera uploads (auto-converts via Cloudinary CDN).
          </span>
        </div>
      </div>

      {/* Input Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Row 1: Name and Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              Full Name
            </label>
            <input
              type="text"
              value={architect.name || ''}
              onChange={e => onUpdate('name', e.target.value)}
              placeholder="Yashwanth H B"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              Phone / WhatsApp
            </label>
            <input
              type="text"
              value={architect.phone || ''}
              onChange={e => onUpdate('phone', e.target.value)}
              placeholder="+91 80506 14849"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Row 2: Designation and Org */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              Designation / Role Title
            </label>
            <input
              type="text"
              value={architect.designation || ''}
              onChange={e => onUpdate('designation', e.target.value)}
              placeholder="Systems Engineer & Lead Platform Architect"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              Department / Institution
            </label>
            <input
              type="text"
              value={architect.org || ''}
              onChange={e => onUpdate('org', e.target.value)}
              placeholder="Dept. of ECE · Maharaja Institute of Technology Mysore"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Row 3: Social Profiles (GitHub & LinkedIn) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              GitHub Profile Link
            </label>
            <input
              type="url"
              value={architect.github || ''}
              onChange={e => onUpdate('github', e.target.value)}
              placeholder="https://github.com/yashuhb18"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
              LinkedIn Profile Link
            </label>
            <input
              type="url"
              value={architect.linkedin || ''}
              onChange={e => onUpdate('linkedin', e.target.value)}
              placeholder="https://www.linkedin.com/in/yashwanthhb/"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Row 4: Bio / Platform Architecture Summary */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 4 }}>
            Platform Architecture &amp; Contribution Bio
          </label>
          <textarea
            rows={4}
            value={architect.bio || ''}
            onChange={e => onUpdate('bio', e.target.value)}
            placeholder="Architected and engineered the end-to-end HAXLR8 3.0 digital platform..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid #e2e8f0',
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.5,
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
}

