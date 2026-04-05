import React, { useState, useEffect } from 'react';
import axios from 'axios';
import usePermissions from '../../hooks/usePermissions';
import API_CONFIG from '../../config/api';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { showToast } from '../common/Toaster';

/**
 * Composant Upload de Procès-Verbal
 * 
 * Logique:
 * 1️⃣ Frontend: usePermissions() vérifie UPLOAD_PV (UX)
 * 2️⃣ Backend: Vérife UPLOAD_PV + Rapporteur dans comité (Sécurité)
 * 
 * Raison de la double vérification:
 * - Frontend: Améliorer UX (cacher bouton si pas d'accès général)
 * - Backend: Vérifier vraiment les deux conditions réseau (sécurité réelle)
 */
const PVUploadComponent = ({ comiteId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);

  const { hasPermission } = usePermissions();

  // 🎨 Niveau 1: Vérifier l'affichage du bouton (UX)
  const canUploadFromPermission = hasPermission('UPLOAD_PV');

  useEffect(() => {
    // 🔐 Niveau 2: Vérifier au backend si on peut vraiment uploader
    checkUploadEligibility();
  }, [comiteId]);

  const checkUploadEligibility = async () => {
    if (!canUploadFromPermission) {
      setCanUpload(false);
      setUploadErrors(['❌ Vous n\'avez pas la permission d\'uploader des PV']);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_CONFIG.DIRECTEUR.COMITES}/${comiteId}/pv/can-upload`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const { canUpload: backendCanUpload, hasPermission: backendHasPermission, isRapporteur, error } = response.data;

      setCanUpload(backendCanUpload);

      const errors = [];
      if (!backendHasPermission) {
        errors.push('❌ Permission UPLOAD_PV refusée');
      }
      if (!isRapporteur) {
        errors.push('❌ Vous devez être Rapporteur de ce comité');
      }
      if (error && !backendCanUpload) {
        errors.push(error);
      }

      setUploadErrors(errors);
    } catch (err) {
      console.error('Error checking upload eligibility:', err);
      setCanUpload(false);
      setUploadErrors(['❌ Erreur lors de la vérification des accès']);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      showToast('Veuillez sélectionner un fichier', 'warning');
      return;
    }

    if (!name.trim()) {
      showToast('Veuillez entrer un nom pour le PV', 'warning');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      await axios.post(
        `${API_CONFIG.DIRECTEUR.COMITES}/${comiteId}/pv/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      showToast('✅ PV uploadé avec succès', 'success');
      setFile(null);
      setName('');
      setUploading(false);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de l\'upload';
      showToast(`❌ ${errorMsg}`, 'error');
      setUploading(false);
    }
  };

  // ❌ Accès refusé: afficher les raisons
  if (!canUpload) {
    return (
      <div style={{
        padding: '20px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        color: '#fca5a5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: '600' }}>Upload non autorisé</span>
        </div>
        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
          {uploadErrors.map((error, idx) => (
            <li key={idx} style={{ marginBottom: '4px' }}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  // ✅ Accès autorisé: afficher le formulaire
  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px'
    }} dir="rtl">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <CheckCircle size={20} style={{ color: '#10b981' }} />
        <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '16px', fontWeight: '600' }}>
          📄 Upload Procès-Verbal
        </h3>
      </div>

      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
            Nom du PV *
          </label>
          <input
            type="text"
            required
            placeholder="Exemple: PV du 15 avril 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
            Fichier PDF/Word *
          </label>
          <input
            type="file"
            required
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '14px',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          />
          {file && (
            <small style={{ color: '#10b981', marginTop: '5px', display: 'block' }}>
              ✓ Fichier: {file.name}
            </small>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: uploading ? 'rgba(100, 116, 139, 0.5)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: uploading ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          <Upload size={16} />
          {uploading ? 'Upload en cours...' : 'Upload PV'}
        </button>
      </form>

      {/* Explication UX */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#60a5fa'
      }}>
        ℹ️ <strong>Sécurité:</strong> Votre accès est vérifié au serveur avant l'upload
      </div>
    </div>
  );
};

export default PVUploadComponent;
