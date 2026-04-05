import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Download, Eye, Users } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import usePermissions from '../../hooks/usePermissions';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';
import PDFViewer from '../PDFViewer';
import MembreComiteManagement from './MembreComiteManagement';
import ModalPortal from '../common/ModalPortal';

const ComitesManagement = () => {
  const [comites, setComites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingComite, setEditingComite] = useState(null);
  const [formData, setFormData] = useState({ sujet: '', file: null });
  const [error, setError] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [membresModalOpen, setMembresModalOpen] = useState(false);
  const [selectedComiteForMembers, setSelectedComiteForMembers] = useState(null);

  const { hasPermission } = usePermissions();

  useEffect(() => { fetchComites(); }, []);

  const fetchComites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_CONFIG.DIRECTEUR.COMITES, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComites(res.data || []);
    } catch (err) {
      console.error('Error fetching comites', err);
      showToast('خطأ في جلب اللجان', 'error');
      setComites([]);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setEditingComite(null);
    setFormData({ sujet: '', file: null });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingComite(c);
    setFormData({
      sujet: c.sujet || '',
      file: null
    });
    setError(null);
    setShowModal(true);
  };

  const validateForm = (data) => {
    if (!data.sujet || data.sujet.trim().length < 3) return 'الموضوع مطلوب (3 أحرف على الأقل)';
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validation = validateForm(formData);
    if (validation) {
      setError(validation);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('sujet', formData.sujet);
      if (formData.file) {
        formDataToSend.append('decisionPdf', formData.file);
      }

      if (editingComite) {
        await axios.put(`${API_CONFIG.DIRECTEUR.COMITES}/${editingComite.idComite}`, formDataToSend, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        showToast('تم تحديث اللجنة', 'success');
      } else {
        await axios.post(API_CONFIG.DIRECTEUR.COMITES, formDataToSend, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        showToast('تم إنشاء لجنة جديدة', 'success');
      }
      setShowModal(false);
      fetchComites();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'خطأ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذه اللجنة؟')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_CONFIG.DIRECTEUR.COMITES}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchComites();
      showToast('تم حذف اللجنة', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'خطأ';
      showToast(msg, 'error');
    }
  };

  const handleFileChange = (e) => {
    setFormData({...formData, file: e.target.files[0]});
  };

  const handleManageMembers = (comite) => {
    setSelectedComiteForMembers(comite);
    setMembresModalOpen(true);
  };

  const handleViewPdf = async (comite) => {
    if (!comite.decisionPdf) {
      showToast('لا يوجد ملف قرار لهذه اللجنة', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Starting PDF fetch from:', `${API_CONFIG.DIRECTEUR.COMITES}/${comite.idComite}/view`);
      
      // 1. Récupérer le fichier en tant que blob
      const response = await axios.get(`${API_CONFIG.DIRECTEUR.COMITES}/${comite.idComite}/view`, {
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 30000 // 30 secondes timeout
      });

      console.log('Response status:', response.status);
      console.log('Response data type:', response.data.type);
      console.log('Response data size:', response.data.size, 'bytes');

      // 2. Créer une URL locale pour ce blob
      const file = new Blob([response.data], { type: 'application/pdf' });
      console.log('Blob created, size:', file.size, 'bytes');
      
      const fileURL = URL.createObjectURL(file);
      console.log('Object URL created:', fileURL);

      // 3. Passer cette URL au visualiseur
      setPdfTitle(`قرار اللجنة: ${comite.sujet}`);
      setViewingPdf(fileURL);
      console.log('PDF viewer state updated');
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.status,
        data: err.response?.data
      });
      showToast(`خطأ في تحميل الملف: ${err.message}`, 'error');
    }
  };

  return (
    <div className="comites-section" dir="rtl">
      <div className="section-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', color: '#1a472a', margin: 0 }}>إدارة اللجان</h2>
        <button 
          className="btn-primary" 
          onClick={openAdd}
          style={{
            background: 'linear-gradient(135deg, #1a472a, #0d2818)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={20} /> إنشاء لجنة جديدة
        </button>
      </div>

      {loading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>جاري التحميل...</div>
      ) : comites.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>لا توجد لجان حتى الآن</div>
      ) : (
        <div className="comites-table" style={{
          background: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: '600' }}>الموضوع</th>
                <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: '600' }}>التاريخ</th>
                <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: '600' }}>القرار</th>
                <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: '600' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {comites.map(c => (
                <tr key={c.id || c.idComite} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '15px 20px' }}>{c.sujet}</td>
                  <td style={{ padding: '15px 20px' }}>{formatDateDDMMYYYY(c.dateCreation)}</td>
                  <td style={{ padding: '15px 20px' }}>
                    {c.decisionPdf ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleViewPdf(c)} 
                          title="عرض القرار"
                          style={{
                            background: '#e0f2fe',
                            color: '#0284c7',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <a 
                          href={`${API_CONFIG.DIRECTEUR.COMITES}/${c.id || c.idComite}/download`} 
                          target="_blank" 
                          rel="noreferrer" 
                          title="تحميل القرار"
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    ) : <span style={{ color: '#999' }}>-</span>}
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => openEdit(c)} 
                        title="تعديل"
                        style={{
                          background: '#fef3c7',
                          color: '#d97706',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleManageMembers(c)} 
                        title="إدارة الأعضاء"
                        style={{
                          background: '#f3e8ff',
                          color: '#7c3aed',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Users size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id || c.idComite)} 
                        title="حذف"
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            background: '#1a472a',
            color: 'white',
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>{editingComite ? 'تعديل اللجنة' : 'إنشاء لجنة جديدة'}</h3>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '28px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '15px',
                borderLeft: '4px solid #dc2626'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  الموضوع *
                </label>
                <input 
                  type="text" 
                  required 
                  value={formData.sujet} 
                  onChange={(e) => setFormData({...formData, sujet: e.target.value})} 
                  placeholder="أدخل موضوع اللجنة"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  ملف القرار (PDF)
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  placeholder="اختر ملف"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {formData.file && (
                  <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                    الملف المختار: {formData.file.name}
                  </small>
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px'
              }}>
                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #1a472a, #0d2818)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  حفظ
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'transparent',
                    color: '#666',
                    border: '1px solid #ddd',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>

      {viewingPdf && (
        <PDFViewer 
          pdfUrl={viewingPdf} 
          title={pdfTitle}
          onClose={() => {
            URL.revokeObjectURL(viewingPdf);
            setViewingPdf(null);
          }}
        />
      )}

      {membresModalOpen && selectedComiteForMembers && (
        <MembreComiteManagement 
          idComite={selectedComiteForMembers.idComite}
          onClose={() => {
            setMembresModalOpen(false);
            setSelectedComiteForMembers(null);
          }}
        />
      )}
    </div>
  );
};

export default ComitesManagement;
