import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const DirectionsList = () => {
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ code: '', lib: '', address: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDirections();
  }, []);

  const fetchDirections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ADMIN.DIRECTIONS);
      let data = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setDirections(data);
    } catch (err) {
      console.error('Erreur:', err);
      showToast('خطأ في تحميل الإدارات', 'error');
      setDirections([]);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ code: '', lib: '', address: '' });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (dir) => {
    setEditingId(dir.id);
    setFormData({
      code: dir.code || '',
      lib: dir.lib || '',
      address: dir.address || ''
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.lib?.trim()) {
      setError('اسم الإدارة مطلوب');
      return;
    }

    try {
      const payload = {
        code: formData.code || null,
        lib: formData.lib,
        address: formData.address || null
      };

      if (editingId) {
        await axios.put(`${API_CONFIG.ADMIN.DIRECTIONS}/${editingId}`, payload);
        showToast('تم تحديث الإدارة بنجاح', 'success');
      } else {
        await axios.post(API_CONFIG.ADMIN.DIRECTIONS, payload);
        showToast('تم إضافة الإدارة بنجاح', 'success');
      }
      
      setShowModal(false);
      fetchDirections();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحفظ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الإدارة؟')) return;
    
    try {
      await axios.delete(`${API_CONFIG.ADMIN.DIRECTIONS}/${id}`);
      showToast('تم حذف الإدارة بنجاح', 'success');
      fetchDirections();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحذف';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة الإدارات</h2>
      </div>
      <div className="directions-section" dir="rtl">
        <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة إدارة</button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : directions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لم يتم العثور على أي إدارة</p>
          </div>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>الرمز</th>
                  <th>اسم الإدارة</th>
                  <th>العنوان</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {directions.map(dir => (
                  <tr key={dir.id}>
                    <td>{dir.code || '-'}</td>
                    <td>{dir.lib}</td>
                    <td>{dir.address || '-'}</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(dir)}
                        className="icon-btn"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(dir.id)}
                        className="icon-btn"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h3>{editingId ? 'تعديل الإدارة' : 'إضافة إدارة جديدة'}</h3>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSave}>
            <label>الرمز (اختياري)</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder="مثال: 01"
              maxLength="10"
            />

            <label>اسم الإدارة *</label>
            <input
              type="text"
              required
              value={formData.lib}
              onChange={(e) => setFormData({...formData, lib: e.target.value})}
              placeholder="أدخل اسم الإدارة"
            />

            <label>العنوان (اختياري)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="أدخل العنوان"
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn" style={{ flex: 1 }}>
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowModal(false)}
                style={{ flex: 1 }}
              >
                إلغاء
              </button>
            </div>
          </form>
        </ModalPortal>
      </div>
    </div>
  );
};

export default DirectionsList;
