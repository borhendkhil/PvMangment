import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const API_BASE = 'http://localhost:9091/api';

const AddDecision = ({ sujetId, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({ titre: '', description: '' });
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ titre: '', description: '' });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.titre || !formData.titre.trim()) {
      setError('العنوان مطلوب');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/directeur/process/decisions`, {
        sujetId: sujetId,
        titre: formData.titre,
        description: formData.description
      });
      
      showToast('تم إضافة المقرر بنجاح', 'success');
      handleCloseModal();
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في إضافة المقرر';
      setError(msg);
      showToast(msg, 'error');
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="btn" onClick={handleOpenModal} disabled={!sujetId}>
        <Plus size={18} /> إضافة مقرر جديد
      </button>

      <ModalPortal isOpen={showModal} onClose={handleCloseModal}>
        <h3>إضافة مقرر جديد</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>العنوان *</label>
          <input
            type="text"
            required
            value={formData.titre}
            onChange={(e) => setFormData({...formData, titre: e.target.value})}
            placeholder="أدخل عنوان المقرر"
          />

          <label>الوصف</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="أدخل وصف المقرر"
          />

          <div className="modal-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'جاري الحفظ...' : 'حفظ'}
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
