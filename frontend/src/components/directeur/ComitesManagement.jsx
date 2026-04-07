import React, { useEffect, useMemo, useState } from 'react';
import { Edit2, FileText, Plus, Search, Trash2, Users } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import { showToast } from '../common/Toaster';
import CommitteeTabbedModal from './CommitteeTabbedModal';
import MembreComiteManagement from './MembreComiteManagement';

const getCommitteeSessions = (comite) => (Array.isArray(comite?.sessions) ? comite.sessions : []);

const getCommitteeMembersCount = (comite) =>
  Number(
    comite?.totalMembres ??
      comite?.totalMembers ??
      (Array.isArray(comite?.members) ? comite.members.length : 0),
  );

const getCommitteeDecisions = (comite) => {
  if (Array.isArray(comite?.decisions) && comite.decisions.length > 0) {
    return comite.decisions;
  }

  return getCommitteeSessions(comite).reduce((acc, session) => {
    (Array.isArray(session?.decisions) ? session.decisions : []).forEach((decision) => {
      acc.push({
        ...decision,
        sessionId: session?.id ?? null,
      });
    });
    return acc;
  }, []);
};

const getCommitteeDecisionsCount = (comite) =>
  Number(comite?.totalDecisions ?? getCommitteeDecisions(comite).length ?? 0);

const getCommitteeSessionsCount = (comite) =>
  Number(comite?.totalSessions ?? getCommitteeSessions(comite).length ?? 0);

