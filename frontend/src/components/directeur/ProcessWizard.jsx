import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, FileText, CheckCircle, X, Upload } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';
import '../../styles/admindashboard.css';
import usePermissions from '../../hooks/usePermissions';

const ProcessWizard = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [sujets, setSujets] = useState([]);
  const [selectedSujet, setSelectedSujet] = useState(null);
  const [newSujet, setNewSujet] = useState({ sujet: '', description: '' });
  const [loadingSujets, setLoadingSujets] = useState(false);
  const [decisionData, setDecisionData] = useState({ statut: 'active' });
  const [decisionId, setDecisionId] = useState(null);
  const [decisionFile, setDecisionFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (step === 1) {
      fetchSujets();
    }
  }, [step]);

  const fetchSujets = async () => {
    setLoadingSujets(true);
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.SUJETS);
      setSujets(res.data || []);
    } catch (err) {
      console.error('Erreur chargement sujets', err);
      showToast('تعذر تحميل المواضيع', 'error');
    } finally {
      setLoadingSujets(false);
    }
  };

  const handleCreateSujet = async () => {
    if (!newSujet.sujet.trim()) {
      showToast('الموضوع إلزامي', 'error');
      return;
    }

    try {
      const res = await axios.post(API_CONFIG.DIRECTEUR.PROCESS.SUJETS, newSujet);
      setSujets([...sujets, res.data]);
      setSelectedSujet(res.data.id);
      setNewSujet({ sujet: '', description: '' });
      showToast('تم إنشاء الموضوع بنجاح', 'success');
    } catch (err) {
      console.error('ProcessWizard subject creation failed:', {
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
        newSujet,
      });
      showToast('تعذر إنشاء الموضوع', 'error');
    }
  };

  const handleCreateDecision = async () => {
    if (!selectedSujet) {
      showToast('يرجى اختيار موضوع', 'error');
      return null;
    }

    try {
      const payload = {
        sujetId: selectedSujet,
        statut: decisionData.statut,
      };
      const res = await axios.post(API_CONFIG.DIRECTEUR.PROCESS.DECISIONS, payload);
      showToast('تم إنشاء القرار', 'success');
      return res.data?.id || null;
    } catch (err) {
      console.error('ProcessWizard decision creation failed:', {
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
        selectedSujet,
        decisionData,
      });
      showToast('تعذر إنشاء القرار', 'error');
      throw err;
    }
  };

  const handleUploadFile = async (id) => {
    if (!decisionFile || !id) {
      return;
    }

    if (!hasPermission('MANAGE_DECISION')) {
      showToast('Permission MANAGE_DECISION refusée, le fichier ne sera pas envoyé', 'warning');
      return false;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('files', decisionFile);
      await axios.post(API_CONFIG.DIRECTEUR.PROCESS.UPLOAD_FILE(id), formData);
      showToast('تم رفع الملف بنجاح', 'success');
    } catch (err) {
      console.error('ProcessWizard upload failed:', {
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
        decisionId: id,
        fileName: decisionFile?.name,
      });
      showToast('تعذر رفع الملف', 'error');
      throw err;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleNext = async () => {
    if (step === 1 && !selectedSujet) {
      showToast('يرجى اختيار أو إنشاء موضوع', 'error');
      return;
    }

    if (step === 2) {
      try {
        const id = await handleCreateDecision();
        setDecisionId(id);
        setStep(3);
      } catch (err) {
        console.error('ProcessWizard step 2 failed:', {
          message: err?.message,
          responseStatus: err?.response?.status,
          responseData: err?.response?.data,
          selectedSujet,
          decisionData,
        });
        return;
      }
      return;
    }

    if (step === 3) {
      try {
        if (decisionFile && decisionId) {
          await handleUploadFile(decisionId);
        }
        showToast('تم إتمام العملية بنجاح!', 'success');
        onSuccess && onSuccess();
        onClose && onClose();
      } catch (err) {
        console.error('ProcessWizard step 3 failed:', {
          message: err?.message,
          responseStatus: err?.response?.status,
          responseData: err?.response?.data,
          decisionId,
          decisionFileName: decisionFile?.name,
        });
        return;
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '720px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        direction: 'rtl',
        fontFamily: 'Tajawal, sans-serif'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #69c0e2 0%, #327e9e 100%)',
          padding: '20px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <h2 style={{ margin: 0 }}>إنشاء قرار</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          background: '#f5f5f5',
          borderBottom: '1px solid #ddd'
        }}>
          {['الموضوع', 'القرار', 'الملف'].map((label, idx) => (
            <div key={idx} style={{
              textAlign: 'center',
              flex: 1,
              opacity: step > idx + 1 ? 1 : step === idx + 1 ? 1 : 0.5
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step > idx + 1 ? '#2ecc71' : step === idx + 1 ? '#69c0e2' : '#ddd',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                fontWeight: 'bold'
              }}>
                {step > idx + 1 ? <CheckCircle size={20} /> : idx + 1}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '30px' }}>
          {step === 1 && (
            <div>
              <h3>اختر أو أنشئ موضوعًا</h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  المواضيع الموجودة:
                </label>
                {loadingSujets ? (
                  <p>جارٍ التحميل...</p>
                ) : (
                  <select
                    value={selectedSujet || ''}
                    onChange={(e) => setSelectedSujet(e.target.value ? parseInt(e.target.value) : null)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">-- اختر موضوعًا --</option>
                    {sujets.map((s) => (
                      <option key={s.id} value={s.id}>{s.sujet}</option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
                <h4>إنشاء موضوع جديد:</h4>
                <input
                  type="text"
                  placeholder="الموضوع"
                  value={newSujet.sujet}
                  onChange={(e) => setNewSujet({ ...newSujet, sujet: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
                <textarea
                  placeholder="الوصف (اختياري)"
                  value={newSujet.description}
                  onChange={(e) => setNewSujet({ ...newSujet, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    height: '100px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={handleCreateSujet}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#69c0e2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  <Plus size={16} style={{ marginRight: '5px' }} />
                  إنشاء موضوع
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3>حالة القرار</h3>
              <select
                value={decisionData.statut}
                onChange={(e) => setDecisionData({ ...decisionData, statut: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="active">نشطة</option>
                <option value="inactive">غير نشطة</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>إرفاق ملف القرار</h3>
              <div style={{
                border: '2px dashed #69c0e2',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px',
                cursor: 'pointer'
              }}>
                <input
                  type="file"
                  onChange={(e) => setDecisionFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="decisionFileInput"
                />
                <label htmlFor="decisionFileInput" style={{ cursor: 'pointer', display: 'block' }}>
                  <FileText size={32} style={{ color: '#69c0e2', marginBottom: '10px' }} />
                  <p>انقر لاختيار ملف</p>
                  {decisionFile && <p style={{ color: 'green' }}>✓ {decisionFile.name}</p>}
                </label>
              </div>
              <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '6px' }}>
                <p style={{ margin: '5px 0' }}>✓ تم اختيار الموضوع</p>
                <p style={{ margin: '5px 0' }}>✓ تم إنشاء القرار</p>
                <p style={{ margin: '5px 0' }}>✓ تم إرفاق الملف</p>
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          borderTop: '1px solid #ddd',
          background: '#f9f9f9'
        }}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              padding: '10px 20px',
              background: step === 1 ? '#ccc' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <ChevronLeft size={16} />
            السابق
          </button>
          <button
            onClick={handleNext}
            disabled={uploadingFile}
            style={{
              padding: '10px 20px',
              background: '#69c0e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 'bold'
            }}
          >
            {step === 3 ? 'إنهاء' : 'التالي'}
            {step < 3 && <ChevronRight size={16} />}
            {step === 3 && <Upload size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessWizard;
