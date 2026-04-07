import React, { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import axios from 'axios';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';
import API_CONFIG from '../../config/api';
import usePermissions from '../../hooks/usePermissions';

const AddDecision = ({ sujetId, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('active');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { hasPermission } = usePermissions();

  const handleOpenModal = () => {
    setShowModal(true);
    setStatus('active');
    setSelectedFile(null);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStatus('active');
    setSelectedFile(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sujetId) {
      setError('الموضوع مطلوب');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedFile && !hasPermission('MANAGE_DECISION')) {
        showToast('Permission MANAGE_DECISION refusée, le fichier ne sera pas envoyé', 'warning');
      }

      const response = await axios.post(API_CONFIG.DIRECTEUR.PROCESS.DECISIONS, {
        sujetId,
        statut: status,
      });

      if (selectedFile && response.data?.id) {
        const formData = new FormData();
        formData.append('files', selectedFile);
        await axios.post(API_CONFIG.DIRECTEUR.PROCESS.UPLOAD_FILE(response.data.id), formData);
      }

      showToast('تمت إضافة القرار بنجاح', 'success');
      handleCloseModal();
      onSuccess?.();
    } catch (err) {
      console.error('AddDecision save failed:', {
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
        sujetId,
        status,
      });
      const msg = err.response?.data?.message || 'تعذر إضافة القرار';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="btn" onClick={handleOpenModal} disabled={!sujetId}>
        <Plus size={18} /> إضافة قرار
      </button>

      <ModalPortal isOpen={showModal} onClose={handleCloseModal}>
        <h3>إضافة قرار</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>الحالة</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">نشطة</option>
            <option value="inactive">غير نشطة</option>
          </select>

          <label>الملف</label>
          <label className="file-picker">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={16} />
              {selectedFile ? selectedFile.name : 'اختر ملفًا'}
            </span>
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
            <button type="button" className="btn secondary" onClick={handleCloseModal}>
              إلغاء
            </button>
          </div>
        </form>
      </ModalPortal>
    </>
  );
};

export default AddDecision;
