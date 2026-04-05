import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';

const ListSujetDecision = ({ refreshTrigger, onEdit }) => {
  const [sujets, setSujets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ sujet: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSujets();
  }, [refreshTrigger]);

  const fetchSujets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.SUJETS);
      setSujets(response.data);
    } catch (error) {
      console.error('Erreur chargement sujets:', error);
      showToast('Erreur lors du chargement des sujets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (sujetData) => {
    setEditingId(sujetData.id);
    setEditFormData({
      sujet: sujetData.sujet || '',
      description: sujetData.description || ''
    });
    setShowEditModal(true);
    onEdit?.(sujetData);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.sujet.trim()) {
      showToast('الموضوع مطلوب', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `${API_CONFIG.DIRECTEUR.PROCESS.SUJETS}/${editingId}`,
        editFormData
      );
      showToast('تم تحديث الموضوع بنجاح', 'success');
      setShowEditModal(false);
      fetchSujets();
    } catch (error) {
      console.error('Error:', error);
      showToast(
        error.response?.data?.message || 'حدث خطأ في العملية',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
      return;
    }

    try {
      await axios.delete(`${API_CONFIG.DIRECTEUR.PROCESS.SUJETS}/${id}`);
      showToast('تم حذف الموضوع بنجاح', 'success');
      fetchSujets();
    } catch (error) {
      console.error('Error:', error);
      showToast('خطأ في حذف الموضوع', 'error');
    }
  };

  const filteredSujets = sujets.filter(sujet =>
    sujet.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sujet.description && sujet.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* Search Bar */}
      <div className="sujet-decision-search">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: '#69c0e2' }} />
          <input
            type="text"
            placeholder="بحث عن موضوع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="sujet-decision-loading">جاري التحميل...</div>
      ) : filteredSujets.length === 0 ? (
        <div className="sujet-decision-empty">
          <p>{searchTerm ? 'لا توجد نتائج' : 'لا توجد موضوعات'}</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="sujet-decision-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الموضوع</th>
                <th>الوصف</th>
                <th style={{ width: '200px' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSujets.map((sujet, index) => (
                <tr key={sujet.id}>
                  <td>{index + 1}</td>
                  <td>{sujet.sujet}</td>
                  <td>{sujet.description || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="sujet-decision-actions">
                      <button
                        onClick={() => handleEditClick(sujet)}
                        className="btn-edit"
                      >
                        <Edit2 size={14} />
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(sujet.id)}
                        className="btn-delete"
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="sujet-decision-modal" onClick={() => setShowEditModal(false)}>
          <div className="sujet-decision-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>تعديل الموضوع</h3>

            <form onSubmit={handleEditSubmit}>
              <div className="sujet-decision-form-group">
                <label>الموضوع *</label>
                <input
                  type="text"
                  value={editFormData.sujet}
                  onChange={(e) => setEditFormData({ ...editFormData, sujet: e.target.value })}
                  placeholder="أدخل الموضوع"
                />
              </div>

              <div className="sujet-decision-form-group">
                <label>الوصف</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="أدخل وصف الموضوع"
                />
              </div>

              <div className="sujet-decision-form-buttons">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-cancel"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-submit"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ListSujetDecision;
