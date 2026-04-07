import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Download, Eye, Search } from 'lucide-react';
import axios from 'axios';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';
import usePermissions from '../../hooks/usePermissions';

const BACKEND_BASE = API_CONFIG.BASE;

const buildFileUrl = (storedPath) => {
  if (!storedPath) return '';
  if (/^https?:\/\//i.test(storedPath)) return storedPath;
  return `${BACKEND_BASE}/${storedPath.replace(/^\/+/, '')}`;
};

const ListDecision = ({ sujetId, refreshTrigger }) => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (sujetId) {
      fetchDecisions();
    }
  }, [sujetId, refreshTrigger]);

  const fetchDecisions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.DECISIONS);
      const data = Array.isArray(res.data) ? res.data : [];
      setDecisions(data.filter((decision) => String(decision.sujetId) === String(sujetId)));
    } catch (err) {
      console.error('Error fetching decisions:', err);
      showToast('تعذر جلب المقررات', 'error');
      setDecisions([]);
    }
    setLoading(false);
  };

  const handleViewPdfs = async (decision) => {
    setSelectedDecision(decision);
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.GET_PDFS());
      const data = Array.isArray(res.data) ? res.data : [];
      setPdfs(data.filter((pdf) => String(pdf.decisionId || pdf.decision?.id) === String(decision.id)));
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setPdfs([]);
    }
    setShowPdfModal(true);
  };

  const handleUploadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!hasPermission('MANAGE_DECISION')) {
      showToast('Permission MANAGE_DECISION refusée', 'error');
      return;
    }

    if (file.type !== 'application/pdf') {
      showToast('يجب أن يكون الملف بصيغة PDF', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('decisionId', selectedDecision.id);

      await axios.post(API_CONFIG.DIRECTEUR.PROCESS.UPLOAD_PDF(selectedDecision.id), formData);

      showToast('تم رفع الملف بنجاح', 'success');
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.GET_PDFS());
      const data = Array.isArray(res.data) ? res.data : [];
      setPdfs(data.filter((pdf) => String(pdf.decisionId || pdf.decision?.id) === String(selectedDecision.id)));
    } catch (err) {
      console.error('Error uploading PDF:', err);
      showToast('تعذر رفع الملف', 'error');
    }
  };

  const handleDeletePdf = async (pdfId) => {
    if (window.confirm('هل تريد حذف هذا الملف؟')) {
      try {
        await axios.delete(API_CONFIG.DIRECTEUR.PROCESS.DELETE_PDF(pdfId));
      showToast('تم حذف الملف بنجاح', 'success');
        setPdfs(pdfs.filter(p => p.id !== pdfId));
      } catch (err) {
      showToast('تعذر حذف الملف', 'error');
      }
    }
  };

  const handleDelete = async (decisionId) => {
    if (window.confirm('هل تريد حذف هذا المقرر؟')) {
      try {
        await axios.delete(API_CONFIG.DIRECTEUR.PROCESS.DELETE_DECISION(decisionId));
      showToast('تم حذف القرار بنجاح', 'success');
        fetchDecisions();
      } catch (err) {
      showToast('تعذر حذف القرار', 'error');
      }
    }
  };

  const downloadPdf = (pdfUrl, fileName) => {
    const link = document.createElement('a');
    link.href = buildFileUrl(pdfUrl);
    link.download = fileName;
    link.click();
  };

  if (loading) {
    return <div className="decision-loading">جارٍ التحميل...</div>;
  }

  if (decisions.length === 0) {
    return <div className="decision-empty"><p>لا توجد مقررات</p></div>;
  }

  const filteredDecisions = decisions.filter(decision =>
    (decision.fichierName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (decision.sujetNom || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <div className="decision-search">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: '#69c0e2' }} />
          <input
            type="text"
            placeholder="بحث عن مقرر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredDecisions.length === 0 ? (
        <div className="decision-empty"><p>{searchTerm ? 'لا توجد نتائج' : 'لا توجد مقررات'}</p></div>
      ) : (
      <div style={{ overflowX: 'auto' }}>
        <table className="decision-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الملف</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>الملفات</th>
              <th style={{ width: '200px' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredDecisions.map((decision, index) => (
              <tr key={decision.id}>
                <td>{index + 1}</td>
                <td>{decision.fichierName || `قرار #${decision.id}`}</td>
                <td>{(decision.statut || 'inactive') === 'active' ? 'نشطة' : 'غير نشطة'}</td>
                <td>{formatDateDDMMYYYY(decision.dateCreation)}</td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    className="btn-view-pdfs"
                    onClick={() => handleViewPdfs(decision)}
                    title="عرض الملفات"
                  >
                    <Eye size={14} /> ({pdfs.length || 0})
                  </button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="decision-actions">
                    <button
                      onClick={() => {}}
                      className="btn-edit"
                      title="تعديل"
                    >
                      <Edit2 size={14} />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(decision.id)}
                      className="btn-delete"
                      title="حذف"
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

      {/* PDF Modal */}
      {showPdfModal && (
        <div className="decision-modal" onClick={() => setShowPdfModal(false)}>
          <div className="decision-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>ملفات القرار: {selectedDecision?.fichierName || `#${selectedDecision?.id || ''}`}</h3>

            {pdfs.length > 0 ? (
              <div className="decision-pdfs-list">
                {pdfs.map(pdf => (
                  <div key={pdf.id} className="decision-pdf-item">
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>{pdf.pdfName}</p>
                      <small style={{ color: '#b0b0c0' }}>{formatDateDDMMYYYY(pdf.dateUpload)}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-pdf-download" onClick={() => downloadPdf(pdf.pdfPath, pdf.pdfName)} title="تحميل">
                        <Download size={14} />
                        تحميل
                      </button>
                      <button className="btn-pdf-delete" onClick={() => handleDeletePdf(pdf.id)} title="حذف">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#7a7a8a', padding: '20px' }}>لا توجد ملفات</p>
            )}

            <div className="decision-upload-section">
              <label>رفع ملف PDF جديد:</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleUploadPdf}
              />
            </div>

            <div className="decision-form-buttons">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="btn-cancel"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .decision-search {
          margin-bottom: 20px;
        }

        .decision-search input {
          width: 100%;
          padding: 12px 12px 12px 45px;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(105, 192, 226, 0.3);
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .decision-search input::placeholder {
          color: #7a7a8a;
        }

        .decision-search input:focus {
          outline: none;
          background: rgba(102, 126, 234, 0.15);
          border-color: rgba(105, 192, 226, 0.5);
          box-shadow: 0 0 0 3px rgba(105, 192, 226, 0.1);
        }

        .decision-loading {
          text-align: center;
          padding: 40px 20px;
          color: #b0b0c0;
          font-size: 16px;
        }

        .decision-empty {
          text-align: center;
          padding: 40px 20px;
          color: #7a7a8a;
        }

        .decision-empty p {
          margin: 0;
          font-size: 16px;
        }

        .decision-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(105, 192, 226, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }

        .decision-table thead {
          background: rgba(105, 192, 226, 0.2);
        }

        .decision-table th {
          padding: 14px 16px;
          text-align: right;
          font-weight: 600;
          color: #69c0e2;
          border-bottom: 1px solid rgba(105, 192, 226, 0.3);
          font-size: 14px;
        }

        .decision-table tbody tr {
          border-bottom: 1px solid rgba(105, 192, 226, 0.2);
          transition: background-color 0.2s ease;
        }

        .decision-table tbody tr:hover {
          background-color: rgba(105, 192, 226, 0.15);
        }

        .decision-table tbody tr:last-child {
          border-bottom: none;
        }

        .decision-table td {
          padding: 12px 16px;
          color: #d0d0e0;
          font-size: 14px;
          text-align: right;
        }

        .btn-view-pdfs {
          background: rgba(105, 192, 226, 0.2);
          color: #69c0e2;
          border: 1px solid rgba(105, 192, 226, 0.4);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .btn-view-pdfs:hover {
          background: rgba(105, 192, 226, 0.3);
          border-color: rgba(105, 192, 226, 0.6);
        }

        .decision-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-edit, .btn-delete {
          background: transparent;
          color: #69c0e2;
          border: 1px solid rgba(105, 192, 226, 0.4);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .btn-edit:hover {
          background: rgba(105, 192, 226, 0.2);
          border-color: rgba(105, 192, 226, 0.6);
        }

        .btn-delete {
          color: #ff6b6b;
        }

        .btn-delete:hover {
          background: rgba(255, 107, 107, 0.2);
          border-color: rgba(255, 107, 107, 0.6);
        }

        .decision-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
        }

        .decision-modal-content {
          background: rgba(20, 35, 60, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(105, 192, 226, 0.3);
          border-radius: 12px;
          padding: 30px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .decision-modal-content h3 {
          margin: 0 0 20px 0;
          color: #69c0e2;
          font-size: 18px;
          font-weight: 700;
        }

        .decision-pdfs-list {
          margin-bottom: 20px;
          max-height: 300px;
          overflow-y: auto;
        }

        .decision-pdf-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(105, 192, 226, 0.1);
          border: 1px solid rgba(105, 192, 226, 0.2);
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .btn-pdf-download, .btn-pdf-delete {
          background: transparent;
          color: #69c0e2;
          border: 1px solid rgba(105, 192, 226, 0.4);
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .btn-pdf-download:hover {
          background: rgba(105, 192, 226, 0.2);
          border-color: rgba(105, 192, 226, 0.6);
        }

        .btn-pdf-delete {
          color: #ff6b6b;
        }

        .btn-pdf-delete:hover {
          background: rgba(255, 107, 107, 0.2);
          border-color: rgba(255, 107, 107, 0.6);
        }

        .decision-upload-section {
          margin: 20px 0;
          padding: 20px;
          background: rgba(105, 192, 226, 0.1);
          border: 1px solid rgba(105, 192, 226, 0.2);
          border-radius: 6px;
        }

        .decision-upload-section label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #e2e8f0;
          font-size: 14px;
        }

        .decision-upload-section input[type="file"] {
          width: 100%;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(105, 192, 226, 0.3);
          border-radius: 6px;
          color: #e2e8f0;
          cursor: pointer;
        }

        .decision-form-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn-cancel {
          background: rgba(105, 192, 226, 0.2);
          color: #69c0e2;
          border: 1px solid rgba(105, 192, 226, 0.4);
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: rgba(105, 192, 226, 0.3);
          border-color: rgba(105, 192, 226, 0.6);
        }
      `}</style>
    </>
  );
};

export default ListDecision;
