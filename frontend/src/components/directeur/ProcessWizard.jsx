import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2, FileText, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';
import '../../styles/admindashboard.css';

const ProcessWizard = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Sujet, 2: Décision, 3: PDF, 4: Révision
  
  // Step 1: Sujet
  const [sujets, setSujets] = useState([]);
  const [selectedSujet, setSelectedSujet] = useState(null);
  const [newSujet, setNewSujet] = useState({ sujet: '', description: '' });
  const [loadingSujets, setLoadingSujets] = useState(false);

  // Step 2: Décision
  const [decisionData, setDecisionData] = useState({
    titre: '',
    description: '',
    numAdmin: '',
    statut: 'brouillon'
  });

  // Step 3: PDF
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Step 4: Comité & Membres
  const [selectedComite, setSelectedComite] = useState(null);
  const [comites, setComites] = useState([]);

  useEffect(() => {
    if (step === 1) {
      fetchSujets();
    } else if (step === 4) {
      fetchComites();
    }
  }, [step]);

  // ===== STEP 1: SUJET =====
  const fetchSujets = async () => {
    setLoadingSujets(true);
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.SUJETS);
      setSujets(res.data || []);
    } catch (err) {
      console.error('Erreur chargement sujets', err);
      showToast('Erreur chargement sujets', 'error');
    }
    setLoadingSujets(false);
  };

  const handleCreateSujet = async () => {
    if (!newSujet.sujet.trim()) {
      showToast('Le sujet est obligatoire', 'error');
      return;
    }
    try {
      const res = await axios.post(API_CONFIG.DIRECTEUR.PROCESS.SUJETS, newSujet);
      setSujets([...sujets, res.data]);
      setSelectedSujet(res.data.id);
      setNewSujet({ sujet: '', description: '' });
      showToast('Sujet créé avec succès', 'success');
    } catch (err) {
      showToast('Erreur création sujet', 'error');
    }
  };

  // ===== STEP 2: DÉCISION =====
  const handleCreateDecision = async () => {
    if (!selectedSujet || !decisionData.titre.trim() || !decisionData.numAdmin.trim()) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    try {
      const payload = {
        sujetId: selectedSujet,
        titre: decisionData.titre,
        description: decisionData.description,
        numAdmin: decisionData.numAdmin,
        statut: decisionData.statut
      };
      const res = await axios.post(API_CONFIG.DIRECTEUR.PROCESS.DECISIONS, payload);
      showToast('Décision créée', 'success');
      
      // Marquer comme actuelle
      await axios.put(API_CONFIG.DIRECTEUR.PROCESS.MARK_CURRENT(res.data.id));
      
      return res.data.id;
    } catch (err) {
      showToast('Erreur création décision', 'error');
      throw err;
    }
  };

  // ===== STEP 3: PDF =====
  const handleUploadPdf = async (decisionId) => {
    if (!pdfFile) {
      showToast('Veuillez sélectionner un PDF', 'error');
      return;
    }

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      
      const res = await axios.post(
        API_CONFIG.DIRECTEUR.PROCESS.UPLOAD_PDF(decisionId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setPdfs([...pdfs, res.data]);
      setPdfFile(null);
      showToast('PDF uploadé avec succès', 'success');
    } catch (err) {
      showToast('Erreur upload PDF', 'error');
    }
    setUploadingPdf(false);
  };

  const handleDeletePdf = async (pdfId) => {
    try {
      await axios.delete(API_CONFIG.DIRECTEUR.PROCESS.DELETE_PDF(pdfId));
      setPdfs(pdfs.filter(p => p.id !== pdfId));
      showToast('PDF supprimé', 'success');
    } catch (err) {
      showToast('Erreur suppression PDF', 'error');
    }
  };

  // ===== STEP 4: COMITÉ =====
  const fetchComites = async () => {
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.COMITES);
      setComites(res.data || []);
    } catch (err) {
      showToast('Erreur chargement comités', 'error');
    }
  };

  // ===== NAVIGATION =====
  const handleNext = async () => {
    if (step === 1 && !selectedSujet) {
      showToast('Veuillez sélectionner ou créer un sujet', 'error');
      return;
    }
    if (step === 2) {
      try {
        const decisionId = await handleCreateDecision();
        setStep(3);
      } catch (err) {
        return;
      }
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      finishProcess();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const finishProcess = () => {
    showToast('Processus finalisé avec succès!', 'success');
    onSuccess && onSuccess();
    onClose && onClose();
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
        maxWidth: '700px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        direction: 'rtl'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #69c0e2 0%, #327e9e 100%)',
          padding: '20px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>عملية إنشاء قرار جديد</h2>
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

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          background: '#f5f5f5',
          borderBottom: '1px solid #ddd'
        }}>
          {['الموضوع', 'القرار', 'المستند', 'انتهاء'].map((label, idx) => (
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

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* STEP 1: SUJET */}
          {step === 1 && (
            <div>
              <h3>اختر أو أنشئ موضوع</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  الموضوعات الموجودة:
                </label>
                {loadingSujets ? (
                  <p>جاري التحميل...</p>
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
                    <option value="">-- اختر موضوع --</option>
                    {sujets.map(s => (
                      <option key={s.id} value={s.id}>{s.sujet}</option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
                <h4>أو إنشاء موضوع جديد:</h4>
                <input
                  type="text"
                  placeholder="الموضوع"
                  value={newSujet.sujet}
                  onChange={(e) => setNewSujet({...newSujet, sujet: e.target.value})}
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
                  onChange={(e) => setNewSujet({...newSujet, description: e.target.value})}
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
                  <Plus size={16} style={{marginRight: '5px'}} />
                  إنشاء موضوع جديد
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DÉCISION */}
          {step === 2 && (
            <div>
              <h3>إنشاء قرار جديد</h3>
              <input
                type="text"
                placeholder="الرقم الإداري"
                value={decisionData.numAdmin}
                onChange={(e) => setDecisionData({...decisionData, numAdmin: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="text"
                placeholder="عنوان القرار"
                value={decisionData.titre}
                onChange={(e) => setDecisionData({...decisionData, titre: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
              <textarea
                placeholder="الوصف"
                value={decisionData.description}
                onChange={(e) => setDecisionData({...decisionData, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  height: '100px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
              <select
                value={decisionData.statut}
                onChange={(e) => setDecisionData({...decisionData, statut: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="brouillon">مسودة</option>
                <option value="approuvée">موافق عليها</option>
                <option value="rejetée">مرفوضة</option>
              </select>
            </div>
          )}

          {/* STEP 3: PDF */}
          {step === 3 && (
            <div>
              <h3>المستندات والملفات</h3>
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
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0])}
                  style={{ display: 'none' }}
                  id="pdfInput"
                />
                <label htmlFor="pdfInput" style={{ cursor: 'pointer', display: 'block' }}>
                  <FileText size={32} style={{ color: '#69c0e2', marginBottom: '10px' }} />
                  <p>اضغط لاختيار ملف PDF أو اسحبه هنا</p>
                  {pdfFile && <p style={{ color: 'green' }}>✓ {pdfFile.name}</p>}
                </label>
              </div>
              {pdfFile && (
                <button
                  onClick={() => handleUploadPdf(/* decisionId will be passed */)}
                  disabled={uploadingPdf}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: uploadingPdf ? '#ccc' : '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: uploadingPdf ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {uploadingPdf ? 'جاري الرفع...' : 'رفع المستند'}
                </button>
              )}
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <div>
              <h3>اختر لجنة أو أكمل لاحقاً</h3>
              <select
                value={selectedComite || ''}
                onChange={(e) => setSelectedComite(e.target.value ? parseInt(e.target.value) : null)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}
              >
                <option value="">-- اختر لجنة --</option>
                {comites.map(c => (
                  <option key={c.id} value={c.id}>{c.sujet}</option>
                ))}
              </select>
              <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '6px' }}>
                <p style={{ margin: '5px 0' }}>✓ الموضوع محدد</p>
                <p style={{ margin: '5px 0' }}>✓ القرار مُنشأ</p>
                <p style={{ margin: '5px 0' }}>✓ ملفات تم رفعها</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
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
            {step === 4 ? 'إنهاء' : 'التالي'}
            {step < 4 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessWizard;
