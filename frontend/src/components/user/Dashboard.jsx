import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  FileText,
  MessageSquareText,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  TimerReset,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import Toaster, { showToast } from '../common/Toaster';
import '../../styles/user-dashboard.css';

const defaultStats = {
  memberCommitteesDecisionsCount: 0,
  rapporteurSessionsCount: 0,
  completedDelayedReportsCount: 0,
};

const emptyRow = () => ({ recommendationText: '', executionStructure: '', deadlineText: '' });

const feedbackTypeOptions = {
  RECLAMATION: { label: 'شكوى', className: 'red', icon: <AlertTriangle size={14} /> },
  REMARQUE: { label: 'ملاحظة', className: 'blue', icon: <MessageSquareText size={14} /> },
};

const sessionStatusMap = {
  planifiee: { label: 'مجدولة', className: 'info' },
  planifie: { label: 'مجدولة', className: 'info' },
  programmed: { label: 'مجدولة', className: 'info' },
  en_cours: { label: 'قيد الإنجاز', className: 'warning' },
  ongoing: { label: 'قيد الإنجاز', className: 'warning' },
  terminee: { label: 'منجزة', className: 'success' },
  completee: { label: 'منجزة', className: 'success' },
  completed: { label: 'منجزة', className: 'success' },
  active: { label: 'نشطة', className: 'success' },
};

const rapporteurRoleNames = ['مقرر', 'rapporteur', 'rapporteur_comite', 'reporter_comite'];

const UserDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [report, setReport] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackType, setFeedbackType] = useState('RECLAMATION');
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [decisions, setDecisions] = useState([]);
  const [minutesTopic, setMinutesTopic] = useState('');
  const [minutesContext, setMinutesContext] = useState('');
  const [minutesDiscussion, setMinutesDiscussion] = useState('');
  const [reportRows, setReportRows] = useState([emptyRow()]);
  const [savingSession, setSavingSession] = useState(false);
  const [minutesModalOpen, setMinutesModalOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('nomPrenom') || 'المستخدم';
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

  const isRapporteur = useMemo(() => {
    const normalized = committeeRoles.map((role) => String(role || '').toLowerCase());
    return rapporteurRoleNames.some((roleName) => normalized.includes(roleName.toLowerCase()));
  }, [committeeRoles]);

  const selectedSession = useMemo(
    () => sessions.find((session) => String(session.id) === String(selectedSessionId)),
    [sessions, selectedSessionId],
  );

  const filteredSessions = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return sessions;
    return sessions.filter((session) => {
      const committee = session?.comite?.titre || '';
      const status = session?.statut || '';
      const date = session?.dateSession ? formatDateDDMMYYYY(session.dateSession) : '';
      return `${committee} ${status} ${date}`.toLowerCase().includes(needle);
    });
  }, [sessions, searchTerm]);

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(b?.dateSession || 0).getTime() - new Date(a?.dateSession || 0).getTime()),
    [sessions],
  );

  const recentSession = sortedSessions[0] || null;
  const totalFeedbacks = feedbacks.length;
  const complaintsCount = feedbacks.filter((item) => item.type === 'RECLAMATION').length;
  const remarksCount = feedbacks.filter((item) => item.type === 'REMARQUE').length;
  const completionRate = sessions.length ? Math.round((stats.rapporteurSessionsCount / sessions.length) * 100) : 0;
  const sessionStatus = getSessionStatus(selectedSession?.statut);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      const requests = [
        axios.get(API_CONFIG.COMITE.ASSIGNED_SESSIONS, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(API_CONFIG.USER.DASHBOARD_STATS, { headers: { Authorization: `Bearer ${token}` } }),
      ];
      if (isRapporteur) {
        requests.push(
          axios.get(API_CONFIG.COMITE.ASSIGNED_DECISIONS, { headers: { Authorization: `Bearer ${token}` } }),
        );
      }

      const [sessionsRes, statsRes, decisionsRes] = await Promise.all(requests);
      const loadedSessions = sessionsRes.data || [];
      const loadedDecisions = decisionsRes?.data || [];
      setSessions(loadedSessions);
      setDecisions(loadedDecisions);
      setStats({
        memberCommitteesDecisionsCount: Number(statsRes?.data?.memberCommitteesDecisionsCount || 0),
        rapporteurSessionsCount: Number(statsRes?.data?.rapporteurSessionsCount || 0),
        completedDelayedReportsCount: Number(statsRes?.data?.completedDelayedReportsCount || 0),
      });

      if (loadedSessions.length) {
        const nextSession = [...loadedSessions].sort(
          (a, b) => new Date(b?.dateSession || 0).getTime() - new Date(a?.dateSession || 0).getTime(),
        )[0];
        const nextSessionId = String(nextSession.id);
        setSelectedSessionId(nextSessionId);
        fetchSessionReport(nextSessionId);
        if (isRapporteur) hydrateSessionReport(nextSession, loadedDecisions);
      } else {
        setSelectedSessionId('');
        setReport(null);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error(error);
      setSessions([]);
      setDecisions([]);
      setStats(defaultStats);
      setSelectedSessionId('');
      setReport(null);
      setFeedbacks([]);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchSessionReport = async (sessionId) => {
    try {
      setLoadingReport(true);
      const reportRes = await axios.get(API_CONFIG.REPORTS.GET(sessionId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (reportRes.data && reportRes.data.id) {
        setReport(reportRes.data);
        fetchFeedbacks(reportRes.data.id);
      } else {
        setReport(null);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error(error);
      setReport(null);
      setFeedbacks([]);
    } finally {
      setLoadingReport(false);
    }
  };

  const fetchFeedbacks = async (reportId) => {
    try {
      const feedbacksRes = await axios.get(API_CONFIG.REPORTS.FEEDBACKS(reportId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(feedbacksRes.data || []);
    } catch (error) {
      console.error(error);
      setFeedbacks([]);
    }
  };

  const handleSelectSession = (sessionId) => {
    const normalized = String(sessionId);
    setSelectedSessionId(normalized);
    fetchSessionReport(normalized);
    if (isRapporteur) {
      const nextSession = sessions.find((session) => String(session.id) === normalized);
      if (nextSession) hydrateSessionReport(nextSession, decisions);
    }
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    if (!report || !feedbackContent.trim()) return;
    try {
      setSubmittingFeedback(true);
      await axios.post(
        API_CONFIG.REPORTS.FEEDBACKS(report.id),
        { type: feedbackType, content: feedbackContent.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFeedbackContent('');
      fetchFeedbacks(report.id);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    if (!window.confirm('هل تريد حذف هذه الملاحظة؟')) return;
    try {
      await axios.delete(API_CONFIG.REPORTS.DELETE_FEEDBACK(feedbackId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (report?.id) fetchFeedbacks(report.id);
    } catch (error) {
      console.error(error);
    }
  };

  const discussionPreview = stripHtml(report?.discussion);

  function getSessionSourceDecisions(session, allDecisions) {
    const direct = (allDecisions || []).filter(
      (decision) => String(decision?.session?.id || '') === String(session?.id || ''),
    );
    if (direct.length) return direct;

    const committeeId = session?.comite?.id;
    if (!committeeId) return [];

    return (allDecisions || []).filter(
      (decision) =>
        String(decision?.comite?.id || decision?.session?.comite?.id || '') === String(committeeId),
    );
  }

  function hydrateSessionReport(session, allDecisions) {
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
        console.error(error);
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
      return;
    }

    setReportRows([emptyRow()]);
  }

  function updateReportRow(index, field, value) {
    setReportRows((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  }

  function removeReportRow(index) {
    setReportRows((prev) => (prev.length === 1 ? [emptyRow()] : prev.filter((_, rowIndex) => rowIndex !== index)));
  }

  async function saveSessionReport() {
    if (!selectedSessionId || !isRapporteur) return;

    try {
      setSavingSession(true);
      await axios.patch(
        API_CONFIG.COMITE.UPDATE_ASSIGNED_SESSION_REPORT(selectedSessionId),
        {
          reportTopic: minutesTopic,
          reportContext: minutesContext,
          reportDiscussion: minutesDiscussion,
          reportRowsJson: JSON.stringify(reportRows),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast('تم حفظ المحضر بنجاح', 'success');
      await fetchDashboardData();
      setMinutesModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast('تعذر حفظ المحضر', 'error');
    } finally {
      setSavingSession(false);
    }
  }

  return (
    <div className="userdash-page" dir="rtl">
      <div className="userdash-bg-orb userdash-bg-orb-one" />
      <div className="userdash-bg-orb userdash-bg-orb-two" />

      <section className="userdash-hero">
        <div className="userdash-hero-content">
          <div className="userdash-hero-copy">
            <p className="userdash-kicker">
              <Sparkles size={14} />
              لوحة المستخدم
            </p>
            <h1 className="userdash-title">كل المستخدمين داخل نفس اللوحة</h1>
            <p className="userdash-subtitle">
              عند تعيينك كمقرر تظهر لك أدوات إضافية داخل نفس الصفحة. وعندما تكون مستخدماً عادياً تختفي هذه
              الأدوات ويبقى لك نفس فضاء المتابعة الأساسي.
            </p>
          </div>

          <div className="userdash-hero-actions">
            <div className="userdash-hero-action-row">
              <button className="userdash-primary-btn" onClick={fetchDashboardData} disabled={loadingDashboard}>
                <RefreshCw size={16} />
                تحديث البيانات
              </button>
            </div>
            <div className="userdash-profile-chip">
              <span className="userdash-profile-label">مرحباً</span>
              <strong>{userName}</strong>
              <small>{isRapporteur ? 'تم تفعيل صلاحيات المقرر' : 'صلاحيات المستخدم العادي فقط'}</small>
            </div>
          </div>
        </div>

        <div className="userdash-hero-highlight">
          <div className="userdash-hero-highlight-head">
            <span>الجلسة الأهم الآن</span>
            <span className={`userdash-status-pill ${sessionStatus.className}`}>{sessionStatus.label}</span>
          </div>
          <strong>{selectedSession?.comite?.titre || recentSession?.comite?.titre || 'لا توجد جلسة محددة'}</strong>
          <p>
            {selectedSession?.dateSession
              ? `تاريخ الجلسة ${formatDateDDMMYYYY(selectedSession.dateSession)}`
              : 'اختر جلسة من القائمة لعرض التقرير والملاحظات.'}
          </p>
          <div className="userdash-highlight-metrics">
            <div>
              <span>الملاحظات</span>
              <strong>{totalFeedbacks}</strong>
            </div>
            <div>
              <span>نسبة التقدم</span>
              <strong>{completionRate}%</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="userdash-stats-grid">
        <KpiCard icon={<FileText size={18} />} title="المقررات داخل اللجان المرتبطة بك" value={stats.memberCommitteesDecisionsCount} note="إجمالي الملفات والقرارات المتاحة لك" variant="blue" />
        <KpiCard icon={<Users size={18} />} title="الجلسات التي كلفت فيها بدور المقرر" value={stats.rapporteurSessionsCount} note={isRapporteur ? 'أدوات المقرر مفعلة' : 'مخفية عندما لا تكون مقرراً'} variant="cyan" />
        <KpiCard icon={<TimerReset size={18} />} title="التأخيرات بين الجلسات وكتابة المحاضر" value={stats.completedDelayedReportsCount} note="يساعدك على متابعة سرعة الإنجاز" variant="amber" />
        <KpiCard icon={<MessageSquareText size={18} />} title="إجمالي الملاحظات على التقرير المحدد" value={totalFeedbacks} note={`${complaintsCount} شكاوى و ${remarksCount} ملاحظات`} variant="violet" />
      </section>

      <section className="userdash-overview-grid">
        <article className="userdash-overview-card userdash-overview-card-featured">
          <div className="userdash-overview-head">
            <span className="userdash-section-kicker">تركيز اليوم</span>
            <CalendarDays size={18} />
          </div>
          <h3>{selectedSession?.comite?.titre || 'لا توجد جلسة محددة'}</h3>
          <p>
            {selectedSession?.dateSession
              ? `آخر تحديث مرتبط بهذه الجلسة بتاريخ ${formatDateDDMMYYYY(selectedSession.dateSession)}.`
              : 'اختر جلسة لبدء قراءة المحضر وإدارة الملاحظات.'}
          </p>
          <div className="userdash-inline-stats">
            <span>
              <Clock3 size={14} />
              {recentSession?.dateSession ? formatDateDDMMYYYY(recentSession.dateSession) : '-'}
            </span>
            <span>
              <Users size={14} />
              {isRapporteur ? 'أنت مقرر' : 'مستخدم عادي'}
            </span>
          </div>
        </article>

        <article className="userdash-overview-card">
          <div className="userdash-overview-head">
            <span className="userdash-section-kicker">حالة التقرير</span>
            {report ? <FileText size={18} /> : <AlertTriangle size={18} />}
          </div>
          <h3>{report ? 'المحضر متاح للمراجعة' : 'لا يوجد محضر بعد'}</h3>
          <p>{report ? `عنوان المحضر الحالي: ${report.topic || 'بدون عنوان'}.` : 'لم يتم تحرير محضر لهذه الجلسة حتى الآن.'}</p>
        </article>

        <article className="userdash-overview-card">
          <div className="userdash-overview-head">
            <span className="userdash-section-kicker">صلاحيات إضافية</span>
            <Users size={18} />
          </div>
          <h3>{isRapporteur ? 'أدوات المقرر ظاهرة' : 'أدوات المقرر مخفية'}</h3>
          <p>{isRapporteur ? 'يمكنك الآن تحرير محاضر الجلسات من نفس اللوحة.' : 'ستظهر أدوات المقرر هنا فقط عند تعيينك بهذه الصفة.'}</p>
        </article>
      </section>

      <section className="userdash-layout">
        <aside className="userdash-panel userdash-sessions">
          <div className="userdash-panel-head">
            <div>
              <p className="userdash-section-kicker">التنقل بين الجلسات</p>
              <h3>الجلسات المسندة</h3>
            </div>
            <div className="userdash-panel-counter">{filteredSessions.length}</div>
          </div>

          <div className="userdash-search">
            <Search size={16} />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="ابحث عن لجنة أو حالة أو تاريخ..." />
          </div>

          <div className="userdash-session-list">
            {filteredSessions.length === 0 && <div className="userdash-empty-inline">لا توجد جلسات مطابقة لعملية البحث.</div>}
            {filteredSessions.map((session) => {
              const isActive = String(selectedSessionId) === String(session.id);
              const status = getSessionStatus(session?.statut);
              return (
                <button key={session.id} type="button" className={`userdash-session-item ${isActive ? 'active' : ''}`} onClick={() => handleSelectSession(session.id)}>
                  <div className="userdash-session-item-head">
                    <strong>{session?.comite?.titre || 'بدون لجنة'}</strong>
                    <span className={`userdash-status-pill ${status.className}`}>{status.label}</span>
                  </div>
                  <p>{formatDateDDMMYYYY(session?.dateSession)}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="userdash-main-stack">
          {loadingDashboard || loadingReport ? (
            <div className="userdash-empty">جارٍ تحميل البيانات...</div>
          ) : !selectedSession ? (
            <div className="userdash-empty">لا توجد جلسات مسندة حالياً.</div>
          ) : !report ? (
            <div className="userdash-empty">لم يتم تحرير محضر لهذه الجلسة بعد.</div>
          ) : (
            <div className="userdash-content-grid">
              <section className="userdash-panel userdash-report-card">
                <div className="userdash-card-head">
                  <div>
                    <p className="userdash-section-kicker">ملف المحضر</p>
                    <h3>محضر الجلسة: {report.topic || 'بدون عنوان'}</h3>
                  </div>
                </div>

                <div className="userdash-report-sections">
                  <div className="userdash-rich-block">
                    <span>الإطار العام</span>
                    <p>{report.context || '-'}</p>
                  </div>
                  <div className="userdash-rich-block">
                    <span>ملخص التداولات</span>
                    <p>{discussionPreview || '-'}</p>
                  </div>
                  <div className="userdash-rich-html">
                    <span>نص المحضر الكامل</span>
                    <div dangerouslySetInnerHTML={{ __html: report.discussion || '-' }} />
                  </div>
                </div>
              </section>

              <section className="userdash-panel userdash-feedback-card">
                <div className="userdash-card-head">
                  <div>
                    <p className="userdash-section-kicker">مساحة التفاعل</p>
                    <h3>الملاحظات والشكاوى</h3>
                  </div>
                </div>

                <div className="userdash-feedback-list">
                  {feedbacks.length === 0 && <div className="userdash-empty-inline">لا توجد ملاحظات بعد.</div>}
                  {feedbacks.map((feedback) => {
                    const feedbackTypeMeta = feedbackTypeOptions[feedback.type] || feedbackTypeOptions.REMARQUE;
                    return (
                      <article key={feedback.id} className="userdash-feedback-item">
                        <div className="userdash-feedback-head">
                          <span className={`badge ${feedbackTypeMeta.className}`}>{feedbackTypeMeta.icon}{feedbackTypeMeta.label}</span>
                          <button className="userdash-delete-btn" onClick={() => deleteFeedback(feedback.id)}>حذف</button>
                        </div>
                        <div className="userdash-feedback-author">{feedback.user?.employe?.prenom} {feedback.user?.employe?.nom}</div>
                        <p>{feedback.content}</p>
                      </article>
                    );
                  })}
                </div>

                <form onSubmit={submitFeedback} className="userdash-feedback-form">
                  <div className="userdash-form-row">
                    <select value={feedbackType} onChange={(event) => setFeedbackType(event.target.value)}>
                      <option value="RECLAMATION">شكوى</option>
                      <option value="REMARQUE">ملاحظة</option>
                    </select>
                  </div>
                  <textarea value={feedbackContent} onChange={(event) => setFeedbackContent(event.target.value)} placeholder="اكتب ملاحظتك أو شكواك بوضوح..." rows={5} />
                  <button type="submit" disabled={submittingFeedback}>{submittingFeedback ? 'جارٍ الإرسال...' : 'إرسال الملاحظة'}</button>
                </form>
              </section>
            </div>
          )}
        </main>
      </section>

      {isRapporteur && (
        <section className="userdash-rapporteur-grid">
          <section className="userdash-panel userdash-rapporteur-card">
            <div className="userdash-card-head">
              <div>
                <p className="userdash-section-kicker">أدوات المقرر</p>
                <h3>ملخص المقررات والجلسات</h3>
              </div>
            </div>
            <div className="userdash-summary-grid">
              <div className="userdash-summary-card">
                <span>المقررات المسندة</span>
                <strong>{decisions.length}</strong>
              </div>
              <div className="userdash-summary-card">
                <span>جلسات المقرر</span>
                <strong>{stats.rapporteurSessionsCount}</strong>
              </div>
              <div className="userdash-summary-card">
                <span>الجلسة المحددة</span>
                <strong>{selectedSession ? `#${selectedSession.id}` : '-'}</strong>
              </div>
            </div>
          </section>

          <section className="userdash-panel userdash-rapporteur-card">
            <div className="userdash-card-head">
              <div>
                <p className="userdash-section-kicker">تحرير المحضر</p>
                <h3>صلاحيات المقرر داخل نفس اللوحة</h3>
              </div>
              <button className="userdash-secondary-btn" type="button" onClick={() => setMinutesModalOpen(true)}>
                <FileText size={16} />
                فتح محرر المحضر
              </button>
            </div>
            <div className="userdash-empty-inline">
              هذه المساحة تظهر فقط عندما تكون مقرراً. يمكن منها تعديل موضوع المحضر، الإطار العام،
              التداولات، والتوصيات الخاصة بالجلسة المحددة.
            </div>
          </section>
        </section>
      )}

      {minutesModalOpen && isRapporteur && (
        <div className="userdash-modal-backdrop" onClick={() => setMinutesModalOpen(false)}>
          <div className="userdash-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="userdash-modal-header">
              <h3>محرر محضر الجلسة</h3>
              <button className="userdash-modal-close" onClick={() => setMinutesModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="userdash-modal-field">
              <label>الموضوع</label>
              <input value={minutesTopic} onChange={(event) => setMinutesTopic(event.target.value)} placeholder="اكتب موضوع المحضر..." />
            </div>

            <div className="userdash-modal-field">
              <label>1. بيان الإطار</label>
              <textarea value={minutesContext} onChange={(event) => setMinutesContext(event.target.value)} />
            </div>

            <div className="userdash-modal-field">
              <label>2. أهم ما تم تداوله</label>
              <textarea value={minutesDiscussion} onChange={(event) => setMinutesDiscussion(event.target.value)} />
            </div>

            <div className="userdash-modal-actions">
              <button className="userdash-primary-btn" onClick={saveSessionReport} disabled={savingSession}>
                <Save size={15} />
                {savingSession ? 'جارٍ الحفظ...' : 'حفظ المحضر'}
              </button>
              <button className="userdash-secondary-btn" onClick={() => setReportRows((prev) => [...prev, emptyRow()])}>
                <Plus size={15} />
                إضافة توصية
              </button>
            </div>

            <div className="userdash-table-wrap">
              <table className="userdash-table">
                <thead>
                  <tr>
                    <th>التوصية/القرار</th>
                    <th>الهيكل المكلف</th>
                    <th>الآجال</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((row, index) => (
                    <tr key={`row-${index}`}>
                      <td><textarea className="userdash-table-textarea" value={row.recommendationText} onChange={(event) => updateReportRow(index, 'recommendationText', event.target.value)} /></td>
                      <td><input className="userdash-table-input" value={row.executionStructure} onChange={(event) => updateReportRow(index, 'executionStructure', event.target.value)} /></td>
                      <td><input className="userdash-table-input" value={row.deadlineText} onChange={(event) => updateReportRow(index, 'deadlineText', event.target.value)} /></td>
                      <td><button className="userdash-table-btn userdash-table-btn-danger" onClick={() => removeReportRow(index)}><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

function KpiCard({ icon, title, value, note, variant = 'blue' }) {
  return (
    <article className={`userdash-kpi ${variant}`}>
      <div className="kpi-icon">{icon}</div>
      <p className="kpi-title">{title}</p>
      <div className="kpi-value">{value}</div>
      <p className="kpi-note">{note}</p>
    </article>
  );
}

function getSessionStatus(rawStatus) {
  const normalizedStatus = String(rawStatus || '').trim().toLowerCase();
  return sessionStatusMap[normalizedStatus] || { label: rawStatus || 'غير محدد', className: 'neutral' };
}

function stripHtml(value) {
  if (!value) return '';
  return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default UserDashboard;
