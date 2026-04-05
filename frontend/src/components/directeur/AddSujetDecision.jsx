import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';

const AddSujetDecision = ({ onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ sujet: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleOpenModal = () => {
    setFormData({ sujet: '', description: '' });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ sujet: '', description: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sujet || !formData.sujet.trim()) {
      newErrors.sujet = 'الموضوع مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Envoi des données:', formData);
      const response = await axios.post(API_CONFIG.DIRECTEUR.PROCESS.SUJETS, formData);
      console.log('Réponse reçue:', response.data);
      
      showToast('تم إضافة الموضوع بنجاح', 'success');
      handleCloseModal();
      onSuccess?.();
    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMsg = error.response?.data?.message || error.message || 'حدث خطأ في العملية';
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        type="button"
        className="btn-add-sujet"
      >
        <Plus size={18} />
        موضوع جديد
      </button>

      {showModal && (
        <div className="sujet-decision-modal" onClick={handleCloseModal}>
          <div className="sujet-decision-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>إضافة موضوع جديد</h3>

            <form onSubmit={handleSubmit}>
              <div className={`sujet-decision-form-group ${errors.sujet ? 'sujet-decision-form-error' : ''}`}>
                <label>الموضوع *</label>
                <input
                  type="text"
                  value={formData.sujet}
                  onChange={(e) => {
                    setFormData({ ...formData, sujet: e.target.value });
                    if (errors.sujet) setErrors({ ...errors, sujet: '' });
                  }}
                  placeholder="أدخل الموضوع"
                />
                {errors.sujet && (
                  <span className="sujet-decision-error">{errors.sujet}</span>
                )}
              </div>

              <div className="sujet-decision-form-group">
                <label>الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف الموضوع"
                />
              </div>

              <div className="sujet-decision-form-buttons">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-cancel"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-submit"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSujetDecision;
