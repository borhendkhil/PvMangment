import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [directions, setDirections] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    matricule: '',
    address: '',
    telephone: '',
    directionId: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDirections();
    fetchFunctions();
    fetchEmployees();
  }, []);

  const fetchDirections = async () => {
    try {
      const res = await axios.get(API_CONFIG.ADMIN.DIRECTIONS);
      const dirs = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setDirections(dirs);
    } catch (err) {
      console.error('Erreur directions:', err);
    }
  };

  const fetchFunctions = async () => {
    try {
      const res = await axios.get(API_CONFIG.ADMIN.FONCTIONS);
      const funcs = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setFunctions(funcs);
    } catch (err) {
      console.error('Erreur fonctions:', err);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ADMIN.EMPLOYES);
      let data = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setEmployees(data);
    } catch (err) {
      console.error('Erreur:', err);
      showToast('خطأ في تحميل الموظفين', 'error');
      setEmployees([]);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      prenom: '',
      nom: '',
      address: '',
      telephone: '',
      matricule: '',
      directionId: '',
    });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setFormData({
      prenom: emp.prenom || '',
      nom: emp.nom || '',
      address: emp.address || '',
      telephone: emp.telephone || '',
      matricule: emp.matricule || '',
      directionId: emp.directionId || '',
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.prenom?.trim() || !formData.nom?.trim()) {
      setError('الاسم الأول والأخير مطلوبان');
      return;
    }

    if (!formData.directionId) {
      setError('الإدارة مطلوبة');
      return;
    }

    try {
      const payload = {
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone || null,
        address: formData.address || null,
        matricule: formData.matricule || null,
        directionId: formData.directionId ? parseInt(formData.directionId) : null,
      };

      if (editingId) {
        await axios.patch(`${API_CONFIG.ADMIN.EMPLOYES}/${editingId}`, payload);
        showToast('تم تحديث الموظف بنجاح', 'success');
      } else {
        await axios.post(API_CONFIG.ADMIN.EMPLOYES, payload);
        showToast('تم إضافة الموظف بنجاح', 'success');
      }

      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحفظ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الموظف؟')) return;

    try {
      await axios.delete(`${API_CONFIG.ADMIN.EMPLOYES}/${id}`);
      showToast('تم حذف الموظف بنجاح', 'success');
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحذف';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة الموظفين</h2>
      </div>
      <div className="employes-section" dir="rtl">
        <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة موظف</button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لم يتم العثور على أي موظف</p>
          </div>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>الاسم الأول (الكنية)</th>
                  <th>الاسم (العائلة)</th>
                  <th>العنوان</th>
                  <th>الهاتف</th>
                  <th>الإدارة</th>
                  <th>الوظيفة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.prenom}</td>
                    <td>{emp.nom}</td>
                    <td>{emp.address || '-'}</td>
                    <td>{emp.telephone || '-'}</td>
                    <td>{emp.directionLib || '-'}</td>
                    <td>-</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(emp)}
                        className="icon-btn"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
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
          <h3 style={{ marginBottom: '24px', color: '#00d4ff', fontSize: '20px', fontWeight: '600' }}>
            {editingId ? 'تعديل الموظف' : 'إضافة موظف جديد'}
          </h3>
          {error && <div className="error" style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(255, 71, 87, 0.15)', border: '1px solid #ff4757', color: '#ff9999' }}>{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#b0b0c0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>الاسم الأول (الكنية) *</label>
                <input
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  placeholder="أدخل الاسم الأول"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(0, 212, 255, 0.3)', background: 'rgba(0, 212, 255, 0.05)', color: '#e0e0ff', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#00d4ff'; e.target.style.background = 'rgba(0, 212, 255, 0.1)'; e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'; e.target.style.background = 'rgba(0, 212, 255, 0.05)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#b0b0c0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>الاسم (العائلة) *</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  placeholder="أدخل اسم العائلة"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(0, 212, 255, 0.3)', background: 'rgba(0, 212, 255, 0.05)', color: '#e0e0ff', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#00d4ff'; e.target.style.background = 'rgba(0, 212, 255, 0.1)'; e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'; e.target.style.background = 'rgba(0, 212, 255, 0.05)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#b0b0c0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>رقم الموظف (اختياري)</label>
                <input
                  type="text"
                  value={formData.matricule}
                  onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                  placeholder="أدخل رقم الموظف"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(0, 212, 255, 0.3)', background: 'rgba(0, 212, 255, 0.05)', color: '#e0e0ff', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#00d4ff'; e.target.style.background = 'rgba(0, 212, 255, 0.1)'; e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'; e.target.style.background = 'rgba(0, 212, 255, 0.05)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#b0b0c0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>الهاتف (اختياري)</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  placeholder="أدخل رقم الهاتف"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(0, 212, 255, 0.3)', background: 'rgba(0, 212, 255, 0.05)', color: '#e0e0ff', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#00d4ff'; e.target.style.background = 'rgba(0, 212, 255, 0.1)'; e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'; e.target.style.background = 'rgba(0, 212, 255, 0.05)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#b0b0c0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>العنوان (اختياري)</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="أدخل العنوان"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(0, 212, 255, 0.3)', background: 'rgba(0, 212, 255, 0.05)', color: '#e0e0ff', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#00d4ff'; e.target.style.background = 'rgba(0, 212, 255, 0.1)'; e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'; e.target.style.background = 'rgba(0, 212, 255, 0.05)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#b0b0c0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>الإدارة *</label>
                <select
                  required
                  value={formData.directionId}
                  onChange={(e) => setFormData({...formData, directionId: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(0, 212, 255, 0.3)', background: 'rgba(0, 212, 255, 0.05)', color: '#e0e0ff', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box', cursor: 'pointer' }}
                  onFocus={(e) => { e.target.style.borderColor = '#00d4ff'; e.target.style.background = 'rgba(0, 212, 255, 0.1)'; e.target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'; e.target.style.background = 'rgba(0, 212, 255, 0.05)'; e.target.style.boxShadow = 'none'; }}
                >
                  <option value="" style={{ color: '#666' }}>اختر الإدارة</option>
                  {directions.map(dir => (
                    <option key={dir.id} value={dir.id} style={{ color: '#fff', background: '#1a2a3a' }}>{dir.lib}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button 
                type="submit" 
                className="btn" 
                style={{ 
                  flex: 1,
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                }}
                onMouseEnter={(e) => { e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.5)'; e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)'; e.target.style.transform = 'translateY(0)'; }}
              >
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowModal(false)}
                style={{ 
                  flex: 1,
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(255, 71, 87, 0.5)',
                  background: 'transparent',
                  color: '#ff9999',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 71, 87, 0.1)'; e.target.style.boxShadow = '0 4px 15px rgba(255, 71, 87, 0.2)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none'; }}
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

export default EmployeesList;
