import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, Download, Eye, Search } from 'lucide-react';
import axios from 'axios';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import { showToast } from '../common/Toaster';

const API_BASE = 'http://localhost:9091/api';

const DecisionManagement = () => {
  const [sujets, setSujets] = useState([]);
  const [expandedSujets, setExpandedSujets] = useState({});
  const [decisions, setDecisions] = useState({});
  const [pdfs, setPdfs] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [currentPdfs, setCurrentPdfs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSujetId, setSelectedSujetId] = useState(null);
  const [formData, setFormData] = useState({ statut: 'brouillon' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSujets();
  }, []);

  const fetchSujets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/directeur/process/sujets`);
      setSujets(res.data || []);
    } catch (err) {
      console.error('Error fetching sujets', err);
      showToast('خطأ في جلب الموضوعات', 'error');
    }
    setLoading(false);
  };

  const toggleSujet = async (sujetId) => {
    setExpandedSujets(prev => {
      const newState = { ...prev, [sujetId]: !prev[sujetId] };
      if (newState[sujetId] && !decisions[sujetId]) {
        fetchDecisionsForSujet(sujetId);
      }
      return newState;
    });
  };

  const fetchDecisionsForSujet = async (sujetId) => {
    try {
      const res = await axios.get(`${API_BASE}/directeur/process/decisions?sujetId=${sujetId}`);
      setDecisions(prev => ({ ...prev, [sujetId]: res.data || [] }));
    } catch (err) {
      console.error('Error fetching decisions:', err);
      showToast('خطأ في جلب المقررات', 'error');
    }
  };

  const handleViewPdfs = async (decision) => {
    setSelectedDecision(decision);
    try {
      const res = await axios.get(`${API_BASE}/directeur/process/pdfs/${decision.id}`);
      setCurrentPdfs(res.data || []);
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setCurrentPdfs([]);
    }
    setShowPdfModal(true);
  };

  const handleAddDecision = (sujetId) => {
    setSelectedSujetId(sujetId);
    setFormData({ statut: 'brouillon' });
    setError(null);
    setShowAddModal(true);
  };

  const handleSubmitDecision = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/directeur/process/decisions`, {
        sujetId: selectedSujetId,
        statut: formData.statut || 'brouillon'
      });
      
      showToast('تم إضافة المقرر بنجاح', 'success');
      setShowAddModal(false);
      fetchDecisionsForSujet(selectedSujetId);
    } catch (err) {
      const msg = err.response?.data?.message || 'خطأ في إضافة المقرر';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDecision = async (decisionId, sujetId) => {
    if (window.confirm('هل تريد حذف هذا المقرر؟')) {
      try {
        await axios.delete(`${API_BASE}/directeur/process/decisions/${decisionId}`);
        showToast('تم حذف المقرر بنجاح', 'success');
        fetchDecisionsForSujet(sujetId);
      } catch (err) {
        showToast('خطأ في حذف المقرر', 'error');
      }
    }
  };

  const handleUploadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('يجب أن يكون الملف PDF', 'error');
      return;
    }

    try {
      const formDataPdf = new FormData();
      formDataPdf.append('file', file);
      formDataPdf.append('decisionId', selectedDecision.id);

      await axios.post(`${API_BASE}/directeur/process/upload-pdf`, formDataPdf, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('تم رفع الملف بنجاح', 'success');
      const res = await axios.get(`${API_BASE}/directeur/process/pdfs/${selectedDecision.id}`);
      setCurrentPdfs(res.data || []);
    } catch (err) {
      console.error('Error uploading PDF:', err);
      showToast('خطأ في رفع الملف', 'error');
    }
  };

  const handleDeletePdf = async (pdfId) => {
    if (window.confirm('هل تريد حذف هذا الملف؟')) {
      try {
        await axios.delete(`${API_BASE}/directeur/process/pdfs/${pdfId}`);
        showToast('تم حذف الملف بنجاح', 'success');
        setCurrentPdfs(currentPdfs.filter(p => p.id !== pdfId));
      } catch (err) {
        showToast('خطأ في حذف الملف', 'error');
      }
    }
  };

  const downloadPdf = (pdfUrl, fileName) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.click();
  };

  const filteredSujets = sujets.filter(sujet =>
    sujet.sujet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ffffff' }}>جاري التحميل...</div>;
  }

  return (
    <div className="decision-management-section" dir="rtl">
      <div className="section-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>إدارة المقررات</h2>
        <button 
          onClick={() => { setSelectedSujetId(null); setFormData({ statut: 'brouillon' }); setError(null); setShowAddModal(true); }}
          style={{
            background: 'linear-gradient(135deg, #69c0e2, #4a9bc7)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.boxShadow = '0 0 15px rgba(105, 192, 226, 0.4)'}
          onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
        >
          <Plus size={16} /> إضافة مقرر
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: '#69c0e2' }} />
        <input
          type="text"
          placeholder="بحث عن موضوع..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 45px',
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(105, 192, 226, 0.3)',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {filteredSujets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ffffff' }}>
          <p>لا توجد مواضيع</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredSujets.map(sujet => (
            <div key={sujet.id} style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(105, 192, 226, 0.3)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Subject Header */}
              <div 
                onClick={() => toggleSujet(sujet.id)}
                style={{
                  background: 'rgba(105, 192, 226, 0.2)',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ChevronDown 
                    size={20}
                    style={{
                      transform: expandedSujets[sujet.id] ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div>
                    <h3 style={{ margin: '0', color: '#69c0e2', fontSize: '16px', fontWeight: '700' }}>
                      {sujet.sujet}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#ffffff' }}>
                      {sujet.description}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddDecision(sujet.id); }}
                  style={{
                    background: 'rgba(105, 192, 226, 0.2)',
                    color: '#69c0e2',
                    border: '1px solid rgba(105, 192, 226, 0.4)',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(105, 192, 226, 0.3)';
                    e.target.style.borderColor = 'rgba(105, 192, 226, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(105, 192, 226, 0.2)';
                    e.target.style.borderColor = 'rgba(105, 192, 226, 0.4)';
                  }}
                >
                  <Plus size={14} /> إضافة
                </button>
              </div>

              {/* Decisions Table */}
              {expandedSujets[sujet.id] && (
                <div style={{ padding: '20px' }}>
                  {!decisions[sujet.id] || decisions[sujet.id].length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>لا توجد مقررات</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        background: 'rgba(102, 126, 234, 0.05)',
                        border: '1px solid rgba(105, 192, 226, 0.2)',
                        borderRadius: '6px'
                      }}>
                        <thead>
                          <tr style={{ background: 'rgba(105, 192, 226, 0.15)' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#69c0e2', borderBottom: '1px solid rgba(105, 192, 226, 0.2)', fontSize: '12px', fontWeight: '600' }}>#</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#69c0e2', borderBottom: '1px solid rgba(105, 192, 226, 0.2)', fontSize: '12px', fontWeight: '600' }}>الحالة</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#69c0e2', borderBottom: '1px solid rgba(105, 192, 226, 0.2)', fontSize: '12px', fontWeight: '600' }}>التاريخ</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', color: '#69c0e2', borderBottom: '1px solid rgba(105, 192, 226, 0.2)', fontSize: '12px', fontWeight: '600' }}>الملفات</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', color: '#69c0e2', borderBottom: '1px solid rgba(105, 192, 226, 0.2)', fontSize: '12px', fontWeight: '600' }}>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {decisions[sujet.id].map((decision, index) => (
                            <tr key={decision.id} style={{ borderBottom: '1px solid rgba(105, 192, 226, 0.1)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(105, 192, 226, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ padding: '12px 16px', color: '#ffffff', fontSize: '13px', textAlign: 'right' }}>{index + 1}</td>
                              <td style={{ padding: '12px 16px', color: '#69c0e2', fontSize: '13px', textAlign: 'right', fontWeight: '600' }}>{decision.statut || '-'}</td>
                              <td style={{ padding: '12px 16px', color: '#ffffff', fontSize: '13px', textAlign: 'right' }}>{formatDateDDMMYYYY(decision.dateCreation)}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <button
                                  onClick={() => handleViewPdfs(decision)}
                                  style={{
                                    background: 'rgba(105, 192, 226, 0.2)',
                                    color: '#69c0e2',
                                    border: '1px solid rgba(105, 192, 226, 0.4)',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(105, 192, 226, 0.3)';
                                    e.target.style.borderColor = 'rgba(105, 192, 226, 0.6)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(105, 192, 226, 0.2)';
                                    e.target.style.borderColor = 'rgba(105, 192, 226, 0.4)';
                                  }}
                                >
                                  <Eye size={13} /> عرض الملفات
                                </button>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    style={{
                                      background: 'transparent',
                                      color: '#ff6b6b',
                                      border: '1px solid rgba(255, 107, 107, 0.4)',
                                      padding: '6px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      transition: 'all 0.2s'
                                    }}
                                    onClick={() => handleDeleteDecision(decision.id, sujet.id)}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Decision Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: 'rgba(20, 35, 60, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(105, 192, 226, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', color: '#69c0e2', fontSize: '18px', fontWeight: '700' }}>إضافة مقرر جديد</h3>
            
            {error && <div style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
            
            <form onSubmit={handleSubmitDecision}>
              {!selectedSujetId && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>الموضوع *</label>
                  <select
                    value={selectedSujetId || ''}
                    onChange={(e) => setSelectedSujetId(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(105, 192, 226, 0.3)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2369c0e2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '20px',
                      paddingRight: '35px'
                    }}
                  >
                    <option value="" style={{ color: '#ffffff', background: 'rgba(20, 35, 60, 0.95)' }}>اختر موضوع...</option>
                    {sujets.map(sujet => (
                      <option key={sujet.id} value={sujet.id} style={{ color: '#ffffff', background: 'rgba(20, 35, 60, 0.95)' }}>
                        {sujet.sujet}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>الحالة</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(105, 192, 226, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  <option value="brouillon">مسودة</option>
                  <option value="approuvée">موافق عليها</option>
                  <option value="rejetée">مرفوضة</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'rgba(105, 192, 226, 0.2)',
                    color: '#69c0e2',
                    border: '1px solid rgba(105, 192, 226, 0.4)',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedSujetId}
                  style={{
                    background: 'rgba(105, 192, 226, 0.3)',
                    color: '#69c0e2',
                    border: '1px solid rgba(105, 192, 226, 0.5)',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    opacity: (submitting || !selectedSujetId) ? 0.6 : 1
                  }}
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999
        }} onClick={() => setShowPdfModal(false)}>
          <div style={{
            background: 'rgba(20, 35, 60, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(105, 192, 226, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', color: '#69c0e2', fontSize: '18px', fontWeight: '700' }}>
              ملفات المقرر #{selectedDecision?.id}
            </h3>

            {currentPdfs.length > 0 ? (
              <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                {currentPdfs.map(pdf => (
                  <div key={pdf.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    background: 'rgba(105, 192, 226, 0.1)',
                    border: '1px solid rgba(105, 192, 226, 0.2)',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: '500', color: '#ffffff' }}>{pdf.fileName}</p>
                      <small style={{ color: '#ffffff' }}>{formatDateDDMMYYYY(pdf.dateCreation)}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => downloadPdf(pdf.filePath, pdf.fileName)}
                        style={{
                          background: 'rgba(105, 192, 226, 0.2)',
                          color: '#69c0e2',
                          border: '1px solid rgba(105, 192, 226, 0.4)',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Download size={12} /> تحميل
                      </button>
                      <button
                        onClick={() => handleDeletePdf(pdf.id)}
                        style={{
                          background: 'rgba(255, 107, 107, 0.2)',
                          color: '#ff6b6b',
                          border: '1px solid rgba(255, 107, 107, 0.4)',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={12} /> حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>لا توجد ملفات</p>
            )}

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(105, 192, 226, 0.2)' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#ffffff', fontSize: '13px' }}>رفع ملف PDF جديد:</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleUploadPdf}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(105, 192, 226, 0.3)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setShowPdfModal(false)}
                style={{
                  background: 'rgba(105, 192, 226, 0.2)',
                  color: '#69c0e2',
                  border: '1px solid rgba(105, 192, 226, 0.4)',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionManagement;
