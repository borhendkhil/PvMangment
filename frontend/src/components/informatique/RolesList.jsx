import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ADMIN.ROLES);
      setRoles(res.data || []);
    } catch (err) {
      console.error('roles fetch', err);
      showToast('خطأ في جلب الأدوار', 'error');
      setRoles([]);
    }
    setLoading(false);
  };

  const openAdd = () => { setEditing(null); setName(''); setNameAr(''); setError(null); setShowModal(true); };
  const openEdit = (r) => { setEditing(r); setName(r.role || ''); setNameAr(r.roleAr || r.role_ar || ''); setError(null); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) { setError('Nom invalide'); return; }
    try {
      if (editing) {
        await axios.put(`${API_CONFIG.ADMIN.ROLES}/${editing.id}`, { role: name, roleAr: nameAr });
      } else {
        await axios.post(API_CONFIG.ADMIN.ROLES, { role: name, roleAr: nameAr });
      }
      setShowModal(false);
      fetchRoles();
      showToast('تم حفظ الدور', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Confirmer la suppression du rôle ?')) return;
    try {
      await axios.delete(`${API_CONFIG.ADMIN.ROLES}/${id}`);
      fetchRoles();
      showToast('تم حذف الدور', 'success');
    } catch (err) { console.error(err); showToast('خطأ أثناء حذف الدور', 'error'); }
  };

  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة الأدوار</h2>
      </div>
      <div className="roles-section" dir="rtl">
        <button className="btn" onClick={openAdd}><Plus size={18} /> إضافة دور جديد</button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : roles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لا توجد أدوار حالياً</p>
          </div>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الاسم (عربي)</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(r => (
                  <tr key={r.id}>
                    <td>{r.role}</td>
                    <td>{r.roleAr || r.role_ar}</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="icon-btn" onClick={() => openEdit(r)} title="تعديل"><Edit2 size={16} /></button>
                      <button className="icon-btn" onClick={() => remove(r.id)} title="حذف"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>{editing ? 'تعديل الدور' : 'إضافة دور جديد'}</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={save}>
          <label>الاسم</label>
          <input 
            type="text"
            required
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="مثال: admin_user"
          />

          <label>الاسم (العربية) *</label>
          <input 
            type="text"
            required
            value={nameAr} 
            onChange={(e) => setNameAr(e.target.value)} 
            placeholder="مثال: مسؤول المستخدمين"
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="btn" style={{ flex: 1 }}>حفظ</button>
            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} style={{ flex: 1 }}>إلغاء</button>
          </div>
        </form>
      </ModalPortal>
    </div>
  );
};

export default RolesList;
