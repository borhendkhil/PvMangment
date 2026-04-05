import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const PermissionsList = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ADMIN.PERMISSIONS);
      setPermissions(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
      showToast('خطأ في تحميل الصلاحيات', 'error');
      setPermissions([]);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '' });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (perm) => {
    setEditingId(perm.id);
    setFormData({ name: perm.name });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setError('اسم الصلاحية مطلوب');
      return;
    }

    try {
      const payload = { name: formData.name };

      if (editingId) {
        await axios.put(`${API_CONFIG.ADMIN.PERMISSIONS}/${editingId}`, payload);
        showToast('تم تحديث الصلاحية بنجاح', 'success');
      } else {
        await axios.post(API_CONFIG.ADMIN.PERMISSIONS, payload);
        showToast('تم إضافة الصلاحية بنجاح', 'success');
      }

      setShowModal(false);
      fetchPermissions();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحفظ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الصلاحية؟')) return;

    try {
      await axios.delete(`${API_CONFIG.ADMIN.PERMISSIONS}/${id}`);
      showToast('تم حذف الصلاحية بنجاح', 'success');
      fetchPermissions();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحذف';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة الصلاحيات</h2>
      </div>
      <div className="users-section" dir="rtl">
        <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة صلاحية</button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : permissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لم يتم العثور على أي صلاحية</p>
          </div>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>اسم الصلاحية</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map(perm => (
                  <tr key={perm.id}>
                    <td>{perm.name}</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(perm)}
                        className="icon-btn"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(perm.id)}
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
          <h3>{editingId ? 'تعديل الصلاحية' : 'إضافة صلاحية جديدة'}</h3>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSave}>
            <label>اسم الصلاحية *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="مثال: MANAGE_USERS"
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

export default PermissionsList;
