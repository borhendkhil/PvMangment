import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import ModalPortal from '../common/ModalPortal';

const API_BASE = 'http://localhost:9091/api';

const EmployeFonctionManagement = () => {
  const [employeFonctions, setEmployeFonctions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  const [directions, setDirections] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState('');
  
  const [formData, setFormData] = useState({
    employe_id: '',
    fonction_id: '',
    date_debut: '',
    date_fin: '',
    is_active: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterEmployeesByDirection();
  }, [selectedDirection, employees]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [efRes, dirRes, empRes, fonRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/employe-fonctions`),
        axios.get(`${API_BASE}/admin/directions`),
        axios.get(`${API_BASE}/admin/employes`),
        axios.get(`${API_BASE}/admin/fonctions`)
      ]);

      const extractData = (res) => Array.isArray(res.data) ? res.data : res.data?.content || [];

      setEmployeFonctions(extractData(efRes));
      setDirections(extractData(dirRes));
      setEmployees(extractData(empRes));
      setFonctions(extractData(fonRes));
    } catch (err) {
      console.error('خطأ:', err);
      showToast('خطأ في تحميل البيانات', 'error');
    }
    setLoading(false);
  };

  const filterEmployeesByDirection = () => {
    if (!selectedDirection) {
      setFilteredEmployees([]);
      return;
    }

    const dirId = parseInt(selectedDirection);
    const filtered = employees.filter(emp => 
      parseInt(emp.directionId) === dirId
    );
    setFilteredEmployees(filtered);
  };

  const getEmployeeName = (ef) => {
    // DTO retourne employeNom et employePrenom directement
    if (ef.employeNom && ef.employePrenom) {
      return `${ef.employePrenom} ${ef.employeNom}`.trim();
    }
    // Fallback
    const emp = employees.find(e => e.id === parseInt(ef.employeId || ef.employe_id));
    if (!emp) return '-';
    return `${emp.prenom} ${emp.nom}`.trim();
  };

  const getDirectionName = (ef) => {
    // Trouver l'employé pour obtenir sa direction
    const emp = employees.find(e => e.id === parseInt(ef.employeId || ef.employe_id));
    if (emp && emp.directionLib) return emp.directionLib;
    if (emp && emp.directionId) {
      const dir = directions.find(d => d.id === parseInt(emp.directionId));
      return dir?.lib || '-';
    }
    return '-';
  };

  const getFonctionName = (ef) => {
    // DTO retourne fonctionLabel directement
    if (ef.fonctionLabel) return ef.fonctionLabel;
    // Fallback
    const f = fonctions.find(fn => fn.id === parseInt(ef.fonctionId || ef.fonction_id));
    return f?.labelAr || f?.name || '-';
  };

  const handleAdd = () => {
    setEditingId(null);
    setSelectedDirection('');
    setFormData({
      employeId: '',
      fonctionId: '',
      dateDebut: '',
      dateFin: '',
      isActive: true
    });
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (ef) => {
    setEditingId(ef.id);
    // Trouver l'employé pour obtenir sa direction
    const emp = employees.find(e => e.id === ef.employeId);
    const dirId = emp?.directionId;
    setSelectedDirection(dirId ? String(dirId) : '');
    setFormData({
      employeId: ef.employeId ? String(ef.employeId) : '',
      fonctionId: ef.fonctionId ? String(ef.fonctionId) : '',
      dateDebut: ef.dateDebut || '',
      dateFin: ef.dateFin || '',
      isActive: ef.isActive !== undefined ? ef.isActive : true
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.employeId) {
      setError('الموظف مطلوب');
      return;
    }
    if (!formData.fonctionId) {
      setError('الوظيفة مطلوبة');
      return;
    }
    if (!formData.dateDebut) {
      setError('تاريخ البداية مطلوب');
      return;
    }

    try {
      const payload = {
        employe: { id: parseInt(formData.employeId) },
        fonction: { id: parseInt(formData.fonctionId) },
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || null,
        isActive: formData.isActive
      };

      if (editingId) {
        await axios.put(`${API_BASE}/admin/employe-fonctions/${editingId}`, payload);
        showToast('تم تحديث الوظيفة بنجاح', 'success');
      } else {
        await axios.post(`${API_BASE}/admin/employe-fonctions`, payload);
        showToast('تم إضافة الوظيفة بنجاح', 'success');
      }

      setShowModal(false);
      fetchAllData();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحفظ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذه الوظيفة؟')) return;

    try {
      await axios.delete(`${API_BASE}/admin/employe-fonctions/${id}`);
      showToast('تم حذف الوظيفة بنجاح', 'success');
      fetchAllData();
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في الحذف';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="users-section" dir="rtl">
      <button className="btn" onClick={handleAdd}><Plus size={18} /> إضافة وظيفة</button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
          <p>جاري التحميل...</p>
        </div>
      ) : employeFonctions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
          <p>لم يتم العثور على وظائف الموظفين</p>
        </div>
      ) : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>الموظف</th>
                <th>الإدارة</th>
                <th>الوظيفة</th>
                <th>تاريخ البداية</th>
                <th>تاريخ النهاية</th>
                <th>نشط</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employeFonctions.map(ef => (
                <tr key={ef.id}>
                  <td>{getEmployeeName(ef)}</td>
                  <td>{getDirectionName(ef)}</td>
                  <td>{getFonctionName(ef)}</td>
                  <td>{ef.dateDebut || '-'}</td>
                  <td>{ef.dateFin || '-'}</td>
                  <td>
                    <span className={ef.isActive ? 'status-active' : 'status-inactive'}>
                      {ef.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(ef)}
                      title="تعديل"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleDelete(ef.id)}
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
        <h3>{editingId ? 'تعديل الوظيفة' : 'إضافة وظيفة'}</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSave}>
          <label>الإدارة *</label>
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
            required
          >
            <option value="">-- اختر الإدارة --</option>
            {directions.map(dir => (
              <option key={dir.id} value={dir.id}>{dir.lib}</option>
            ))}
          </select>

          <label>الموظف *</label>
          <select
            value={formData.employeId}
            onChange={(e) => setFormData({...formData, employeId: e.target.value})}
            required
            disabled={!selectedDirection}
          >
            <option value="">
              {!selectedDirection 
                ? '-- اختر الإدارة أولا --' 
                : filteredEmployees.length === 0 
                  ? '-- لا بوجد موظفين في هذه الإدارة --' 
                  : '-- اختر موظف --'}
            </option>
            {filteredEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.prenom} {emp.nom}
              </option>
            ))}
          </select>

          <label>الوظيفة *</label>
          <select
            value={formData.fonctionId}
            onChange={(e) => setFormData({...formData, fonctionId: e.target.value})}
            required
          >
            <option value="">-- اختر الوظيفة --</option>
            {fonctions.map(f => (
              <option key={f.id} value={f.id}>{f.labelAr || f.name}</option>
            ))}
          </select>

          <label>تاريخ البداية *</label>
          <input
            type="date"
            required
            value={formData.dateDebut}
            onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
          />

          <label>تاريخ النهاية (اختياري)</label>
          <input
            type="date"
            value={formData.dateFin}
            onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
          />

          <div style={{ margin: '16px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <span>نشط</span>
            </label>
          </div>

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

export default EmployeFonctionManagement;