const ComitesManagement = () => {
  const [comites, setComites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingComite, setEditingComite] = useState(null);
  const [formData, setFormData] = useState({ titre: '', description: '' });
  const [error, setError] = useState('');
  const [committeeModal, setCommitteeModal] = useState({
    isOpen: false,
    committee: null,
    initialTab: 'details',
  });
  const [selectedComiteForSessions, setSelectedComiteForSessions] = useState(null);
  const [selectedComiteForMembers, setSelectedComiteForMembers] = useState(null);
  const [selectedComiteForDecisions, setSelectedComiteForDecisions] = useState(null);

  useEffect(() => {
    fetchComites();
  }, []);

  const fetchComites = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_CONFIG.DIRECTEUR.COMITES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching comites', err);
      setComites([]);
      showToast('تعذر تحميل اللجان', 'error');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const filteredComites = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return comites;
    return comites.filter((comite) => {
      const decisionTerms = getCommitteeDecisions(comite)
        .map((decision) => [
          decision.numAdmin || '',
          decision.fichierName || '',
          decision.titre || '',
          decision.subject?.sujet || '',
        ].join(' '))
        .join(' ');
      const haystack = `${comite.id || ''} ${comite.titre || ''} ${comite.description || ''} ${getCommitteeDecisionsCount(comite)} ${getCommitteeSessionsCount(comite)} ${getCommitteeMembersCount(comite)} ${decisionTerms}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [comites, searchTerm]);

  const stats = useMemo(() => ({
    total: comites.length,
    totalMembers: comites.reduce((sum, comite) => sum + getCommitteeMembersCount(comite), 0),
    totalSessions: comites.reduce((sum, comite) => sum + getCommitteeSessionsCount(comite), 0),
    totalDecisions: comites.reduce((sum, comite) => sum + getCommitteeDecisionsCount(comite), 0),
  }), [comites]);

  const selectedCommitteeDecisions = useMemo(() => {
    if (!selectedComiteForDecisions) return [];
    return [...getCommitteeDecisions(selectedComiteForDecisions)].sort(
      (left, right) => Number(right.id || 0) - Number(left.id || 0),
    );
  }, [selectedComiteForDecisions]);

  const selectedCommitteeSessions = useMemo(() => {
    if (!selectedComiteForSessions) return [];
    return [...getCommitteeSessions(selectedComiteForSessions)].sort(
      (left, right) => Number(right.id || 0) - Number(left.id || 0),
    );
  }, [selectedComiteForSessions]);

  const openAdd = () => {
    setCommitteeModal({
      isOpen: true,
      committee: null,
      initialTab: 'details',
    });
  };

  const openEdit = (comite) => {
    setCommitteeModal({
      isOpen: true,
      committee: comite,
      initialTab: 'details',
    });
  };

  const validateForm = () => {
    if (!formData.titre.trim() || formData.titre.trim().length < 3) {
      return 'اسم اللجنة مطلوب ويجب أن يكون 3 أحرف على الأقل';
    }
    return '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        titre: formData.titre.trim(),
        description: formData.description.trim() || null,
      };

      if (editingComite) {
        await axios.patch(`${API_CONFIG.DIRECTEUR.COMITES}/${editingComite.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showToast('تم تحديث اللجنة بنجاح', 'success');
      } else {
        await axios.post(API_CONFIG.DIRECTEUR.COMITES, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showToast('تم إنشاء لجنة جديدة', 'success');
      }

      setShowModal(false);
      fetchComites({ silent: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'حدث خطأ';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (comite) => {
    if (!window.confirm(`هل تريد حذف اللجنة رقم ${comite.id}؟`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_CONFIG.DIRECTEUR.COMITES}/${comite.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('تم حذف اللجنة', 'success');
      fetchComites();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'حدث خطأ';
      showToast(msg, 'error');
    }
  };

  return (
    <div dir="rtl" style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <div style={eyebrowStyle}>إدارة اللجان</div>
          <h2 style={titleStyle}>اللجان</h2>
        </div>

        <button type="button" onClick={openAdd} style={primaryButtonStyle}>
          <Plus size={18} /> لجنة جديدة
        </button>
      </div>

      <div style={statsGridStyle}>
        <StatCard label="إجمالي اللجان" value={stats.total} />
        <StatCard label="إجمالي الأعضاء" value={stats.totalMembers} />
        <StatCard label="إجمالي الجلسات" value={stats.totalSessions} />
        <StatCard label="إجمالي المقررات" value={stats.totalDecisions} />
      </div>

      <div style={toolbarStyle}>
        <div style={searchWrapStyle}>
          <Search size={16} color="#69c0e2" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث برقم اللجنة أو الموضوع"
            style={searchInputStyle}
          />
        </div>
      </div>

      {loading ? (
        <div style={emptyStateStyle}>جاري تحميل اللجان...</div>
      ) : filteredComites.length === 0 ? (
        <div style={emptyStateStyle}>لا توجد لجان مطابقة.</div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={committeeTableStyle}>
            <thead>
              <tr style={committeeTableHeadRowStyle}>
                <th style={committeeHeadCellStyle}>#</th>
                <th style={committeeHeadCellStyle}>اللجنة</th>
                <th style={committeeHeadCellStyle}>الوصف</th>
                <th style={committeeHeadCellStyle}>الأعضاء</th>
                <th style={committeeHeadCellStyle}>الجلسات</th>
                <th style={committeeHeadCellStyle}>المقررات</th>
                <th style={committeeHeadCellStyle}>تاريخ الإنشاء</th>
                <th style={committeeHeadCellStyle}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredComites.map((comite) => (
                <tr key={comite.id} style={committeeRowStyle}>
                  <td style={committeeCellStyle}>{comite.id}</td>
                  <td style={committeeCellStyle}>
                    <div style={committeeTitleStyle}>{comite.titre || '-'}</div>
                  </td>
                  <td style={committeeCellStyle}>
                    <div style={committeeDescriptionStyle}>{comite.description || 'لا يوجد وصف إضافي'}</div>
                  </td>
                  <td style={committeeCellStyle}>{getCommitteeMembersCount(comite)}</td>
                  <td style={committeeCellStyle}>{getCommitteeSessionsCount(comite)}</td>
                  <td style={committeeCellStyle}>{getCommitteeDecisionsCount(comite)}</td>
                  <td style={committeeCellStyle}>{formatDateDDMMYYYY(comite.dateCreation)}</td>
                  <td style={committeeCellStyle}>
                    <div style={tableActionsStyle}>
                      <button onClick={() => openEdit(comite)} style={actionButtonStyle}>
                        <Edit2 size={16} /> تعديل
                      </button>
                      <button
                        onClick={() =>
                          setCommitteeModal({ isOpen: true, committee: comite, initialTab: 'sessions' })
                        }
                        style={actionButtonStyle}
                      >
                        <Plus size={16} /> الجلسات
                      </button>
                      <button
                        onClick={() =>
                          setCommitteeModal({ isOpen: true, committee: comite, initialTab: 'members' })
                        }
                        style={actionButtonStyle}
                      >
                        <Users size={16} /> الأعضاء
                      </button>
                      <button
                        onClick={() =>
                          setCommitteeModal({ isOpen: true, committee: comite, initialTab: 'decisions' })
                        }
                        style={actionButtonStyle}
                      >
                        <FileText size={16} /> المقررات
                      </button>
                      <button onClick={() => handleDelete(comite)} style={{ ...actionButtonStyle, ...dangerButtonStyle }}>
                        <Trash2 size={16} /> حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {committeeModal.isOpen && (
        <CommitteeTabbedModal
          isOpen={committeeModal.isOpen}
          committee={committeeModal.committee}
          initialTab={committeeModal.initialTab}
          onClose={() =>
            setCommitteeModal({
              isOpen: false,
              committee: null,
              initialTab: 'details',
            })
          }
          onRefresh={() => fetchComites({ silent: true })}
        />
      )}

      {showModal && (
        <div style={inlineModalBackdropStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <div style={eyebrowStyle}>{editingComite ? `تعديل اللجنة #${editingComite.id}` : 'لجنة جديدة'}</div>
                <h3 style={{ margin: '4px 0 0', fontSize: '22px' }}>{editingComite ? 'تعديل اللجنة' : 'إنشاء لجنة جديدة'}</h3>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={closeButtonStyle}>×</button>
            </div>

            <form onSubmit={handleSave} style={formStyle}>
              {error && <div style={errorStyle}>{error}</div>}

              <div style={fieldStyle}>
                <label style={labelStyle}>اسم اللجنة *</label>
                <input
                  value={formData.titre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, titre: e.target.value }))}
                  placeholder="مثال: لجنة الصفقات"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="ملاحظات أو تفاصيل إضافية"
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                />
              </div>

              <div style={modalActionsStyle}>
                <button type="submit" style={primaryButtonStyle}>
                  حفظ
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={secondaryButtonStyle}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedComiteForMembers && (
        <MembreComiteManagement
          idComite={selectedComiteForMembers.id}
          onClose={() => setSelectedComiteForMembers(null)}
        />
      )}

      {selectedComiteForSessions && (
        <div style={inlineModalBackdropStyle} onClick={() => setSelectedComiteForSessions(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <div style={eyebrowStyle}>اللجنة #{selectedComiteForSessions.id}</div>
                <h3 style={{ margin: '4px 0 0', fontSize: '22px' }}>جلسات اللجنة</h3>
                <div style={subTitleStyle}>إجمالي الجلسات: {selectedCommitteeSessions.length}</div>
              </div>
              <button type="button" onClick={() => setSelectedComiteForSessions(null)} style={closeButtonStyle}>×</button>
            </div>

            <div style={sessionListStyle}>
              {selectedCommitteeSessions.length === 0 ? (
                <div style={emptyDecisionStateStyle}>لا توجد جلسات مرتبطة بهذه اللجنة.</div>
              ) : (
                selectedCommitteeSessions.map((session) => (
                  <article key={session.id} style={sessionItemStyle}>
                    <div>
                      <div style={decisionNumberStyle}>الجلسة #{session.id}</div>
                      <h4 style={decisionTitleStyle}>{session.lieu || 'بدون مكان محدد'}</h4>
                      <div style={decisionMetaStyle}>
                        التاريخ: {formatDateDDMMYYYY(session.dateSession)}
                      </div>
                      <div style={decisionMetaStyle}>
                        المقررات المرتبطة: {Array.isArray(session.decisions) ? session.decisions.length : 0}
                      </div>
                    </div>
                    <div style={decisionMetaRightStyle}>
                      <div style={decisionStatusStyle}>
                        {(session.statut || 'planned').toLowerCase() === 'active'
                          ? 'نشطة'
                          : (session.statut || 'planned').toLowerCase() === 'completed'
                            ? 'مكتملة'
                            : 'مجدولة'}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedComiteForDecisions && (
        <div style={inlineModalBackdropStyle} onClick={() => setSelectedComiteForDecisions(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <div style={eyebrowStyle}>اللجنة #{selectedComiteForDecisions.id}</div>
                <h3 style={{ margin: '4px 0 0', fontSize: '22px' }}>مقررات اللجنة</h3>
                <div style={subTitleStyle}>إجمالي المقررات: {selectedCommitteeDecisions.length}</div>
              </div>
              <button type="button" onClick={() => setSelectedComiteForDecisions(null)} style={closeButtonStyle}>×</button>
            </div>

            <div style={decisionListStyle}>
              {selectedCommitteeDecisions.length === 0 ? (
                <div style={emptyDecisionStateStyle}>لا توجد مقررات مرتبطة بهذه اللجنة.</div>
              ) : (
                selectedCommitteeDecisions.map((decision) => (
                  <article key={decision.id} style={decisionItemStyle}>
                    <div>
                      <div style={decisionNumberStyle}>
                        رقم القرار: {decision.numAdmin || `#${decision.id}`}
                      </div>
                      <h4 style={decisionTitleStyle}>{decision.fichierName || decision.titre || `قرار #${decision.id}`}</h4>
                      <div style={decisionMetaStyle}>
                        الموضوع: {decision.subject?.sujet || decision.sujetNom || '-'}
                      </div>
                      <div style={decisionMetaStyle}>
                        المسار: {decision.fichierPath || '-'}
                      </div>
                      <div style={decisionMetaStyle}>
                        الجلسة: {decision.sessionId ? `#${decision.sessionId}` : '-'}
                      </div>
                    </div>
                    <div style={decisionMetaRightStyle}>
                      <div style={decisionStatusStyle}>
                        {(decision.statut || 'inactive').toLowerCase() === 'active' ? 'نشطة' : 'غير نشطة'}
                      </div>
                      <div style={decisionMetaStyle}>{formatDateDDMMYYYY(decision.dateCreation || decision.dateUpload)}</div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function StatCard({ label, value }) {
  return (
    <div style={statCardStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={statValueStyle}>{value}</div>
    </div>
  );
}

const pageStyle = {
  color: '#fff',
  fontFamily: 'Tajawal, sans-serif',
  display: 'grid',
  gap: '18px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
};

const eyebrowStyle = {
  color: '#69c0e2',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '.04em',
};

const titleStyle = {
  margin: '4px 0 0',
  fontSize: '30px',
};

const subTitleStyle = {
  marginTop: '6px',
  color: '#b0b0c0',
  lineHeight: 1.7,
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
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
};

const statCardStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(105,192,226,0.18)',
  borderRadius: '20px',
  padding: '18px',
};

const statLabelStyle = {
  color: '#b0b0c0',
  fontSize: '12px',
};

const statValueStyle = {
  marginTop: '10px',
  fontSize: '28px',
  fontWeight: 800,
};

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const searchWrapStyle = {
  flex: '1 1 320px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(105,192,226,0.18)',
  borderRadius: '14px',
  padding: '12px 14px',
};

const searchInputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#fff',
  fontSize: '14px',
  fontFamily: 'Tajawal, sans-serif',
};

const emptyStateStyle = {
  padding: '42px 20px',
  textAlign: 'center',
  color: '#b0b0c0',
  background: 'rgba(255,255,255,0.05)',
  border: '1px dashed rgba(105,192,226,0.22)',
  borderRadius: '20px',
};

const tableContainerStyle = {
  overflowX: 'auto',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(105,192,226,0.18)',
  borderRadius: '20px',
  backdropFilter: 'blur(20px)',
};

const committeeTableStyle = {
  width: '100%',
  minWidth: '1100px',
  borderCollapse: 'collapse',
};

const committeeTableHeadRowStyle = {
  background: 'rgba(105,192,226,0.12)',
};

const committeeHeadCellStyle = {
  padding: '14px 16px',
  textAlign: 'right',
  color: '#69c0e2',
  fontSize: '13px',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const committeeRowStyle = {
  borderTop: '1px solid rgba(255,255,255,0.08)',
};

const committeeCellStyle = {
  padding: '14px 16px',
  textAlign: 'right',
  verticalAlign: 'top',
  color: '#fff',
};

const committeeTitleStyle = {
  fontSize: '16px',
  fontWeight: 800,
  lineHeight: 1.6,
};

const committeeDescriptionStyle = {
  color: '#b0b0c0',
  lineHeight: 1.7,
};

const tableActionsStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const actionButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: '12px',
  padding: '10px 12px',
  cursor: 'pointer',
  fontFamily: 'Tajawal, sans-serif',
};

const dangerButtonStyle = {
  background: 'rgba(239,68,68,0.16)',
  borderColor: 'rgba(239,68,68,0.28)',
};

const modalStyle = {
  width: 'min(680px, 92vw)',
  maxHeight: '90vh',
  overflow: 'auto',
  background: 'linear-gradient(180deg, rgba(13,18,48,0.98), rgba(15,15,46,0.96))',
  border: '1px solid rgba(105,192,226,0.22)',
  borderRadius: '24px',
  color: '#fff',
  fontFamily: 'Tajawal, sans-serif',
  boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
};

const inlineModalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 2000,
  background: 'rgba(4, 10, 22, 0.78)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  overflow: 'auto',
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '20px 20px 0',
};

const closeButtonStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '28px',
  lineHeight: 1,
};

const formStyle = {
  padding: '20px',
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

const errorStyle = {
  background: 'rgba(239,68,68,0.14)',
  color: '#fca5a5',
  border: '1px solid rgba(239,68,68,0.24)',
  borderRadius: '14px',
  padding: '12px 14px',
};

const modalActionsStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
};

const sessionListStyle = {
  padding: '20px',
  display: 'grid',
  gap: '12px',
};

const sessionItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  alignItems: 'flex-start',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(105,192,226,0.14)',
  borderRadius: '18px',
  padding: '16px',
};

const decisionListStyle = {
  padding: '20px',
  display: 'grid',
  gap: '12px',
};

const emptyDecisionStateStyle = {
  padding: '32px 20px',
  textAlign: 'center',
  color: '#b0b0c0',
  background: 'rgba(255,255,255,0.05)',
  border: '1px dashed rgba(105,192,226,0.22)',
  borderRadius: '18px',
};

const decisionItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  alignItems: 'flex-start',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(105,192,226,0.14)',
  borderRadius: '18px',
  padding: '16px',
};

const decisionNumberStyle = {
  color: '#69c0e2',
  fontSize: '12px',
  fontWeight: 800,
  marginBottom: '8px',
};

const decisionTitleStyle = {
  margin: '0 0 6px',
  fontSize: '18px',
  lineHeight: 1.6,
};

const decisionMetaStyle = {
  color: '#b0b0c0',
  fontSize: '13px',
  lineHeight: 1.7,
  wordBreak: 'break-word',
};

const decisionMetaRightStyle = {
  minWidth: '120px',
  textAlign: 'left',
  display: 'grid',
  gap: '8px',
};

const decisionStatusStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 10px',
  borderRadius: '999px',
  background: 'rgba(105,192,226,0.14)',
  color: '#dff7ff',
  border: '1px solid rgba(105,192,226,0.22)',
  fontSize: '12px',
  fontWeight: 700,
};

export default ComitesManagement;
