import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Edit2, ExternalLink, Printer, ShieldCheck, X } from 'lucide-react';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const BACKEND_BASE = API_CONFIG.BASE;

export const statusColors = {
  active: { bg: 'rgba(16,185,129,0.2)', color: '#6ee7b7', label: 'نشطة' },
  inactive: { bg: 'rgba(239,68,68,0.2)', color: '#fca5a5', label: 'غير نشطة' },
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const buildFileUrl = (storedPath) => {
  if (!storedPath) return '';
  if (/^https?:\/\//i.test(storedPath)) return storedPath;
  return `${BACKEND_BASE}/${storedPath.replace(/^\/+/, '')}`;
};

const buildViewUrl = (storedPath) => {
  if (!storedPath) return '';
  return `${BACKEND_BASE}/${storedPath.replace(/^\/+/, '')}`;
};

const isPdfFile = (name = '') => /\.pdf$/i.test(name);
const isImageFile = (name = '') => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name);

export const openDecisionPrintWindow = (decision) => {
  if (!decision) return;

  const status = statusColors[(decision.statut || '').toLowerCase()] || statusColors.inactive;

  const html = `
    <!DOCTYPE html>
    <html lang="fr" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Décision ${escapeHtml(decision.id || '')}</title>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Tajawal, sans-serif; color: #111827; background: #fff; }
        .page { max-width: 900px; margin: 0 auto; padding: 28px; }
        .card { border: 1px solid #dbe4ee; border-radius: 16px; padding: 24px; }
        .top { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom: 24px; }
        .badge { padding: 8px 12px; border-radius: 999px; background: ${status.bg}; color: ${status.color}; font-weight: 700; }
        .title { font-size: 32px; font-weight: 800; margin: 8px 0; }
        .row { margin-top: 14px; padding-top: 14px; border-top: 1px solid #e5e7eb; }
        .label { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
        .value { margin-top: 6px; font-size: 16px; font-weight: 600; }
        @page { size: A4; margin: 14mm; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="card">
          <div class="top">
            <div>
              <div class="label">Décision</div>
              <div class="title">${escapeHtml(decision.fichierName || `#${decision.id || '-'}`)}</div>
              <div class="value">${escapeHtml(decision.subject?.sujet || decision.sujetNom || 'Aucun sujet')}</div>
            </div>
            <div class="badge">${escapeHtml(status.label)}</div>
          </div>
          <div class="row">
            <div class="label">Fichier</div>
            <div class="value">${escapeHtml(decision.fichierName || '-')}</div>
          </div>
          <div class="row">
            <div class="label">Date de création</div>
            <div class="value">${escapeHtml(formatDate(decision.dateCreation))}</div>
          </div>
          <div class="row">
            <div class="label">Dernière mise à jour</div>
            <div class="value">${escapeHtml(formatDate(decision.dateUpload))}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=1200,height=900');
  if (!win) {
    showToast('تعذر فتح نافذة الطباعة', 'error');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
};

const DecisionViewer = ({ isOpen, decision, onClose, onEdit }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;

  const status = useMemo(
    () => statusColors[(decision?.statut || '').toLowerCase()] || statusColors.inactive,
    [decision?.statut]
  );
  const previewUrl = buildFileUrl(decision?.fichierPath);
  const viewUrl = buildViewUrl(decision?.fichierPath);
  const fileName = decision?.fichierName || '';
  const isPdf = isPdfFile(fileName);
  const isImage = isImageFile(fileName);
  const pdfFile = useMemo(() => viewUrl || previewUrl, [viewUrl, previewUrl]);
  const pdfOptions = useMemo(() => ({ withCredentials: true }), []);

  useEffect(() => {
    if (isOpen) {
      setShowPreview(true);
      setNumPages(0);
    }
  }, [isOpen, decision?.id]);

  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById('decision-preview-wrap');
      if (el) {
        setPageWidth(Math.max(640, Math.floor(el.clientWidth - 32)));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [showPreview, isOpen]);

  if (!isOpen || !decision || !modalRoot) return null;

  const openInNewTab = () => {
    if (!decision.fichierPath) {
      showToast('لا يوجد ملف مرفق', 'warning');
      return;
    }
    window.open(viewUrl || previewUrl, '_blank', 'noopener,noreferrer');
  };

  const renderPreview = () => {
    if (!showPreview) {
      return (
        <div style={fallbackStyle}>
          <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Aperçu désactivé</div>
          <div style={{ color: '#b0b0c0', textAlign: 'center', lineHeight: 1.8 }}>
            Cliquez sur cette carte pour afficher le fichier ici, sans téléchargement.
          </div>
        </div>
      );
    }

    if (isImage) {
      return <img src={previewUrl} alt={decision.fichierName || 'Aperçu'} style={imageStyle} />;
    }

    if (isPdf) {
      return (
        <div style={pdfWrapStyle}>
          <Document
            file={pdfFile}
            onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
            loading={<div style={loadingStyle}>Chargement du PDF...</div>}
            error={<div style={errorStyle}>Impossible d’afficher le PDF.</div>}
            options={pdfOptions}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={pageWidth || 980}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      );
    }

    return (
      <div style={fallbackStyle}>
        <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Aperçu non disponible</div>
        <div style={{ color: '#b0b0c0', textAlign: 'center', lineHeight: 1.8 }}>
          Le fichier est enregistré et prêt à être téléchargé.
        </div>
      </div>
    );
  };

  return ReactDOM.createPortal(
    <div dir="rtl" onClick={onClose} style={backdropStyle}>
      <div onClick={(e) => e.stopPropagation()} style={viewerStyle}>
        <div style={topBarStyle}>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#b0b0c0', fontSize: '12px' }}>تفاصيل القرار</div>
            <h2 style={titleStyle}>{decision.fichierName || `القرار ${decision.id || '-'}`}</h2>
          </div>

          <div style={actionsStyle}>
            <span style={{ ...statusPillStyle, background: status.bg, color: status.color, borderColor: `${status.color}44` }}>
              <ShieldCheck size={16} />
              {status.label}
            </span>
            <button className="viewer-btn" onClick={openInNewTab}>
              <ExternalLink size={16} /> فتح في نافذة جديدة
            </button>
            <button className="viewer-btn" onClick={() => openDecisionPrintWindow(decision)}>
              <Printer size={16} /> طباعة
            </button>
            {onEdit && (
              <button className="viewer-btn" onClick={onEdit}>
                <Edit2 size={16} /> تعديل
              </button>
            )}
            <button className="viewer-close" onClick={onClose} aria-label="Close" style={viewerCloseStyle}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={gridStyle}>
          <section style={panelStyle} dir="rtl">
            <div style={panelHeaderStyle}>معلومات</div>
            <div style={infoBoxStyle}>
              <Info label="الحالة" value={status.label} valueColor={status.color} />
              <Info label="Date de création" value={formatDate(decision.dateCreation)} alignLeft />
              <Info label="Dernière mise à jour" value={formatDate(decision.dateUpload)} alignLeft />
            </div>
          </section>

          <section style={panelStyle} dir="rtl">
            <div style={panelHeaderStyle}>الموضوع</div>
            <div style={subjectBoxStyle}>
              <div style={{ color: '#69c0e2', fontWeight: 800, marginBottom: '8px' }}>الموضوع المرتبط</div>
              <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.7 }}>{decision.subject?.sujet || decision.sujetNom || '-'}</div>
            </div>
          </section>

          <section style={{ ...panelStyle, gridColumn: '1 / -1' }} dir="rtl">
            <div style={panelHeaderStyle}>الملف المرفق</div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowPreview(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPreview(true); }}
              style={previewShellButtonStyle}
            >
              <div style={previewMetaStyle}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>{decision.fichierName || '-'}</div>
                  <div style={{ color: '#b0b0c0', lineHeight: 1.7, wordBreak: 'break-word' }}>{decision.fichierPath || 'لم يتم رفع أي ملف بعد.'}</div>
                </div>

                <div style={openHintStyle}>
                  <ExternalLink size={14} />
                  Afficher dans le panneau
                </div>
              </div>

              <div id="decision-preview-wrap" style={previewFrameStyle}>
                {renderPreview()}
              </div>
            </div>
          </section>
        </div>

        <style>{`
          .viewer-btn {
            background: rgba(255,255,255,0.06);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.14);
            border-radius: 12px;
            padding: 10px 14px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: Tajawal, sans-serif;
            transition: all 0.2s ease;
          }
          .viewer-btn:hover,
          .viewer-close:hover {
            background: rgba(105,192,226,0.18);
            border-color: rgba(105,192,226,0.4);
          }
        `}</style>
      </div>
    </div>,
    modalRoot
  );
};

