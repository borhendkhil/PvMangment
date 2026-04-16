import React, { useEffect, useMemo, useState } from 'react';
import { Eye, FileText, LayoutDashboard, LogOut, Plus, Printer, Save, Search, ShieldCheck, Trash2, X } from 'lucide-react';
import axios from '../../lib/httpClient';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import DecisionViewer, { openDecisionPrintWindow, statusColors } from '../directeur/DecisionViewer';
import Toaster, { showToast } from '../common/Toaster';
import '../../styles/admindashboard.css';

const emptyRow = () => ({ recommendationText: '', executionStructure: '', deadlineText: '' });
const RapporteurDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [minutesTopic, setMinutesTopic] = useState('');
  const [minutesContext, setMinutesContext] = useState('');
  const [minutesDiscussion, setMinutesDiscussion] = useState('');
  const [reportRows, setReportRows] = useState([emptyRow()]);
  const [savingSession, setSavingSession] = useState(false);
  const [minutesModalOpen, setMinutesModalOpen] = useState(false);

  const nomPrenom = localStorage.getItem('nomPrenom') || 'مستخدم';
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || '{}');
    } catch (error) {
      return {};
    }
  }, []);

  const committeeRoles = useMemo(
    () => (Array.isArray(currentUser?.committeeRoles) ? currentUser.committeeRoles : []),
    [currentUser],
  );
  const normalizedCommitteeRoles = useMemo(
    () => committeeRoles.map((role) => String(role || '').toLowerCase()),
    [committeeRoles],
  );
  const isRapporteur = useMemo(
    () =>
      normalizedCommitteeRoles.includes('مقرر') ||
      normalizedCommitteeRoles.includes('rapporteur') ||
      normalizedCommitteeRoles.includes('rapporteur_comite') ||
      normalizedCommitteeRoles.includes('reporter_comite'),
    [normalizedCommitteeRoles],
  );
  const memberRoleLabel = committeeRoles.length ? committeeRoles.join(' / ') : 'عضو';

  useEffect(() => {
    loadData();
  }, []);

  const getSessionSourceDecisions = (session, allDecisions) => {
    const direct = (allDecisions || []).filter(
      (decision) => String(decision?.session?.id || '') === String(session?.id || ''),
    );
    if (direct.length) return direct;

    const committeeId = session?.comite?.id;
    if (!committeeId) return [];

    return (allDecisions || []).filter(
      (decision) => String(decision?.comite?.id || decision?.session?.comite?.id || '') === String(committeeId),
    );
  };

  const hydrateSessionReport = (session, allDecisions) => {
    const sourceDecisions = getSessionSourceDecisions(session, allDecisions);
    const autoTopic =
      sourceDecisions.find((decision) => decision?.subject?.sujet)?.subject?.sujet ||
      sourceDecisions.find((decision) => decision?.recommendationText)?.recommendationText ||
      sourceDecisions.find((decision) => decision?.titre)?.titre ||
      '';

    setMinutesTopic(session?.reportTopic || autoTopic || '');
    setMinutesContext(session?.reportContext || '');
    setMinutesDiscussion(session?.reportDiscussion || '');

    if (session?.reportRowsJson) {
      try {
        const parsed = JSON.parse(session.reportRowsJson);
        if (Array.isArray(parsed) && parsed.length) {
          setReportRows(
            parsed.map((row) => ({
              recommendationText: row?.recommendationText || '',
              executionStructure: row?.executionStructure || '',
              deadlineText: row?.deadlineText || '',
            })),
          );
          return;
        }
      } catch (error) {
        // Fall through to source decisions.
      }
    }

    if (sourceDecisions.length) {
      setReportRows(
        sourceDecisions.map((decision) => ({
          recommendationText: decision.recommendationText || decision.subject?.sujet || decision.titre || '',
          executionStructure: decision.executionStructure || '',
          deadlineText: decision.deadlineText || '',
        })),
      );
    } else {
      setReportRows([emptyRow()]);
    }
  };

  const loadData = async (preferredSessionId) => {
    setLoading(true);
    try {
      const [decisionRes, sessionRes] = await Promise.all([
        axios.get(API_CONFIG.COMITE.ASSIGNED_DECISIONS),
        axios.get(API_CONFIG.COMITE.ASSIGNED_SESSIONS),
      ]);

      const loadedDecisions = decisionRes.data || [];
      const loadedSessions = sessionRes.data || [];

      setDecisions(loadedDecisions);
      setSessions(loadedSessions);

      if (loadedSessions.length) {
        const wantedId = String(preferredSessionId || selectedSessionId || '');
        const targetSession =
          loadedSessions.find((item) => String(item.id) === wantedId) || loadedSessions[0];
        setSelectedSessionId(String(targetSession.id));
        hydrateSessionReport(targetSession, loadedDecisions);
      } else {
        setSelectedSessionId('');
        setMinutesTopic('');
        setMinutesContext('');
        setMinutesDiscussion('');
        setReportRows([emptyRow()]);
      }
    } catch (error) {
      setDecisions([]);
      setSessions([]);
      showToast('تعذر تحميل بيانات اللجنة', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelection = (sessionId) => {
    setSelectedSessionId(sessionId);
    const session = sessions.find((item) => String(item.id) === String(sessionId));
    if (session) {
      hydrateSessionReport(session, decisions);
    }
  };

  const filteredDecisions = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    return decisions.filter((decision) => {
      const committeeTitle = decision.comite?.titre || decision.session?.comite?.titre || '';
      const subjectName = decision.subject?.sujet || decision.recommendationText || '';
      const fileName = decision.fichierName || '';
      const title = decision.titre || '';
      const haystack = `${committeeTitle} ${subjectName} ${fileName} ${title}`.toLowerCase();
      return !needle || haystack.includes(needle);
    });
  }, [decisions, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: decisions.length,
      active: decisions.filter((item) => (item.statut || '').toLowerCase() === 'active').length,
      committees: new Set(decisions.map((item) => item.comite?.id || item.session?.comite?.id).filter(Boolean)).size,
      sessions: sessions.length,
    };
  }, [decisions, sessions]);

  const selectedSession = useMemo(
    () => sessions.find((item) => String(item.id) === String(selectedSessionId || '')),
    [sessions, selectedSessionId],
  );

  const openViewer = (decision) => {
    setSelectedDecision(decision);
    setViewerOpen(true);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const updateReportRow = (index, field, value) => {
    setReportRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addReportRow = () => setReportRows((prev) => [...prev, emptyRow()]);
  const removeReportRow = (index) =>
    setReportRows((prev) => (prev.length === 1 ? [emptyRow()] : prev.filter((_, i) => i !== index)));

  const saveSessionReport = async () => {
    if (!selectedSessionId) return;

    try {
      setSavingSession(true);
      await axios.patch(API_CONFIG.COMITE.UPDATE_ASSIGNED_SESSION_REPORT(selectedSessionId), {
        reportTopic: minutesTopic,
        reportContext: minutesContext,
        reportDiscussion: minutesDiscussion,
        reportRowsJson: JSON.stringify(reportRows),
      });
      showToast('تم حفظ المحضر بنجاح', 'success');
      await loadData(selectedSessionId);
      setMinutesModalOpen(false);
    } catch (error) {
      showToast('تعذر حفظ المحضر', 'error');
    } finally {
      setSavingSession(false);
    }
  };

  const printMinutesTemplate = () => {
    const rows = reportRows.map((row) => ({
      recommendationText: row?.recommendationText || '',
      executionStructure: row?.executionStructure || '',
      deadlineText: row?.deadlineText || '',
    }));
    const paddedRows = [...rows];
    while (paddedRows.length < 3) paddedRows.push(emptyRow());
    const rowsHtml = paddedRows
      .map(
        (row) => `
        <tr>
          <td>${escapeHtml(row.recommendationText)}</td>
          <td>${escapeHtml(row.executionStructure)}</td>
          <td>${escapeHtml(row.deadlineText)}</td>
        </tr>`,
      )
      .join('');

    const sessionDate = selectedSession?.dateSession ? formatDateDDMMYYYY(selectedSession.dateSession) : '';
    const html = `
      <!doctype html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>محضر جلسة العمل</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body { font-family: 'Times New Roman', Tahoma, Arial, sans-serif; margin: 0; color: #000; line-height: 1.8; }
          .page { width: 100%; }
          .line { font-size: 26px; font-weight: 700; margin: 0; text-align: center; }
          .subline { font-size: 24px; font-weight: 700; margin: 2px 0 10px; text-align: center; }
          .content { margin-top: 16px; font-size: 30px; }
          .content-item { margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 28px; }
          th, td { border: 1px solid #222; padding: 10px 8px; vertical-align: top; min-height: 44px; height: 44px; }
          th { font-weight: 700; text-align: center; }
          td { text-align: right; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="line">محضر جلسة العمل ليوم ${escapeHtml(sessionDate || '...............')} المتعلقة</div>
          <div class="subline">ب ${escapeHtml(minutesTopic || '........................................')}</div>
          <div class="content">
            <div class="content-item">1. ${escapeHtml(minutesContext || 'بيان الإطار الذي يندرج فيه عقد الجلسة والأهداف التي يرجى تحقيقها.')}</div>
            <div class="content-item">2. ${escapeHtml(minutesDiscussion || 'التعرض إلى أهم ما تم التداول والنقاش بشأنه خلال الجلسة.')}</div>
            <div class="content-item">3. تضمين التوصيات والقرارات الصادرة عن الجلسة بالجدول التالي:</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>التوصية/القرار</th>
                <th>الهيكل المكلف بالتجسيم</th>
                <th>الآجال</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    const popup = window.open('', '_blank', 'width=1200,height=900');
    if (!popup) {
      showToast('تعذر فتح نافذة الطباعة', 'error');
      return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    setTimeout(() => popup.print(), 400);
  };

  return (
    <div className="dashboard" dir="rtl">
      <div className="bg-effects" />

      <aside className="sidebar">
        <div className="logo">
          <ShieldCheck />
          <span>لوحة عضو اللجنة</span>
        </div>

        <nav>
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard />
            <span>نظرة عامة</span>
          </button>
          <button className={`nav-item ${activeTab === 'decisions' ? 'active' : ''}`} onClick={() => setActiveTab('decisions')}>
            <FileText />
            <span>المقررات المسندة</span>
          </button>
          {isRapporteur && (
            <button className={`nav-item ${activeTab === 'minutes' ? 'active' : ''}`} onClick={() => setActiveTab('minutes')}>
              <FileText />
              <span>محضر الجلسة</span>
            </button>
          )}
        </nav>

        <button
          className="nav-item"
          onClick={() => {
            window.location.href = '/dashboard';
          }}
          style={{ marginTop: '8px' }}
        >
          <LayoutDashboard />
          <span>فضاء المستخدم</span>
        </button>

        <button className="logout" onClick={logout}>
          <LogOut /> تسجيل الخروج
        </button>
      </aside>

      <main className="main">
        <header className="header">
          <div className="user-box">
            <div>
              <p>مرحباً</p>
              <strong>{nomPrenom}</strong>
              <p style={{ margin: 0, color: '#69c0e2', fontSize: '12px' }}>الصفة: {memberRoleLabel}</p>
            </div>
          </div>
          <h1 style={{ color: 'rgb(1, 60, 147)' }}>{activeTab === 'overview' ? 'ملخص اللجنة' : activeTab === 'minutes' ? 'محضر الجلسة' : 'المقررات المسندة'}</h1>
        </header>

        <div style={contentWrap}>
          {loading ? (
            <div style={loadingState}>جارٍ التحميل...</div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div style={statsGrid}>
                  <StatCard label="إجمالي المقررات المسندة" value={stats.total} />
                  <StatCard label="المقررات النشطة" value={stats.active} />
                  <StatCard label="عدد اللجان المرتبطة" value={stats.committees} />
                  <StatCard label="عدد الجلسات المسندة" value={stats.sessions} />
                </div>
              )}

              {activeTab === 'decisions' && (
                <div>
                  <div style={toolbarStyle}>
                    <div style={searchBoxStyle}>
                      <Search size={16} />
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ابحث باسم اللجنة أو الموضوع أو الملف..."
                        style={searchInputStyle}
                      />
                    </div>
                    <button style={refreshBtnStyle} onClick={loadData}>تحديث</button>
                  </div>

                  {filteredDecisions.length === 0 ? (
                    <div style={emptyStyle}>لا توجد مقررات مسندة حالياً.</div>
                  ) : (
                    <div style={tableWrapStyle}>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <Th>المعرف</Th>
                            <Th>اللجنة</Th>
                            <Th>الجلسة</Th>
                            <Th>الموضوع</Th>
                            <Th>الحالة</Th>
                            <Th>التاريخ</Th>
                            <Th>الإجراءات</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDecisions.map((decision) => {
                            const status = statusColors[(decision.statut || '').toLowerCase()] || statusColors.inactive;
                            return (
                              <tr key={decision.id} style={trStyle}>
                                <Td>{decision.id}</Td>
                                <Td>{decision.comite?.titre || decision.session?.comite?.titre || '-'}</Td>
                                <Td>#{decision.session?.id || '-'}</Td>
                                <Td>{decision.subject?.sujet || decision.recommendationText || '-'}</Td>
                                <Td>
                                  <span style={{ padding: '6px 10px', borderRadius: '999px', background: status.bg, color: status.color, border: `1px solid ${status.color}44`, fontWeight: 700 }}>
                                    {status.label}
                                  </span>
                                </Td>
                                <Td>{formatDateDDMMYYYY(decision.dateCreation || decision.dateUpload)}</Td>
                                <Td>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button style={actionBtnStyle} onClick={() => openViewer(decision)}><Eye size={14} /> عرض</button>
                                    <button style={actionBtnStyle} onClick={() => openDecisionPrintWindow(decision)}><Printer size={14} /> طباعة</button>
                                  </div>
                                </Td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'minutes' && isRapporteur && (
                <div>
                  {sessions.length === 0 ? (
                    <div style={emptyStyle}>لا توجد جلسات مسندة لإنجاز محضر لها.</div>
                  ) : (
                    <>
                      <div style={minutesTopActionsStyle}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button style={refreshBtnStyle} onClick={() => setMinutesModalOpen(true)}>فتح محضر الجلسة</button>
                          <button style={refreshBtnStyle} onClick={printMinutesTemplate}><Printer size={14} /> طباعة المحضر</button>
                        </div>
                      </div>

                      <div style={minutesListCardStyle}>
                        <div style={minutesListTitleStyle}>قائمة الجلسات ({sessions.length})</div>
                        {sessions.length === 0 ? (
                          <div style={minutesListEmptyStyle}>لا توجد جلسات.</div>
                        ) : (
                          <div style={minutesListTableWrapStyle}>
                            <table style={minutesPreviewTableStyle}>
                              <thead>
                                <tr>
                                  <th style={minutesPreviewHeadStyle}>#</th>
                                  <th style={minutesPreviewHeadStyle}>اللجنة</th>
                                  <th style={minutesPreviewHeadStyle}>تاريخ الجلسة</th>
                                  <th style={minutesPreviewHeadStyle}>الحالة</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sessions.map((session) => {
                                  const isSelected = String(session.id) === String(selectedSessionId);
                                  return (
                                    <tr
                                      key={`session-row-${session.id}`}
                                      onClick={() => handleSessionSelection(String(session.id))}
                                      style={isSelected ? selectedSessionRowStyle : undefined}
                                    >
                                      <td style={minutesPreviewCellStyle}>{session.id}</td>
                                      <td style={minutesPreviewCellStyle}>{session.comite?.titre || '-'}</td>
                                      <td style={minutesPreviewCellStyle}>{formatDateDDMMYYYY(session.dateSession)}</td>
                                      <td style={minutesPreviewCellStyle}>{session.statut || '-'}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {minutesModalOpen && (
        <div style={modalBackdropStyle} onClick={() => setMinutesModalOpen(false)}>
          <div style={modalPanelStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, color: 'rgb(1, 60, 147)' }}>محرر محضر الجلسة</h3>
              <button style={closeBtnStyle} onClick={() => setMinutesModalOpen(false)}><X size={16} /></button>
            </div>

            <div style={fieldRowStyle}>
              <label style={labelStyle}>الموضوع</label>
              <input value={minutesTopic} onChange={(e) => setMinutesTopic(e.target.value)} placeholder="اكتب موضوع المحضر..." style={inputStyle} />
            </div>

            <div style={fieldRowStyle}>
              <label style={labelStyle}>1. بيان الإطار</label>
              <textarea value={minutesContext} onChange={(e) => setMinutesContext(e.target.value)} style={textareaStyle} />
            </div>

            <div style={fieldRowStyle}>
              <label style={labelStyle}>2. أهم ما تم تداوله</label>
              <textarea value={minutesDiscussion} onChange={(e) => setMinutesDiscussion(e.target.value)} style={textareaStyle} />
            </div>

            <div style={minutesActionRowStyle}>
              <button style={saveMainBtnStyle} onClick={saveSessionReport} disabled={savingSession}>
                <Save size={15} /> {savingSession ? 'جارٍ الحفظ...' : 'حفظ المحضر'}
              </button>
              <button style={saveAllBtnStyle} onClick={addReportRow}>
                <Plus size={15} /> إضافة توصية/قرار
              </button>
            </div>

            <div style={tableWrapStyle}>
              <table style={minutesTableStyle}>
                <thead>
                  <tr>
                    <ThMinutes>التوصية/القرار</ThMinutes>
                    <ThMinutes>الهيكل المكلف بالتجسيم</ThMinutes>
                    <ThMinutes>الآجال</ThMinutes>
                    <ThMinutes>حذف</ThMinutes>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((row, index) => (
                    <tr key={`row-${index}`}>
                      <TdMinutes>
                        <textarea
                          value={row.recommendationText}
                          onChange={(e) => updateReportRow(index, 'recommendationText', e.target.value)}
                          style={cellTextareaStyle}
                        />
                      </TdMinutes>
                      <TdMinutes>
                        <input
                          value={row.executionStructure}
                          onChange={(e) => updateReportRow(index, 'executionStructure', e.target.value)}
                          style={cellInputStyle}
                        />
                      </TdMinutes>
                      <TdMinutes>
                        <input
                          value={row.deadlineText}
                          onChange={(e) => updateReportRow(index, 'deadlineText', e.target.value)}
                          style={cellInputStyle}
                        />
                      </TdMinutes>
                      <TdMinutes>
                        <button style={deleteRowBtnStyle} onClick={() => removeReportRow(index)}>
                          <Trash2 size={14} />
                        </button>
                      </TdMinutes>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <DecisionViewer
        isOpen={viewerOpen}
        decision={selectedDecision}
        onClose={() => {
          setViewerOpen(false);
          setSelectedDecision(null);
        }}
      />
      <Toaster />
    </div>
  );
};

function StatCard({ label, value }) {
  return (
    <div style={statCardStyle}>
      <div style={{ color: '#b0b0c0', fontSize: '13px' }}>{label}</div>
      <div style={{ marginTop: '8px', fontSize: '30px', fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Th({ children }) {
  return <th style={thStyle}>{children}</th>;
}

function Td({ children }) {
  return <td style={tdStyle}>{children}</td>;
}

function ThMinutes({ children }) {
  return <th style={thMinutesStyle}>{children}</th>;
}

function TdMinutes({ children }) {
  return <td style={tdMinutesStyle}>{children}</td>;
}

const contentWrap = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '18px', padding: '18px' };
const loadingState = { minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dff7ff' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' };
const statCardStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '16px', padding: '16px' };
const toolbarStyle = { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' };
const searchBoxStyle = { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(105,192,226,0.2)', borderRadius: '12px', padding: '0 10px', height: '44px', flex: '1 1 320px' };
const searchInputStyle = { background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontFamily: 'inherit' };
const refreshBtnStyle = { background: 'rgba(105,192,226,0.2)', border: '1px solid rgba(105,192,226,0.3)', borderRadius: '12px', color: '#fff', padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px' };
const emptyStyle = { padding: '36px', border: '1px dashed rgba(105,192,226,0.3)', borderRadius: '14px', color: '#b0b0c0', textAlign: 'center' };
const tableWrapStyle = { overflowX: 'auto', border: '1px solid rgba(105,192,226,0.2)', borderRadius: '14px', marginTop: '14px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: '900px' };
const thStyle = { textAlign: 'right', padding: '12px 14px', color: '#69c0e2', background: 'rgba(105,192,226,0.1)', fontSize: '13px' };
const tdStyle = { textAlign: 'right', padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', verticalAlign: 'top' };
const trStyle = { background: 'rgba(255,255,255,0.02)' };
const actionBtnStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '10px', color: '#fff', padding: '8px 10px', cursor: 'pointer', display: 'inline-flex', gap: '6px', alignItems: 'center', fontFamily: 'inherit' };
const minutesTopActionsStyle = { display: 'flex', justifyContent: 'flex-start', marginBottom: '14px' };
const minutesListCardStyle = { border: '1px solid rgba(105,192,226,0.26)', borderRadius: '10px', padding: '10px', marginTop: '6px', background: 'rgba(12, 30, 48, 0.72)' };
const minutesListTitleStyle = { fontWeight: 700, marginBottom: '8px', fontSize: '15px', color: '#dff7ff' };
const minutesListEmptyStyle = { color: '#b7d4e3', fontSize: '13px' };
const minutesListTableWrapStyle = { overflowX: 'auto', border: '1px solid rgba(105,192,226,0.22)', borderRadius: '8px' };
const minutesPreviewTableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: '620px' };
const minutesPreviewHeadStyle = { textAlign: 'right', padding: '9px 10px', background: 'rgba(105,192,226,0.14)', color: '#dff7ff', borderBottom: '1px solid rgba(105,192,226,0.26)', fontSize: '13px' };
const minutesPreviewCellStyle = { textAlign: 'right', padding: '9px 10px', color: '#f3fbff', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' };
const selectedSessionRowStyle = { background: 'rgba(105,192,226,0.2)', cursor: 'pointer' };
const modalBackdropStyle = { position: 'fixed', inset: 0, background: 'rgba(10, 12, 20, 0.7)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modalPanelStyle = { width: 'min(1200px, 96vw)', maxHeight: '92vh', overflow: 'auto', background: '#fff', color: '#111827', borderRadius: '14px', padding: '16px 16px 20px', border: '1px solid #d1d5db' };
const modalHeaderStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', color: '#111827' };
const closeBtnStyle = { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#111827', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const fieldRowStyle = { marginBottom: '12px', display: 'grid', gap: '6px' };
const labelStyle = { fontWeight: 700, fontSize: '16px', color: '#111827' };
const inputStyle = { border: '1px solid #ccc', borderRadius: '8px', padding: '8px 10px', fontFamily: 'inherit', fontSize: '15px', color: '#111827', background: '#fff' };
const textareaStyle = { border: '1px solid #ccc', borderRadius: '8px', padding: '8px 10px', minHeight: '82px', resize: 'vertical', fontFamily: 'inherit', fontSize: '15px', color: '#111827', background: '#fff' };
const minutesActionRowStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' };
const saveMainBtnStyle = { background: '#327e9e', border: 'none', color: '#fff', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' };
const saveAllBtnStyle = { background: '#14532d', border: 'none', color: '#fff', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' };
const minutesTableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: '900px', background: '#fff' };
const thMinutesStyle = { border: '1px solid #333', padding: '10px', textAlign: 'right', fontSize: '17px', background: '#f3f4f6', color: '#111827', fontWeight: 700 };
const tdMinutesStyle = { border: '1px solid #333', padding: '8px', textAlign: 'right', verticalAlign: 'top', color: '#111827' };
const cellInputStyle = { width: '100%', border: '1px solid #ccc', borderRadius: '6px', height: '36px', padding: '0 8px', fontFamily: 'inherit', color: '#111827', background: '#fff' };
const cellTextareaStyle = { width: '100%', border: '1px solid #ccc', borderRadius: '6px', minHeight: '64px', padding: '6px 8px', resize: 'vertical', fontFamily: 'inherit', color: '#111827', background: '#fff' };
const deleteRowBtnStyle = { background: '#7f1d1d', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export default RapporteurDashboard;




