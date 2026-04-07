import React, { useEffect, useMemo, useState } from 'react';
import { Eye, FileText, LayoutDashboard, LogOut, Printer, Search, ShieldCheck } from 'lucide-react';
import axios from '../../lib/httpClient';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import DecisionViewer, { openDecisionPrintWindow, statusColors } from '../directeur/DecisionViewer';
import Toaster, { showToast } from '../common/Toaster';
import '../../styles/admindashboard.css';

const RapporteurDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const nomPrenom = localStorage.getItem('nomPrenom') || 'Utilisateur';

  useEffect(() => {
    loadAssignedDecisions();
  }, []);

  const loadAssignedDecisions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_CONFIG.COMITE.ASSIGNED_DECISIONS);
      setDecisions(response.data || []);
    } catch (error) {
      setDecisions([]);
      showToast('تعذر تحميل المقررات المسندة', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredDecisions = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return decisions;

    return decisions.filter((decision) => {
      const committeeTitle = decision.comite?.titre || decision.session?.comite?.titre || '';
      const subjectName = decision.subject?.sujet || '';
      const fileName = decision.fichierName || '';
      const title = decision.titre || '';
      const haystack = `${committeeTitle} ${subjectName} ${fileName} ${title}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [decisions, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: decisions.length,
      active: decisions.filter((item) => (item.statut || '').toLowerCase() === 'active').length,
      committees: new Set(
        decisions.map((item) => item.comite?.id || item.session?.comite?.id).filter(Boolean),
      ).size,
    };
  }, [decisions]);

  const openViewer = (decision) => {
    setSelectedDecision(decision);
    setViewerOpen(true);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
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
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard />
            <span>نظرة عامة</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'decisions' ? 'active' : ''}`}
            onClick={() => setActiveTab('decisions')}
          >
            <FileText />
            <span>المقررات المسندة</span>
          </button>
        </nav>

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
            </div>
          </div>
          <h1>{activeTab === 'overview' ? 'ملخص اللجنة' : 'المقررات المسندة'}</h1>
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
                    <button style={refreshBtnStyle} onClick={loadAssignedDecisions}>
                      تحديث
                    </button>
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
                            <Th>الموضوع</Th>
                            <Th>الملف</Th>
                            <Th>الحالة</Th>
                            <Th>التاريخ</Th>
                            <Th>الإجراءات</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDecisions.map((decision) => {
                            const status =
                              statusColors[(decision.statut || '').toLowerCase()] || statusColors.inactive;
                            return (
                              <tr key={decision.id} style={trStyle}>
                                <Td>{decision.id}</Td>
                                <Td>{decision.comite?.titre || decision.session?.comite?.titre || '-'}</Td>
                                <Td>{decision.subject?.sujet || '-'}</Td>
                                <Td>{decision.fichierName || '-'}</Td>
                                <Td>
                                  <span
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '999px',
                                      background: status.bg,
                                      color: status.color,
                                      border: `1px solid ${status.color}44`,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {status.label}
                                  </span>
                                </Td>
                                <Td>{formatDateDDMMYYYY(decision.dateCreation || decision.dateUpload)}</Td>
                                <Td>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button style={actionBtnStyle} onClick={() => openViewer(decision)}>
                                      <Eye size={14} /> عرض
                                    </button>
                                    <button style={actionBtnStyle} onClick={() => openDecisionPrintWindow(decision)}>
                                      <Printer size={14} /> طباعة
                                    </button>
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
            </>
          )}
        </div>
      </main>

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

const contentWrap = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(105,192,226,0.18)',
  borderRadius: '18px',
  padding: '18px',
};

const loadingState = {
  minHeight: '220px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#dff7ff',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '14px',
};

const statCardStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(105,192,226,0.18)',
  borderRadius: '16px',
  padding: '16px',
};

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px',
  alignItems: 'center',
  marginBottom: '14px',
  flexWrap: 'wrap',
};

const searchBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(105,192,226,0.2)',
  borderRadius: '12px',
  padding: '0 10px',
  height: '44px',
  flex: '1 1 320px',
};

const searchInputStyle = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
};

const refreshBtnStyle = {
  background: 'rgba(105,192,226,0.2)',
  border: '1px solid rgba(105,192,226,0.3)',
  borderRadius: '12px',
  color: '#fff',
  padding: '10px 14px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const emptyStyle = {
  padding: '36px',
  border: '1px dashed rgba(105,192,226,0.3)',
  borderRadius: '14px',
  color: '#b0b0c0',
  textAlign: 'center',
};

const tableWrapStyle = {
  overflowX: 'auto',
  border: '1px solid rgba(105,192,226,0.2)',
  borderRadius: '14px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '900px',
};

const thStyle = {
  textAlign: 'right',
  padding: '12px 14px',
  color: '#69c0e2',
  background: 'rgba(105,192,226,0.1)',
  fontSize: '13px',
};

const tdStyle = {
  textAlign: 'right',
  padding: '12px 14px',
  borderTop: '1px solid rgba(255,255,255,0.06)',
  verticalAlign: 'top',
};

const trStyle = {
  background: 'rgba(255,255,255,0.02)',
};

const actionBtnStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '10px',
  color: '#fff',
  padding: '8px 10px',
  cursor: 'pointer',
  display: 'inline-flex',
  gap: '6px',
  alignItems: 'center',
  fontFamily: 'inherit',
};

export default RapporteurDashboard;
