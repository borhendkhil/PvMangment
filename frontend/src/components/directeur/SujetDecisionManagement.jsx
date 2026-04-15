import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import { API_CONFIG } from '../../config/api';
import ModalPortal from '../common/ModalPortal';

const SujetDecisionManagement = () => {
  const [sujets, setSujets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSujet, setEditingSujet] = useState(null);
  const [formData, setFormData] = useState({
    sujet: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSujets();
  }, []);

  const fetchSujets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.SUJETS);
      setSujets(res.data || []);
    } catch (err) {
      console.error('Sujets fetch error:', err);
      showToast('خطأ في جلب الموضوعات', 'error');
      setSujets([]);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingSujet(null);
    setFormData({
      sujet: '',
      description: ''
    });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (sujet) => {
    setEditingSujet(sujet);
    setFormData({
      sujet: sujet.sujet || '',
      description: sujet.description || ''
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.sujet || !formData.sujet.trim()) {
      setError('الموضوع مطلوب');
      return;
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      const payload = {
        sujet: formData.sujet,
        description: formData.description
      };

      if (editingSujet) {
        await axios.patch(`${API_CONFIG.DIRECTEUR.PROCESS.SUJETS}/${editingSujet.id}`, payload, { headers });
        showToast('تم تحديث الموضوع', 'success');
      } else {
        await axios.post(API_CONFIG.DIRECTEUR.PROCESS.SUJETS, payload, { headers });
        showToast('تم إضافة الموضوع', 'success');
      }
      
      setShowModal(false);
      fetchSujets();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'خطأ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الموضوع؟')) return;
    
    try {
      await axios.delete(`${API_CONFIG.DIRECTEUR.PROCESS.SUJETS}/${id}`);
      showToast('تم حذف الموضوع', 'success');
      fetchSujets();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'خطأ';
      showToast(msg, 'error');
    }
  };

  const filteredSujets = sujets.filter(sujet =>
    sujet.sujet.includes(searchTerm) || 
    (sujet.description && sujet.description.includes(searchTerm))
  );

  return (
    <div className="sujet-decision-section" dir="rtl">
      <h2>إدارة الموضوعات</h2>
      <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة موضوع جديد</button>

      <div className="table">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : filteredSujets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>{searchTerm ? 'لا توجد نتائج' : 'لا توجد موضوعات حالياً'}</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <input
                type="text"
                placeholder="بحث عن موضوع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 12px',
                  border: '1px solid rgba(105, 192, 226, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#e2e8f0',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>الموضوع</th>
                  <th>الوصف</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSujets.map((sujet, index) => (
                  <tr key={sujet.id}>
                    <td>{index + 1}</td>
                    <td>{sujet.sujet}</td>
                    <td>{sujet.description || '-'}</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="icon-btn" onClick={() => handleEdit(sujet)} title="تعديل">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => handleDelete(sujet.id)} title="حذف">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>{editingSujet ? 'تعديل الموضوع' : 'إضافة موضوع جديد'}</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSave}>
          <label>الموضوع *</label>
          <input
            type="text"
            required
            value={formData.sujet}
            onChange={(e) => setFormData({...formData, sujet: e.target.value})}
            placeholder="أدخل الموضوع"
          />

          <label>الوصف</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="أدخل وصف الموضوع"
          />

          <div className="modal-actions">
            <button type="submit" className="btn">حفظ</button>
            <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>إلغاء</button>
          </div>
        </form>
      </ModalPortal>
    </div>
  );
};

export default SujetDecisionManagement;
