import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const FonctionsList = () => {
  const [fonctions, setFonctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFonction, setEditingFonction] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    labelAr: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFonctions();
  }, []);

  const fetchFonctions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ADMIN.FONCTIONS);
      setFonctions(res.data || []);
    } catch (err) {
      console.error('Fonctions fetch error:', err);
      showToast('خطأ في جلب الوظائف', 'error');
      setFonctions([]);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingFonction(null);
    setFormData({
      name: '',
      labelAr: ''
    });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (fonction) => {
    setEditingFonction(fonction);
    setFormData({
      name: fonction.name || '',
      labelAr: fonction.labelAr || fonction.label_ar || ''
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name.trim()) {
      setError('الاسم (بالفرنسية) مطلوب');
      return;
    }
    
    if (!formData.labelAr || !formData.labelAr.trim()) {
      setError('الاسم (بالعربية) مطلوب');
      return;
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      const payload = {
        name: formData.name,
        labelAr: formData.labelAr
      };

      if (editingFonction) {
        await axios.patch(`${API_CONFIG.ADMIN.FONCTIONS}/${editingFonction.id}`, { name: payload.name, label_ar: payload.labelAr }, { headers });
        showToast('تم تحديث الوظيفة', 'success');
      } else {
        await axios.post(API_CONFIG.ADMIN.FONCTIONS, { name: payload.name, label_ar: payload.labelAr }, { headers });
        showToast('تم إضافة الوظيفة', 'success');
      }
      
      setShowModal(false);
      fetchFonctions();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'خطأ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الوظيفة؟')) return;
    
    try {
      await axios.delete(`${API_CONFIG.ADMIN.FONCTIONS}/${id}`);
      showToast('تم حذف الوظيفة', 'success');
      fetchFonctions();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'خطأ';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة الوظائف</h2>
      </div>
      <div className="fonctions-section" dir="rtl">
        <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة وظيفة جديدة</button>

        <div className="table">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
              <p>جاري التحميل...</p>
            </div>
          ) : fonctions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
              <p>لا توجد وظائف حالياً</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>الاسم (فرنسي)</th>
                  <th>الاسم (عربي)</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {fonctions.map(fonction => (
                  <tr key={fonction.id}>
                    <td>{fonction.name}</td>
                    <td>{fonction.labelAr || fonction.label_ar}</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="icon-btn" onClick={() => handleEdit(fonction)} title="تعديل">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => handleDelete(fonction.id)} title="حذف">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h3>{editingFonction ? 'تعديل الوظيفة' : 'إضافة وظيفة جديدة'}</h3>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSave}>
            <label>الاسم (بالفرنسية) *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="مثال: Directeur"
            />

            <label>الاسم (بالعربية) *</label>
            <input
              type="text"
              required
              value={formData.labelAr}
              onChange={(e) => setFormData({...formData, labelAr: e.target.value})}
              placeholder="مثال: مدير"
            />

            <div className="modal-actions">
              <button type="submit" className="btn">حفظ</button>
              <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>إلغاء</button>
            </div>
          </form>
        </ModalPortal>
      </div>
    </div>
  );
};

export default FonctionsList;
