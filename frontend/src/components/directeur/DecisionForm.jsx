import React, { useEffect, useState } from 'react';
import { Save, X, Upload, FileText } from 'lucide-react';
import axios from 'axios';
import ModalPortal from '../common/ModalPortal';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';
import usePermissions from '../../hooks/usePermissions';

const emptyForm = () => ({
  sujetId: '',
  statut: 'active',
});

const normalizeId = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  return text ? text : '';
};

const getDecisionSubjectId = (decision) =>
  normalizeId(
    decision?.sujetId ??
      decision?.subjectId ??
      decision?.subject?.id ??
      decision?.sujet?.id,
  );

const getDecisionStatus = (decision) => {
  const value = String(decision?.statut ?? decision?.status ?? 'active').toLowerCase();
  return value === 'inactive' ? 'inactive' : 'active';
};

const getDecisionSubjectName = (decision) =>
  String(
    decision?.subject?.sujet ??
      decision?.sujetNom ??
      decision?.subject?.description ??
      '',
  ).trim();

const DecisionForm = ({ isOpen, decision, onClose, onSaved }) => {
  const [form, setForm] = useState(emptyForm());
  const [sujets, setSujets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      sujetId: getDecisionSubjectId(decision),
      statut: getDecisionStatus(decision),
    });
    setSelectedFile(null);
    setError('');
    loadMeta();
  }, [isOpen, decision]);

  useEffect(() => {
    if (!isOpen || !decision) return;

    const subjectName = getDecisionSubjectName(decision);
    setForm((prev) => {
      let nextSujetId = prev.sujetId;

      if (!nextSujetId && subjectName) {
        const matchedSubject = sujets.find(
          (item) => String(item?.sujet || '').trim().toLowerCase() === subjectName.toLowerCase(),
        );
        if (matchedSubject?.id !== undefined && matchedSubject?.id !== null) {
          nextSujetId = normalizeId(matchedSubject.id);
        }
      }

      if (nextSujetId === prev.sujetId) {
        return prev;
      }

      return {
        ...prev,
        sujetId: nextSujetId,
      };
    });
  }, [isOpen, decision, sujets]);

  const loadMeta = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.SUJETS);
      setSujets(res.data || []);
    } catch (e) {
      showToast('تعذر تحميل المواضيع', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.sujetId) return 'يرجى اختيار الموضوع';
    if (!form.statut) return 'يرجى اختيار الحالة';
    return '';
  };

  const uploadFile = async (decisionId) => {
    if (!selectedFile) return;
    if (!hasPermission('MANAGE_DECISION')) {
      showToast('Permission MANAGE_DECISION refusée, le fichier ne sera pas envoyé', 'warning');
      return false;
    }
    const formData = new FormData();
    formData.append('files', selectedFile);
    await axios.post(API_CONFIG.DIRECTEUR.PROCESS.UPLOAD_FILE(decisionId), formData);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      showToast(validation, 'error');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        sujetId: Number(form.sujetId),
        statut: form.statut,
        fichierPath: decision?.fichierPath || null,
        fichierName: decision?.fichierName || null,
      };

      const response = decision?.id
        ? await axios.patch(API_CONFIG.DIRECTEUR.DECISION_FULL(decision.id), payload)
        : await axios.post(API_CONFIG.DIRECTEUR.PROCESS.DECISIONS_FULL, payload);

      const savedDecision = response.data;
      if (selectedFile && savedDecision?.id) {
        await uploadFile(savedDecision.id);
      }

      showToast(decision?.id ? 'تم تحديث القرار بنجاح' : 'تم إنشاء القرار بنجاح', 'success');
      onSaved && onSaved(savedDecision);
      onClose && onClose();
    } catch (e) {
      console.error('Decision save failed:', {
        message: e?.message,
        responseStatus: e?.response?.status,
        responseData: e?.response?.data,
        decisionId: decision?.id ?? null,
        payload: {
          sujetId: Number(form.sujetId),
          statut: form.statut,
        },
      });
      const message = e.response?.data?.message || e.response?.data?.error || 'تعذر حفظ القرار';
      setError(message);
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const subjectLabel = sujets.find((item) => String(item.id) === String(form.sujetId))?.sujet || '-';

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div dir="rtl" style={containerStyle}>
        <Header title={decision?.id ? `تعديل القرار ${decision.id}` : 'إنشاء قرار'} onClose={onClose} />

        {error && <div style={alertError}>{error}</div>}
        {loading && <div style={alertInfo}>جارٍ تحميل المواضيع...</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <Section title="القرار">
            <Grid>
              <Field label="الموضوع" required>
                <Select
                  value={form.sujetId}
                  onChange={(v) => updateField('sujetId', v)}
                  options={sujets.map((item) => ({ value: item.id, label: item.sujet }))}
                  placeholder="اختر الموضوع"
                />
              </Field>
              <Field label="الحالة" required>
                <Select
                  value={form.statut}
                  onChange={(v) => updateField('statut', v)}
                  options={[
                    { value: 'active', label: 'نشطة' },
                    { value: 'inactive', label: 'غير نشطة' },
                  ]}
                />
              </Field>
              <Field label="الموضوع المختار" full>
                <div style={previewBox}>{subjectLabel}</div>
              </Field>
            </Grid>
          </Section>

          <Section title="الملف">
            <Field label="إرفاق ملف" full>
              <label style={uploadBox}>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
                <Upload size={16} />
                <span>{selectedFile ? selectedFile.name : decision?.fichierName || 'اختر ملفًا'}</span>
              </label>
            </Field>
            {(selectedFile || decision?.fichierPath) && (
              <div style={fileHint}>
                <FileText size={16} />
                <span>{selectedFile ? 'تم اختيار ملف جديد، وسيتم رفعه بعد الحفظ.' : 'هذا القرار يحتوي على ملف مرفق بالفعل.'}</span>
              </div>
            )}
          </Section>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <button type="button" onClick={onClose} style={ghostButton}><X size={16} /> إلغاء</button>
            <button type="submit" disabled={submitting} style={primaryButton}><Save size={16} /> {submitting ? 'جارٍ الحفظ...' : 'حفظ القرار'}</button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

function Header({ title, onClose }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
      <div>
        <div style={{ color: '#b0b0c0', fontSize: '12px' }}>تحرير القرار</div>
        <h2 style={{ margin: '4px 0 0', fontSize: '28px' }}>{title}</h2>
      </div>
      <button onClick={onClose} style={closeButton}><X size={18} /></button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={sectionStyle}>
      <div style={sectionHeader}>{title}</div>
      <div style={{ padding: '18px' }}>{children}</div>
    </section>
  );
}

function Field({ label, children, required = false, full = false }) {
  return (
    <label style={{ display: 'grid', gap: '8px', gridColumn: full ? '1 / -1' : 'auto' }}>
      <span style={{ fontSize: '13px', color: '#d8f3ff' }}>{label}{required ? ' *' : ''}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options = [], placeholder, disabled = false }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="decision-input">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value || option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

const containerStyle = {
  width: 'min(980px, 96vw)',
  maxHeight: '92vh',
  overflow: 'auto',
  background: 'linear-gradient(180deg, rgba(13,18,48,0.98), rgba(15,15,46,0.96))',
  border: '1px solid rgba(105,192,226,0.28)',
  borderRadius: '24px',
  padding: '20px',
  color: '#fff',
  fontFamily: 'Tajawal, sans-serif',
  boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
};

const sectionStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(105,192,226,0.22)',
  borderRadius: '20px',
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
};

const sectionHeader = {
  padding: '14px 18px',
  background: 'linear-gradient(135deg, rgba(105,192,226,0.24) 0%, rgba(50,126,158,0.22) 100%)',
  borderBottom: '1px solid rgba(105,192,226,0.16)',
  fontWeight: 800,
};

const Grid = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }} className="decision-grid">{children}<style>{`
  .decision-grid .full { grid-column: 1 / -1; }
  .decision-input {
    width: 100%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(105,192,226,0.22);
    border-radius: 14px;
    padding: 12px 14px;
    color: #fff;
    outline: none;
    font-family: Tajawal, sans-serif;
  }
  .decision-input:focus { border-color: rgba(105,192,226,0.5); box-shadow: 0 0 0 3px rgba(105,192,226,0.12); }
  .decision-input:disabled { opacity: 0.6; cursor: not-allowed; }
  .decision-input option { background: #10153a; color: #fff; }
  @media (max-width: 900px) { .decision-grid { grid-template-columns: 1fr; } }
`}</style></div>;

const alertError = { marginBottom: '16px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(239,68,68,0.16)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' };
const alertInfo = { marginBottom: '16px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(105,192,226,0.14)', border: '1px solid rgba(105,192,226,0.2)', color: '#d7f6ff' };
const closeButton = { width: '44px', height: '44px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer' };
const ghostButton = { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '14px', padding: '12px 18px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' };
const primaryButton = { background: 'linear-gradient(135deg, #69c0e2 0%, #327e9e 100%)', color: '#fff', border: 'none', borderRadius: '14px', padding: '12px 18px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 };
const previewBox = { minHeight: '48px', display: 'flex', alignItems: 'center', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(105,192,226,0.22)', background: 'rgba(255,255,255,0.05)', color: '#dff7ff' };
const uploadBox = { minHeight: '56px', display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '14px', border: '1px dashed rgba(105,192,226,0.35)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' };
const fileHint = { marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#b0b0c0' };

export default DecisionForm;