function Info({ label, value, valueColor, alignLeft = false }) {
  return (
    <div style={alignLeft ? infoRowLeftStyle : infoRowStyle}>
      <div style={{ color: '#b0b0c0', fontSize: '12px' }}>{label}</div>
      <div style={{ fontWeight: 700, color: valueColor || '#fff', textAlign: alignLeft ? 'left' : 'right', flex: 1 }}>{value}</div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(4, 10, 22, 0.78)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  overflow: 'auto',
};

const viewerStyle = {
  width: 'min(1280px, 96vw)',
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

const topBarStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '18px',
  position: 'sticky',
  top: 0,
  zIndex: 3,
  background: 'linear-gradient(180deg, rgba(15,15,46,0.98), rgba(15,15,46,0.85))',
  paddingBottom: '12px',
};

const titleStyle = {
  margin: '4px 0 0',
  fontSize: '28px',
  wordBreak: 'break-word',
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
};

const statusPillStyle = {
  padding: '8px 12px',
  borderRadius: '999px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid transparent',
};

const viewerCloseStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1.15fr 0.85fr',
  gap: '16px',
  direction: 'ltr',
};

const panelStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(105,192,226,0.22)',
  borderRadius: '20px',
  padding: '16px',
  backdropFilter: 'blur(20px)',
};

