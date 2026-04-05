import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const EmployeFonctionsList = () => {
  const [employeeFonctions, setEmployeeFonctions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    employeId: '',
    fonctionId: '',
    dateDebut: '',
    dateFin: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchFunctions();
    fetchEmployeeFonctions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_CONFIG.ADMIN.EMPLOYES);
      const emps = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setEmployees(emps);
    } catch (err) {
      console.error('Erreur employés:', err);
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

  const fetchEmployeeFonctions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ADMIN.EMPLOYE_FONCTIONS);
      let data = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setEmployeeFonctions(data);
    } catch (err) {
      console.error('Erreur:', err);
      showToast('خطأ في تحميل الوظائف الموكلة', 'error');
      setEmployeeFonctions([]);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      employeId: '',
      fonctionId: '',
      dateDebut: '',
      dateFin: '',
    });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (ef) => {
    setEditingId(ef.id);
    setFormData({
      employeId: ef.employeId || '',
      fonctionId: ef.fonctionId || '',
      dateDebut: ef.dateDebut ? ef.dateDebut.split('T')[0] : '',
      dateFin: ef.dateFin ? ef.dateFin.split('T')[0] : '',
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.employeId || !formData.fonctionId) {
      setError('الموظف والوظيفة مطلوبان');
      return;
    }

    try {
      const payload = {
        employe: { id: parseInt(formData.employeId) },
        fonction: { id: parseInt(formData.fonctionId) },
        dateDebut: formData.dateDebut || null,
        dateFin: formData.dateFin || null,
      };

      if (editingId) {
        await axios.put(`${API_CONFIG.ADMIN.EMPLOYE_FONCTIONS}/${editingId}`, payload);
        showToast('تم تحديث الوظيفة الموكلة بنجاح', 'success');
      } else {
        await axios.post(API_CONFIG.ADMIN.EMPLOYE_FONCTIONS, payload);
        showToast('تم إضافة الوظيفة الموكلة بنجاح', 'success');
      }

      setShowModal(false);
      fetchEmployeeFonctions();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحفظ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الوظيفة الموكلة؟')) return;

    try {
      await axios.delete(`${API_CONFIG.ADMIN.EMPLOYE_FONCTIONS}/${id}`);
      showToast('تم حذف الوظيفة الموكلة بنجاح', 'success');
      fetchEmployeeFonctions();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحذف';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة الوظائف الموكلة</h2>
      </div>
      <div className="employes-section" dir="rtl">
        <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة وظيفة موكلة</button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : employeeFonctions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لم يتم العثور على أي وظيفة موكلة</p>
          </div>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>الموظف</th>
                  <th>الوظيفة</th>
                  <th>تاريخ البداية</th>
                  <th>تاريخ النهاية</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {employeeFonctions.map(ef => (
                  <tr key={ef.id}>
                    <td>{`${ef.employePrenom} ${ef.employeNom}`}</td>
                    <td>{ef.fonctionLabel || '-'}</td>
                    <td>{formatDateDDMMYYYY(ef.dateDebut)}</td>
                    <td>{formatDateDDMMYYYY(ef.dateFin)}</td>
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(ef)}
                        className="icon-btn"
                        title="تعديل"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ef.id)}
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
          <h3>{editingId ? 'تعديل الوظيفة الموكلة' : 'إضافة وظيفة موكلة جديدة'}</h3>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSave}>
            <label>الموظف *</label>
            <select
              required
              value={formData.employeId}
              onChange={(e) => setFormData({...formData, employeId: e.target.value})}
            >
              <option value="">اختر الموظف</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {`${emp.prenom} ${emp.nom}`}
                </option>
              ))}
            </select>

            <label>الوظيفة *</label>
            <select
              required
              value={formData.fonctionId}
              onChange={(e) => setFormData({...formData, fonctionId: e.target.value})}
            >
              <option value="">اختر الوظيفة</option>
              {functions.map(func => (
                <option key={func.id} value={func.id}>{func.labelAr || func.label_ar || func.name}</option>
              ))}
            </select>

            <label>تاريخ البداية (اختياري)</label>
            <input
              type="date"
              value={formData.dateDebut}
              onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
            />

            <label>تاريخ النهاية (اختياري)</label>
            <input
              type="date"
              value={formData.dateFin}
              onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
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

export default EmployeFonctionsList;
