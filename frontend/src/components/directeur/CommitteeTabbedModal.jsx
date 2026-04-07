import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Edit2, FileText, Plus, Trash2, X } from 'lucide-react';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import { showToast } from '../common/Toaster';
import MembreComiteManagement from './MembreComiteManagement';

const defaultSessionForm = { dateSession: '', lieu: '', statut: 'planned' };

const authConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const getCommitteeSessions = (committee) => (Array.isArray(committee?.sessions) ? committee.sessions : []);
const getCommitteeDecisions = (committee) => {
  if (Array.isArray(committee?.decisions) && committee.decisions.length > 0) {
    return committee.decisions;
  }

  return getCommitteeSessions(committee).flatMap((session) =>
    (Array.isArray(session?.decisions) ? session.decisions : []).map((decision) => ({
      ...decision,
      sessionId: session?.id ?? null,
    })),
  );
};

const getErrorMessage = (error, fallback) => {
  const message = error?.response?.data?.message;
  if (Array.isArray(message) && message.length > 0) return message.join(', ');
  if (typeof message === 'string' && message.trim()) return message;

  const responseData = error?.response?.data;
  if (Array.isArray(responseData) && responseData.length > 0) return responseData.join(', ');
  if (typeof responseData === 'string' && responseData.trim()) return responseData;

  return error?.message || fallback;
};

const toLocalDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toIsoOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const getDecisionFileHref = (filePath) => {
  if (!filePath) return '';
  if (/^https?:\/\//i.test(filePath)) return filePath;
  return `${API_CONFIG.BASE}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
};

const getSessionStatusLabel = (status) => {
  const normalized = String(status || 'planned').toLowerCase();
  if (normalized === 'active') return 'نشطة';
  if (normalized === 'completed') return 'مكتملة';
  return 'مجدولة';
};

const getDecisionCommitteeId = (decision) =>
  Number(
    decision?.comiteId ??
      decision?.committeeId ??
      decision?.comite?.id ??
      decision?.committee?.id ??
      decision?.session?.comiteId ??
      decision?.session?.committeeId ??
      decision?.session?.comite?.id ??
      decision?.session?.committee?.id ??
      0,
  ) || null;

const CommitteeTabbedModal = ({ isOpen, committee: initialCommittee, initialTab = 'details', onClose, onRefresh }) => {
  const [committee, setCommittee] = useState(initialCommittee || null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [detailsForm, setDetailsForm] = useState({ titre: '', description: '' });
  const [detailsError, setDetailsError] = useState('');
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [sessionForm, setSessionForm] = useState(defaultSessionForm);
  const [sessionError, setSessionError] = useState('');
  const [sessionSaving, setSessionSaving] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [loadingCommittee, setLoadingCommittee] = useState(false);
  const [isAssigningDecision, setIsAssigningDecision] = useState(false);
  const [allDecisions, setAllDecisions] = useState([]);
  const [selectedDecisionToAssign, setSelectedDecisionToAssign] = useState('');
  const [assigningError, setAssigningError] = useState('');
  const [assigningLoading, setAssigningLoading] = useState(false);

  const sessions = useMemo(
    () => [...getCommitteeSessions(committee)].sort((left, right) => Number(right.id || 0) - Number(left.id || 0)),
    [committee],
  );
  const decisions = useMemo(
    () => [...getCommitteeDecisions(committee)].sort((left, right) => Number(right.id || 0) - Number(left.id || 0)),
    [committee],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    setActiveTab(initialCommittee?.id ? initialTab || 'details' : 'details');
    setCommittee(initialCommittee || null);
    setDetailsForm({
      titre: initialCommittee?.titre || '',
      description: initialCommittee?.description || '',
    });
    setSessionForm(defaultSessionForm);
    setSessionError('');
    setDetailsError('');
    setEditingSessionId(null);
    setIsAssigningDecision(false);
    setAllDecisions([]);
    setSelectedDecisionToAssign('');
    setAssigningError('');
    setAssigningLoading(false);

    if (!initialCommittee?.id) {
      return undefined;
    }

    let alive = true;

    const loadCommittee = async () => {
      try {
        setLoadingCommittee(true);
        const response = await axios.get(`${API_CONFIG.COMITES}/${initialCommittee.id}`, authConfig());
        if (!alive) return;
        const nextCommittee = response.data || null;
        setCommittee(nextCommittee);
        setDetailsForm({
          titre: nextCommittee?.titre || '',
          description: nextCommittee?.description || '',
        });
      } catch (error) {
        if (!alive) return;
        console.error('Failed to load committee', error);
        showToast(getErrorMessage(error, 'تعذر تحميل اللجنة'), 'error');
      } finally {
        if (alive) setLoadingCommittee(false);
      }
    };

    void loadCommittee();

    return () => {
      alive = false;
    };
  }, [isOpen, initialCommittee, initialTab]);

  if (!isOpen) {
    return null;
  }

  const committeeId = committee?.id ?? null;
  const canManageRelatedData = Boolean(committeeId);
  const memberCount = Number(committee?.totalMembres ?? committee?.totalMembers ?? committee?.members?.length ?? 0);
  const assignableDecisions = useMemo(() => {
    if (!committeeId) return [];
    return allDecisions
      .filter((decision) => Number(decision?.id || 0) > 0)
      .filter((decision) => getDecisionCommitteeId(decision) !== committeeId)
      .sort((left, right) => Number(right.id || 0) - Number(left.id || 0));
  }, [allDecisions, committeeId]);

  const refreshCommittee = async () => {
    if (!committeeId) return null;

    try {
      const response = await axios.get(`${API_CONFIG.COMITES}/${committeeId}`, authConfig());
      const nextCommittee = response.data || null;
      setCommittee(nextCommittee);
      setDetailsForm({
        titre: nextCommittee?.titre || '',
        description: nextCommittee?.description || '',
      });
      return nextCommittee;
    } catch (error) {
      console.error('Failed to refresh committee', error);
      showToast(getErrorMessage(error, 'تعذر تحديث بيانات اللجنة'), 'error');
      return null;
    }
  };

  const refreshParent = async () => {
    if (typeof onRefresh === 'function') {
      await onRefresh();
    }
  };

  const closeModal = () => {
    onClose?.();
  };

  const loadAllDecisions = async () => {
    try {
      const response = await axios.get(API_CONFIG.DECISIONS, authConfig());
      setAllDecisions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load all decisions', error);
      setAllDecisions([]);
      showToast(getErrorMessage(error, 'Failed to load decisions'), 'error');
    }
  };

  const handleStartAssignDecision = async () => {
    if (!committeeId) return;
    setIsAssigningDecision(true);
    setAssigningError('');
    setSelectedDecisionToAssign('');
    await loadAllDecisions();
  };

  const handleAssignDecisionToCommittee = async (event) => {
    event.preventDefault();
    setAssigningError('');

    if (!committeeId) {
      setAssigningError('Save the committee first before linking a decision.');
      return;
    }

    const decisionId = Number(selectedDecisionToAssign || 0);
    if (!decisionId) {
      setAssigningError('Select a decision to link.');
      return;
    }

    try {
      setAssigningLoading(true);
      await axios.patch(`${API_CONFIG.DECISIONS}/${decisionId}`, { comiteId: committeeId }, authConfig());
      showToast('Decision linked to committee successfully', 'success');
      setSelectedDecisionToAssign('');
      setIsAssigningDecision(false);
      await refreshCommittee();
      await refreshParent();
    } catch (error) {
      console.error('Failed to assign decision to committee', error);
      const message = getErrorMessage(error, 'Failed to link decision to committee');
      setAssigningError(message);
      showToast(message, 'error');
    } finally {
      setAssigningLoading(false);
    }
  };

  const handleSaveDetails = async (event) => {
    event.preventDefault();
    setDetailsError('');

    const titre = detailsForm.titre.trim();
    if (titre.length < 3) {
      setDetailsError('اسم اللجنة مطلوب ويجب أن يكون 3 أحرف على الأقل');
      return;
    }

    try {
      setDetailsSaving(true);
      const payload = {
        titre,
        description: detailsForm.description.trim() || null,
      };

      const response = committeeId
        ? await axios.patch(`${API_CONFIG.COMITES}/${committeeId}`, payload, authConfig())
        : await axios.post(API_CONFIG.COMITES, payload, authConfig());

      const savedCommittee = response.data || null;
      setCommittee(savedCommittee);
      setDetailsForm({
        titre: savedCommittee?.titre || '',
        description: savedCommittee?.description || '',
      });

      showToast(committeeId ? 'تم تحديث اللجنة بنجاح' : 'تم إنشاء اللجنة بنجاح', 'success');
      if (!committeeId && savedCommittee?.id) {
        setActiveTab('sessions');
      }
      await refreshParent();
    } catch (error) {
      console.error('Failed to save committee', error);
      const message = getErrorMessage(error, 'تعذر حفظ اللجنة');
      setDetailsError(message);
      showToast(message, 'error');
    } finally {
      setDetailsSaving(false);
    }
  };

  const handleSaveSession = async (event) => {
    event.preventDefault();
    setSessionError('');

    if (!committeeId) {
      setSessionError('احفظ اللجنة أولاً قبل إضافة الجلسات');
      return;
    }

    try {
      setSessionSaving(true);
      const payload = {
        comiteId: committeeId,
        dateSession: toIsoOrNull(sessionForm.dateSession),
        lieu: sessionForm.lieu.trim() || null,
        statut: sessionForm.statut || null,
      };

      if (editingSessionId) {
        await axios.patch(`${API_CONFIG.COMITE_SESSIONS}/${editingSessionId}`, payload, authConfig());
        showToast('تم تحديث الجلسة بنجاح', 'success');
      } else {
        await axios.post(API_CONFIG.COMITE_SESSIONS, payload, authConfig());
        showToast('تم إنشاء الجلسة بنجاح', 'success');
      }

      setSessionForm(defaultSessionForm);
      setEditingSessionId(null);
      await refreshCommittee();
      await refreshParent();
    } catch (error) {
      console.error('Failed to save session', error);
      const message = getErrorMessage(error, 'تعذر حفظ الجلسة');
      setSessionError(message);
      showToast(message, 'error');
    } finally {
      setSessionSaving(false);
    }
  };

  const handleEditSession = (session) => {
    setActiveTab('sessions');
    setEditingSessionId(session.id);
    setSessionForm({
      dateSession: toLocalDateTime(session.dateSession),
      lieu: session.lieu || '',
      statut: session.statut || 'planned',
    });
    setSessionError('');
  };

  const handleDeleteSession = async (sessionId) => {
    if (!committeeId) return;
    if (!window.confirm('هل تريد حذف هذه الجلسة؟')) return;

    try {
      await axios.delete(`${API_CONFIG.COMITE_SESSIONS}/${sessionId}`, authConfig());
      showToast('تم حذف الجلسة', 'success');
      if (editingSessionId === sessionId) {
        setEditingSessionId(null);
        setSessionForm(defaultSessionForm);
      }
      await refreshCommittee();
      await refreshParent();
    } catch (error) {
      console.error('Failed to delete session', error);
      showToast(getErrorMessage(error, 'تعذر حذف الجلسة'), 'error');
    }
  };

  const tabs = [
    { key: 'details', label: 'تفاصيل اللجنة', disabled: false },
    { key: 'sessions', label: `الجلسات (${sessions.length})`, disabled: !canManageRelatedData },
    { key: 'members', label: `الأعضاء (${memberCount})`, disabled: !canManageRelatedData },
    { key: 'decisions', label: `المقررات (${decisions.length})`, disabled: !canManageRelatedData },
  ];

  return (
    <div style={overlayStyle} onClick={closeModal}>
      <div style={modalStyle} onClick={(event) => event.stopPropagation()}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>{committeeId ? `اللجنة #${committeeId}` : 'لجنة جديدة'}</div>
            <h3 style={titleStyle}>إنشاء ومتابعة اللجنة</h3>
            <div style={subtitleStyle}>
              احفظ اللجنة أولاً، ثم أضف الجلسات والأعضاء والمقررات المرتبطة بها من نفس النافذة.
            </div>
          </div>
          <button type="button" onClick={closeModal} style={closeButtonStyle} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={tabsStyle}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              disabled={tab.disabled}
              onClick={() => !tab.disabled && setActiveTab(tab.key)}
              style={getTabButtonStyle(activeTab === tab.key, tab.disabled)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loadingCommittee && <div style={loadingBarStyle}>جارٍ تحميل بيانات اللجنة...</div>}

        <div style={panelStyle}>
          {activeTab === 'details' && (
            <form onSubmit={handleSaveDetails} style={formStyle}>
              {detailsError && <div style={errorStyle}>{detailsError}</div>}

              <div style={fieldStyle}>
                <label style={labelStyle}>اسم اللجنة *</label>
                <input
                  value={detailsForm.titre}
                  onChange={(event) => setDetailsForm((prev) => ({ ...prev, titre: event.target.value }))}
                  placeholder="مثال: لجنة الصفقات"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>الوصف</label>
                <textarea
                  value={detailsForm.description}
                  onChange={(event) =>
                    setDetailsForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={4}
                  placeholder="ملاحظات أو تفاصيل إضافية"
                  style={textareaStyle}
                />
              </div>

              <div style={actionRowStyle}>
                <button type="submit" style={primaryButtonStyle} disabled={detailsSaving}>
                  <Plus size={16} />
                  {committeeId ? 'حفظ التعديلات' : 'إنشاء اللجنة'}
                </button>
                <button type="button" onClick={closeModal} style={secondaryButtonStyle}>
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {activeTab === 'sessions' && (
            <div style={stackStyle}>
              {!canManageRelatedData ? (
                <div style={emptyStateStyle}>
                  احفظ اللجنة أولاً حتى تتمكن من إضافة الجلسات وربط المقررات بها.
                </div>
              ) : (
                <>
                  <form onSubmit={handleSaveSession} style={formStyle}>
                    {sessionError && <div style={errorStyle}>{sessionError}</div>}

                    <div style={gridStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>تاريخ الجلسة</label>
                        <input
                          type="datetime-local"
                          value={sessionForm.dateSession}
                          onChange={(event) =>
                            setSessionForm((prev) => ({ ...prev, dateSession: event.target.value }))
                          }
                          style={inputStyle}
                        />
                      </div>

                      <div style={fieldStyle}>
                        <label style={labelStyle}>المكان</label>
                        <input
                          value={sessionForm.lieu}
                          onChange={(event) => setSessionForm((prev) => ({ ...prev, lieu: event.target.value }))}
                          placeholder="مثال: قاعة الاجتماعات"
                          style={inputStyle}
                        />
                      </div>

                      <div style={fieldStyle}>
                        <label style={labelStyle}>الحالة</label>
                        <select
                          value={sessionForm.statut}
                          onChange={(event) => setSessionForm((prev) => ({ ...prev, statut: event.target.value }))}
                          style={inputStyle}
                        >
                          <option value="planned">مجدولة</option>
                          <option value="active">نشطة</option>
                          <option value="completed">مكتملة</option>
                        </select>
                      </div>
                    </div>

                    <div style={actionRowStyle}>
                      <button type="submit" style={primaryButtonStyle} disabled={sessionSaving}>
                        <Plus size={16} />
                        {editingSessionId ? 'تحديث الجلسة' : 'إضافة الجلسة'}
                      </button>
                      {editingSessionId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSessionId(null);
                            setSessionForm(defaultSessionForm);
                            setSessionError('');
                          }}
                          style={secondaryButtonStyle}
                        >
                          إلغاء التعديل
                        </button>
                      )}
                    </div>
                  </form>

                  <div style={listHeaderStyle}>
                    <h4 style={sectionTitleStyle}>الجلسات المرتبطة</h4>
                    <div style={sectionMetaStyle}>إجمالي الجلسات: {sessions.length}</div>
                  </div>

                  {sessions.length === 0 ? (
                    <div style={emptyStateStyle}>لا توجد جلسات مرتبطة بهذه اللجنة.</div>
                  ) : (
                    <div style={listStyle}>
                      {sessions.map((session) => (
                        <article key={session.id} style={itemStyle}>
                          <div style={itemMainStyle}>
                            <div style={badgeStyle}>الجلسة #{session.id}</div>
                            <div style={itemTitleStyle}>{session.lieu || 'بدون مكان محدد'}</div>
                            <div style={itemMetaStyle}>التاريخ: {formatDateDDMMYYYY(session.dateSession)}</div>
                            <div style={itemMetaStyle}>
                              المقررات المرتبطة: {Array.isArray(session.decisions) ? session.decisions.length : 0}
                            </div>
                          </div>

                          <div style={itemSideStyle}>
                            <div style={statusBadgeStyle}>{getSessionStatusLabel(session.statut)}</div>
                            <div style={itemActionsStyle}>
                              <button type="button" onClick={() => handleEditSession(session)} style={iconButtonStyle}>
                                <Edit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSession(session.id)}
                                style={{ ...iconButtonStyle, ...dangerIconButtonStyle }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div style={stackStyle}>
              {!canManageRelatedData ? (
                <div style={emptyStateStyle}>
                  احفظ اللجنة أولاً حتى تتمكن من إضافة الأعضاء وإسناد الأدوار.
                </div>
              ) : (
                <MembreComiteManagement
                  idComite={committeeId}
                  embedded
                  onMembersChange={() => {
                    void refreshCommittee();
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'decisions' && (
            <div style={stackStyle}>
              {!canManageRelatedData ? (
                <div style={emptyStateStyle}>احفظ اللجنة أولاً حتى تظهر المقررات المرتبطة بها.</div>
              ) : (
                <>
                  <div style={listHeaderStyle}>
                    <h4 style={sectionTitleStyle}>المقررات المرتبطة</h4>
                    <div style={actionRowStyle}>
                      <button
                        type="button"
                        onClick={() => {
                          if (isAssigningDecision) {
                            setIsAssigningDecision(false);
                            setSelectedDecisionToAssign('');
                            setAssigningError('');
                            return;
                          }
                          void handleStartAssignDecision();
                        }}
                        style={secondaryButtonStyle}
                      >
                        {isAssigningDecision ? 'Close Linker' : 'Link Existing Decision'}
                      </button>
                    </div>
                  </div>

                  {isAssigningDecision && (
                    <form onSubmit={handleAssignDecisionToCommittee} style={formStyle}>
                      {assigningError && <div style={errorStyle}>{assigningError}</div>}
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Select a decision to link to this committee</label>
                        <select
                          value={selectedDecisionToAssign}
                          onChange={(event) => setSelectedDecisionToAssign(event.target.value)}
                          style={inputStyle}
                          disabled={assigningLoading}
                        >
                          <option value=''>Select decision</option>
                          {assignableDecisions.map((decision) => (
                            <option key={decision.id} value={decision.id}>
                              {`${decision.numAdmin || `#${decision.id}`} - ${
                                decision.fichierName || decision.titre || 'Decision'
                              }`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={actionRowStyle}>
                        <button
                          type="submit"
                          style={primaryButtonStyle}
                          disabled={assigningLoading || !selectedDecisionToAssign}
                        >
                          {assigningLoading ? 'Linking...' : 'Link Decision'}
                        </button>
                      </div>
                    </form>
                  )}

                  {decisions.length === 0 ? (
                    <div style={emptyStateStyle}>لا توجد مقررات مرتبطة بهذه اللجنة.</div>
                  ) : (
                    <div style={listStyle}>
                      {decisions.map((decision) => {
                  const fileHref = getDecisionFileHref(decision.fichierPath);
                  const subject = decision.subject?.sujet || decision.sujetNom || '-';
                  const decisionDate = formatDateDDMMYYYY(decision.dateCreation || decision.dateUpload);

                  return (
                    <article key={decision.id} style={decisionCardStyle}>
                      <div style={itemMainStyle}>
                        <div style={badgeStyle}>رقم القرار: {decision.numAdmin || `#${decision.id}`}</div>
                        <div style={itemTitleStyle}>{decision.fichierName || decision.titre || `قرار #${decision.id}`}</div>
                        <div style={itemMetaStyle}>الموضوع: {subject}</div>
                        <div style={itemMetaStyle}>
                          الجلسة: {decision.sessionId ? `#${decision.sessionId}` : '-'}
                        </div>
                        <div style={itemMetaStyle}>المسار: {decision.fichierPath || '-'}</div>
                      </div>

                      <div style={itemSideStyle}>
                        <div style={statusBadgeStyle}>
                          {(decision.statut || 'inactive').toLowerCase() === 'active' ? 'نشطة' : 'غير نشطة'}
                        </div>
                        <div style={itemMetaStyle}>{decisionDate}</div>
                        {fileHref && (
                          <a href={fileHref} target="_blank" rel="noreferrer" style={fileLinkStyle}>
                            <FileText size={15} />
                            عرض الملف
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default CommitteeTabbedModal;

const getTabButtonStyle = (active, disabled = false) => ({
  border: '1px solid rgba(105,192,226,0.16)',
  borderRadius: '14px',
  background: active ? 'rgba(105,192,226,0.16)' : 'rgba(255,255,255,0.05)',
  color: disabled ? 'rgba(255,255,255,0.45)' : '#fff',
  padding: '12px 14px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'Tajawal, sans-serif',
  fontWeight: 700,
  textAlign: 'center',
});

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 2100,
  background: 'rgba(4, 10, 22, 0.82)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  overflow: 'auto',
};

const modalStyle = {
  width: 'min(1100px, 96vw)',
  maxHeight: '92vh',
  overflow: 'auto',
  background: 'linear-gradient(180deg, rgba(10,15,45,0.98), rgba(13,18,55,0.96))',
  border: '1px solid rgba(105,192,226,0.22)',
  borderRadius: '24px',
  boxShadow: '0 28px 90px rgba(0,0,0,0.45)',
  color: '#fff',
  fontFamily: 'Tajawal, sans-serif',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '24px 24px 16px',
};

const eyebrowStyle = {
  color: '#69c0e2',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '.04em',
};

const titleStyle = {
  margin: '4px 0 0',
  fontSize: '28px',
};

const subtitleStyle = {
  marginTop: '6px',
  color: '#b0b0c0',
  lineHeight: 1.7,
  maxWidth: '760px',
};

const closeButtonStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tabsStyle = {
  padding: '0 24px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '10px',
};

const loadingBarStyle = {
  margin: '16px 24px 0',
  padding: '12px 14px',
  borderRadius: '14px',
  background: 'rgba(105,192,226,0.12)',
  border: '1px solid rgba(105,192,226,0.18)',
  color: '#dff7ff',
};

const panelStyle = {
  margin: '18px 24px 24px',
  borderRadius: '22px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(105,192,226,0.14)',
  padding: '20px',
};

const formStyle = {
  display: 'grid',
  gap: '16px',
};

const fieldStyle = {
  display: 'grid',
  gap: '8px',
};

const labelStyle = {
  color: '#b0b0c0',
  fontSize: '13px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '14px',
  padding: '12px 14px',
  color: '#fff',
  fontSize: '14px',
  fontFamily: 'Tajawal, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '120px',
};

const errorStyle = {
  background: 'rgba(239,68,68,0.14)',
  color: '#fca5a5',
  border: '1px solid rgba(239,68,68,0.24)',
  borderRadius: '14px',
  padding: '12px 14px',
};

const actionRowStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
};

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  background: 'linear-gradient(135deg, #1a472a, #0d2818)',
  color: '#fff',
  border: 'none',
  borderRadius: '14px',
  padding: '12px 18px',
  cursor: 'pointer',
  fontWeight: 700,
  fontFamily: 'Tajawal, sans-serif',
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const stackStyle = {
  display: 'grid',
  gap: '16px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px',
};

const listHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: '18px',
};

const sectionMetaStyle = {
  color: '#b0b0c0',
  fontSize: '13px',
};

const listStyle = {
  display: 'grid',
  gap: '12px',
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '18px',
  alignItems: 'flex-start',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(105,192,226,0.12)',
  borderRadius: '18px',
  padding: '16px',
};

const decisionCardStyle = {
  ...itemStyle,
};

const itemMainStyle = {
  display: 'grid',
  gap: '6px',
  minWidth: 0,
  flex: 1,
};

const badgeStyle = {
  color: '#69c0e2',
  fontSize: '12px',
  fontWeight: 800,
};

const itemTitleStyle = {
  fontSize: '18px',
  fontWeight: 800,
  lineHeight: 1.5,
  wordBreak: 'break-word',
};

const itemMetaStyle = {
  color: '#b0b0c0',
  fontSize: '13px',
  lineHeight: 1.7,
  wordBreak: 'break-word',
};

const itemSideStyle = {
  minWidth: '150px',
  display: 'grid',
  gap: '10px',
  justifyItems: 'start',
};

const statusBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 12px',
  borderRadius: '999px',
  background: 'rgba(105,192,226,0.14)',
  border: '1px solid rgba(105,192,226,0.22)',
  color: '#dff7ff',
  fontSize: '12px',
  fontWeight: 700,
};

const itemActionsStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const iconButtonStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dangerIconButtonStyle = {
  background: 'rgba(239,68,68,0.14)',
  borderColor: 'rgba(239,68,68,0.28)',
};

const emptyStateStyle = {
  padding: '32px 18px',
  textAlign: 'center',
  color: '#b0b0c0',
  background: 'rgba(255,255,255,0.04)',
  border: '1px dashed rgba(105,192,226,0.22)',
  borderRadius: '18px',
};

const fileLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  color: '#dff7ff',
  textDecoration: 'none',
  padding: '8px 10px',
  borderRadius: '12px',
  border: '1px solid rgba(105,192,226,0.2)',
  background: 'rgba(105,192,226,0.1)',
};