const panelHeaderStyle = {
  color: '#69c0e2',
  fontWeight: 800,
  marginBottom: '12px',
  fontSize: '18px',
};

const infoBoxStyle = {
  display: 'grid',
  gap: '10px',
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '14px',
  padding: '12px 14px',
};

const infoRowLeftStyle = {
  ...infoRowStyle,
  flexDirection: 'row-reverse',
};

const subjectBoxStyle = {
  background: 'rgba(102,126,234,0.12)',
  border: '1px solid rgba(105,192,226,0.2)',
  borderRadius: '16px',
  padding: '18px',
  minHeight: '160px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const previewShellButtonStyle = {
  width: '100%',
  border: '1px solid rgba(105,192,226,0.18)',
  borderRadius: '18px',
  background: 'rgba(255,255,255,0.03)',
  padding: '14px',
  cursor: 'pointer',
  textAlign: 'right',
  color: 'inherit',
  display: 'grid',
  gap: '14px',
};

const previewMetaStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
};

const openHintStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  color: '#69c0e2',
  fontWeight: 800,
  padding: '8px 10px',
  borderRadius: '999px',
  border: '1px solid rgba(105,192,226,0.22)',
  background: 'rgba(105,192,226,0.08)',
};

const previewFrameStyle = {
  width: '100%',
  height: '560px',
  borderRadius: '18px',
  border: '1px solid rgba(105,192,226,0.18)',
  background: 'rgba(0,0,0,0.16)',
  overflow: 'auto',
  position: 'relative',
};

const pdfWrapStyle = {
  width: '100%',
  padding: '16px',
  display: 'grid',
  gap: '18px',
  alignItems: 'start',
};

const inlineFrameStyle = {
  width: '100%',
  height: '100%',
  border: '0',
  background: '#fff',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  background: '#0b1028',
};

const fallbackStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '24px',
  textAlign: 'center',
};

const loadingStyle = {
  padding: '32px',
  textAlign: 'center',
  color: '#dff7ff',
};

const errorStyle = {
  padding: '32px',
  textAlign: 'center',
  color: '#fca5a5',
};

export default DecisionViewer;
