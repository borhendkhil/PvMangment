import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const RolePermissionsList = () => {
  const [rolePermissions, setRolePermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [formData, setFormData] = useState({ roleId: '', selectedPermissions: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPermissions();
    fetchRolePermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(API_CONFIG.ADMIN.PERMISSIONS);
      setPermissions(res.data || []);
    } catch (err) {
      console.error('Erreur permissions:', err);
      showToast('خطأ في تحميل الصلاحيات', 'error');
    }
  };

  const fetchRolePermissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ADMIN.ROLES);
      setRolePermissions(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
      showToast('خطأ في تحميل صلاحيات الأدوار', 'error');
      setRolePermissions([]);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingRoleId(null);
    setFormData({ roleId: '', selectedPermissions: [] });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (rolePermission) => {
    setEditingRoleId(rolePermission.id);
    setFormData({
      roleId: rolePermission.id,
      selectedPermissions: (rolePermission.permissions || []).map((permission) => permission.id),
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.roleId) {
      setError('اختر دور');
      return;
    }

    try {
      const payload = {
        permissionIds: formData.selectedPermissions,
      };

      await axios.put(`${API_CONFIG.ADMIN.ROLES}/${formData.roleId}/permissions`, payload);
      showToast(editingRoleId ? 'تم تحديث صلاحيات الدور بنجاح' : 'تم إضافة صلاحيات الدور بنجاح', 'success');

      setShowModal(false);
      fetchRolePermissions();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحفظ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm('هل تريد حذف جميع صلاحيات هذا الدور؟')) return;

    try {
      await axios.put(`${API_CONFIG.ADMIN.ROLES}/${roleId}/permissions`, { permissionIds: [] });
      showToast('تم حذف الصلاحيات بنجاح', 'success');
      fetchRolePermissions();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحذف';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة صلاحيات الأدوار</h2>
      </div>
      <div className="users-section" dir="rtl">
        <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة صلاحيات</button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : rolePermissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لم يتم العثور على أي أدوار</p>
          </div>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>اسم الدور</th>
                  <th>الصلاحيات</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {rolePermissions.map(rp => (
                  <tr key={rp.roleId}>
                  <td>{rp.labelAr || rp.label_ar || rp.name}</td>
                  <td>{(rp.permissions || []).map((permission) => permission.name).join(', ') || '-'}</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(rp)}
                        className="icon-btn"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(rp.roleId)}
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
          <h3>{editingRoleId ? 'تعديل صلاحيات الدور' : 'إضافة صلاحيات دور جديد'}</h3>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSave}>
            <label>اختر الدور *</label>
            <select
              required
              value={formData.roleId}
              onChange={(e) => setFormData({...formData, roleId: e.target.value})}
            >
              <option value="">اختر الدور</option>
              {rolePermissions.map(rp => (
                <option key={rp.id} value={rp.id}>
                  {rp.labelAr || rp.label_ar || rp.name}
                </option>
              ))}
            </select>

            <label>الصلاحيات</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {permissions.map(perm => (
                <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.selectedPermissions.includes(perm.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          selectedPermissions: [...formData.selectedPermissions, perm.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          selectedPermissions: formData.selectedPermissions.filter(id => id !== perm.id),
                        });
                      }
                    }}
                  />
                  <span>{perm.name}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn" style={{ flex: 1 }}>
                {editingRoleId ? 'تحديث' : 'إضافة'}
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

export default RolePermissionsList;
