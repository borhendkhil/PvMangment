import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, UserX, UserCheck } from 'lucide-react';
import axios from 'axios';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const API_BASE = 'http://localhost:9091/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchRoles(); fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('users fetch', err);
      showToast('خطأ في جلب المستخدمين', 'error');
      setUsers([]);
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/roles`);
      setRoles(res.data || []);
    } catch (err) {
      console.error('Erreur chargement roles', err);
      showToast('خطأ في جلب الأدوار', 'error');
      setRoles([]);
    }
  };

  const fetchAvailableEmployes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users/available-employes`);
      setEmployes(res.data || []);
    } catch (err) {
      console.error('Erreur chargement employés', err);
      showToast('خطأ في جلب قائمة الموظفين', 'error');
      setEmployes([]);
    }
  };

  const getRoleAr = (u) => {
    if (!u) return '';
    if (u.role && (u.role.labelAr || u.role.label_ar)) return u.role.labelAr || u.role.label_ar;
    // Check in roles array if role is a Set/Array
    if (u.roles && u.roles.length > 0) {
      const role = u.roles[0];
      return role.labelAr || role.label_ar || role.name;
    }
    return 'موظف';
  };

  // Add / Edit / Toggle / Delete states & handlers
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', employeId: '', password: '' });
  const [error, setError] = useState(null);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ email: '', employeId: '', password: '', roleId: '' });
    setError(null);
    fetchAvailableEmployes();
    setShowModal(true);
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setFormData({
      email: u.email || '',
      employeId: '',
      password: ''
    });
    setError(null);
    setShowModal(true);
  };

  const validateForm = (data) => {
    if (!editingUser) {
      // For new user: require employeId, roleId, email and password
      if (!data.employeId) return 'الموظف مطلوب';
      if (!data.roleId) return 'الدور مطلوب';
      if (!data.email || !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(data.email)) return 'البريد الإلكتروني الغير صحيح';
      if (!data.password || data.password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    } else {
      // For edit: require email and password if provided
      if (!data.email || !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(data.email)) return 'البريد الإلكتروني الغير صحيح';
      if (data.password && data.password.length > 0 && data.password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    return null;
  };

  const extractApiError = (err) => {
    if (!err) return 'Erreur inconnue';
    if (err.response && err.response.data) {
      const d = err.response.data;
      if (typeof d === 'string') return d;
      if (d.message) return d.message;
      return JSON.stringify(d);
    }
    return err.message || String(err);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validation = validateForm(formData);
    if (validation) { setError(validation); return; }
    try {
      if (editingUser) {
        const res = await axios.put(`${API_BASE}/admin/users/${editingUser.id}`, {
          email: formData.email,
          password: formData.password || undefined
        });
        setError(res.data?.message || null);
        showToast('تم تحديث المستخدم', 'success');
      } else {
        const res = await axios.post(`${API_BASE}/admin/users`, {
          email: formData.email,
          employeId: parseInt(formData.employeId),
          password: formData.password,
          roleId: parseInt(formData.roleId)
        });
        setError(res.data?.message || null);
        showToast('تم إنشاء المستخدم', 'success');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      const msg = extractApiError(err);
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${id}/toggle`);
      fetchUsers();
      showToast('تم تغيير حالة المستخدم', 'success');
    } catch (err) {
      const msg = extractApiError(err);
      console.error('toggle error', err);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/users/${id}`);
      fetchUsers();
      showToast('تم حذف المستخدم', 'success');
    } catch (err) {
      const msg = extractApiError(err);
      console.error('delete error', err);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="users-section" dir="rtl">
      <button className="btn" onClick={handleAdd}><UserPlus size={18} /> إضافة مستخدم جديد</button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
          <p>جاري التحميل...</p>
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
          <p>لا توجد مستخدمون حالياً</p>
        </div>
      ) : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.nomPrenom}</td>
                  <td>{u.email}</td>
                  <td>{getRoleAr(u)}</td>
                  <td>
                    <span className={u.enabled ? 'status-active' : 'status-inactive'}>
                        {u.enabled ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(u)} className="icon-btn" title="تعديل"><Edit2 size={16} /></button>
                    <button onClick={() => handleToggle(u.id)} className="icon-btn" title={u.enabled ? 'تعطيل' : 'تفعيل'}>{u.enabled ? <UserX size={16} /> : <UserCheck size={16} />}</button>
                    <button onClick={() => handleDelete(u.id)} className="icon-btn" title="حذف"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>{editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSave}>
          {!editingUser && (
            <>
              <label>اختر الموظف</label>
              <select 
                required 
                value={formData.employeId} 
                onChange={(e) => setFormData({...formData, employeId: e.target.value})}
              >
                <option value="">-- اختر موظفاً --</option>
                {employes.length > 0 ? employes.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nomComplet} ({emp.matricule || 'بدون رقم'})
                  </option>
                )) : (
                  <option disabled>لا توجد موظفون متاحون</option>
                )}
              </select>

              <label>الدور</label>
              <select 
                required 
                value={formData.roleId} 
                onChange={(e) => setFormData({...formData, roleId: e.target.value})}
              >
                <option value="">-- اختر الدور --</option>
                {roles.length > 0 ? roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.labelAr || role.label_ar || role.name}
                  </option>
                )) : (
                  <option disabled>لا توجد أدوار متاحة</option>
                )}
              </select>
            </>
          )}

          <label>البريد الإلكتروني</label>
          <input 
            type="email" 
            required 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />

          <label>كلمة المرور {editingUser ? '(اتركها فارغة لعدم التغيير)' : ''}</label>
          <input 
            type="password" 
            required={!editingUser}
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
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

export default UsersManagement;
