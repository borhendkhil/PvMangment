import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const API_BASE = 'http://localhost:9091/api';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    telephone: '',
    address: '',
    direction_id: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, dirRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/employes`),
        axios.get(`${API_BASE}/admin/directions`)
      ]);

      let empData = Array.isArray(empRes.data) ? empRes.data : empRes.data?.content || [];
      let dirData = Array.isArray(dirRes.data) ? dirRes.data : dirRes.data?.content || [];

      setEmployees(empData);
      setDirections(dirData);
    } catch (err) {
      console.error('خطأ:', err);
      showToast('خطأ في تحميل البيانات', 'error');
    }
    setLoading(false);
  };

  const getDirectionName = (emp) => {
    // DTO retourne directionLib directement
    if (emp.directionLib) return emp.directionLib;
    // Fallback: chercher dans le tableau directions
    const dirId = emp.directionId || emp.direction_id;
    const dir = directions.find(d => d.id === parseInt(dirId));
    return dir?.lib || '-';
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      telephone: '',
      address: '',
      directionId: ''
    });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setFormData({
      matricule: emp.matricule || '',
      nom: emp.nom || '',
      prenom: emp.prenom || '',
      telephone: emp.telephone || '',
      address: emp.address || '',
      directionId: emp.directionId ? String(emp.directionId) : ''
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.nom?.trim()) {
      setError('الاسم مطلوب');
      return;
    }
    if (!formData.prenom?.trim()) {
      setError('اللقب مطلوب');
      return;
    }

    try {
      const payload = {
        matricule: formData.matricule || null,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone || null,
        address: formData.address || null,
        direction: formData.directionId ? { id: parseInt(formData.directionId) } : null
      };

      if (editingId) {
        await axios.put(`${API_BASE}/admin/employes/${editingId}`, payload);
        showToast('تم تحديث الموظف بنجاح', 'success');
      } else {
        await axios.post(`${API_BASE}/admin/employes`, payload);
        showToast('تم إضافة موظف جديد', 'success');
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحفظ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الموظف؟')) return;

    try {
      await axios.delete(`${API_BASE}/admin/employes/${id}`);
      showToast('تم حذف الموظف بنجاح', 'success');
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحذف';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="users-section" dir="rtl">
      <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة موظف جديد</button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
          <p>جاري التحميل...</p>
        </div>
      ) : employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
          <p>لم يتم العثور على أي موظفين</p>
        </div>
      ) : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>رقم موظف</th>
                <th>اللقب</th>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>الإدارة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.matricule || '-'}</td>
                  <td>{emp.prenom}</td>
                  <td>{emp.nom}</td>
                  <td>{emp.telephone || '-'}</td>
                  <td>{getDirectionName(emp)}</td>
                  <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(emp)}
                      title="تعديل"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleDelete(emp.id)}
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
        <h3>{editingId ? 'تعديل الموظف' : 'إضافة موظف'}</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSave}>
          <label>رقم موظف (اختياري)</label>
          <input
            type="text"
            value={formData.matricule}
            onChange={(e) => setFormData({...formData, matricule: e.target.value})}
            placeholder="أدخل رقم الموظف"
          />

          <label>اللقب *</label>
          <input
            type="text"
            required
            value={formData.prenom}
            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            placeholder="أدخل اللقب"
          />

          <label>الاسم *</label>
          <input
            type="text"
            required
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            placeholder="أدخل الاسم"
          />

          <label>الهاتف (اختياري)</label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
            placeholder="أدخل رقم الهاتف"
          />

          <label>العنوان (اختياري)</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="أدخل العنوان"
          />

          <label>الإدارة</label>
          <select
            value={formData.direction_id}
            onChange={(e) => setFormData({...formData, direction_id: e.target.value})}
          >
            <option value="">-- اختر الإدارة --</option>
            {directions.map(dir => (
              <option key={dir.id} value={dir.id}>{getDirectionName(dir.id)}</option>
            ))}
          </select>

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
  );
};

export default EmployeeManagement;
