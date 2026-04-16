import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Search, Users, FileText, AlertCircle, CheckCircle,
  TrendingUp, Activity, PenTool, Edit
} from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/DashboardCabinet.css';
import Toaster, { showToast } from '../common/Toaster';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  
  const [editNotes, setEditNotes] = useState('');
  const [editWarning, setEditWarning] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_CONFIG.CABINET.DASHBOARD_STATS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching cabinet stats:', error);
      showToast('تعذر تحميل بيانات الشاشة', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotesAndWarning = async () => {
    if (!selectedRow) return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      await axios.patch(API_CONFIG.CABINET.UPDATE_NOTES(selectedRow.id), {
        notes: editNotes,
        warning: editWarning
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('تم حفظ التعديلات بنجاح', 'success');
      setSelectedRow(null);
      fetchData(); // Refresh to get updated notes
    } catch (error) {
      console.error(error);
      showToast('خطأ في حفظ البيانات', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openRowModal = (row) => {
    setSelectedRow(row);
    setEditNotes(row.cabinetNotes || '');
    setEditWarning(row.cabinetWarning || '');
  };

  if (loading) {
    return (
      <div style={sx.loadingContainer}>
        <div style={sx.spinner}></div>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  const delayedList = stats?.delayedMinutesList || [];
  const filteredRows = delayedList.filter(row =>
    row.comiteName?.includes(searchTerm) ||
    row.rapporteurName?.includes(searchTerm)
  );

  return (
    <div className="dashboard-container" dir="rtl" style={sx.dashboardContainer}>
      <Toaster />
      <aside style={sx.sidebar}>
        <div style={sx.logoSection}>
          <h2 style={sx.sidebarTitle}>لوحة القيادة</h2>
          <p style={sx.subtitle}>الديوان (Cabinet)</p>
        </div>

        <div className="glass-card" style={sx.metricsCard}>
           <h4 style={sx.cardHeader}>⚠️ تنبيهات التأخير</h4>
           <div style={sx.metricRow}>
             <span style={sx.metricLabel}>إجمالي المحاضر المتأخرة:</span>
             <span style={{...sx.metricValue, color: '#ff5555'}}>{stats?.delayedCount || 0}</span>
           </div>
        </div>

        {stats?.mostDelayedEmployee && (
          <div className="glass-card" style={sx.progressCard}>
            <h4 style={sx.cardHeader}>🚨 الأكثر تأخيراً</h4>
            <AlertCircle size={40} color="#ffaa00" style={{ margin: '10px auto' }} />
            <div style={sx.progressValue}>{stats.mostDelayedEmployee.name}</div>
             <p style={{...sx.progressLabel, color: '#ffaa00'}}>{stats.mostDelayedEmployee.count} محاضر متأخرة</p>
          </div>
        )}
      </aside>

      <main style={sx.mainContent}>
        <header style={sx.hero}>
          <div>
            <h1 style={sx.heroTitle}>إحصائيات الإدارات واللجان</h1>
            <p style={sx.heroSubtitle}>متابعة المقررات، المحاضر، ونشاط الموظفين</p>
          </div>
        </header>

        <section style={sx.chartsSection}>
          <div className="glass-card" style={sx.chartCard}>
            <h3 style={sx.chartTitle}>📊 المقررات لكل إدارة في كل شهر</h3>
            {stats?.decisionsPerDirectionMonth && stats.decisionsPerDirectionMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.decisionsPerDirectionMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,180,220,0.1)" />
                  <XAxis dataKey="direction" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{background: 'rgba(13,90,122,0.9)'}} />
                  <Bar dataKey="count" fill="#4B9FE3" radius={[8, 8, 0, 0]} name="المقررات" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={sx.noData}>لا توجد بيانات متاحة</p>}
          </div>

          <div className="glass-card" style={sx.chartCard}>
             <h3 style={sx.chartTitle}>📑 عدد اللجان لكل موضوع</h3>
             {stats?.committeesPerSubject && stats.committeesPerSubject.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats.committeesPerSubject} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" nameKey="name">
                    {stats.committeesPerSubject.map((entry, index) => (
                      <Cell key={index} fill={['#00cc88', '#ffaa00', '#00b4dc', '#8884d8'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{background: 'rgba(13,90,122,0.9)'}} />
                </PieChart>
              </ResponsiveContainer>
              ) : <p style={sx.noData}>لا توجد بيانات متاحة</p>}
          </div>
        </section>

        <section style={sx.chartsSection}>
          <div className="glass-card" style={sx.chartCard}>
            <h3 style={sx.chartTitle}>📝 عدد المحاضر لكل إدارة (مقرر الجلسة)</h3>
            {stats?.minutesPerDirection && stats.minutesPerDirection.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.minutesPerDirection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,180,220,0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{background: 'rgba(13,90,122,0.9)'}} />
                  <Bar dataKey="count" fill="#00cc88" radius={[8, 8, 0, 0]} name="المحاضر" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={sx.noData}>لا توجد بيانات متاحة</p>}
          </div>
          
          <div className="glass-card" style={sx.chartCard}>
            <h3 style={sx.chartTitle}>📌 المقررات لكل موضوع</h3>
            {stats?.decisionsPerSubject && stats.decisionsPerSubject.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.decisionsPerSubject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,180,220,0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{background: 'rgba(13,90,122,0.9)'}} />
                  <Bar dataKey="count" fill="#d88484" radius={[8, 8, 0, 0]} name="المقررات" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={sx.noData}>لا توجد بيانات متاحة</p>}
          </div>
        </section>

        <section style={sx.tableSection}>
          <div style={sx.tableHeader}>
            <h2 style={sx.tableTitle}>⏳ قائمة المحاضر المتأخرة أكثر من 48 ساعة</h2>
            <div style={sx.searchBox}>
              <Search size={18} style={{color: 'var(--text-secondary)'}} />
              <input
                type="text"
                placeholder="ابحث عن لجنة أو مقرر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={sx.searchInput}
              />
            </div>
          </div>

          <div className="glass-card" style={sx.tableWrapper}>
            {filteredRows.length > 0 ? (
              <table style={sx.table}>
                <thead>
                  <tr>
                    <th>اللجنة</th>
                    <th>تاريخ الجلسة</th>
                    <th>مقرر الجلسة</th>
                    <th>ساعات التأخير</th>
                    <th>ملاحظات الديوان</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id} style={sx.tableRow} onClick={() => openRowModal(row)}>
                      <td style={sx.tableCell}><strong>{row.comiteName}</strong></td>
                      <td style={sx.tableCell}>{new Date(row.sessionDate).toLocaleDateString('ar-TN')}</td>
                      <td style={sx.tableCell}>{row.rapporteurName}</td>
                      <td style={{...sx.tableCell, color: '#ff5555', fontWeight: 'bold'}}>{row.delayedHours}س</td>
                      <td style={sx.tableCell}>
                        {row.cabinetNotes || row.cabinetWarning ? <CheckCircle size={16} color="#00cc88" /> : 'لا يوجد'}
                      </td>
                      <td style={sx.tableCell}>
                        <button className="btn-premium" onClick={(e) => { e.stopPropagation(); openRowModal(row); }} style={{ fontSize: '12px', padding: '6px 12px' }}>
                          <PenTool size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                          تحرير
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={sx.noData}>لا يوجد محاضر متأخرة حالياً</p>
            )}
          </div>
        </section>
      </main>

      {/* Modal تفاصيل وإدخال الملاحظات */}
      {selectedRow && (
        <div style={sx.modalOverlay} onClick={() => setSelectedRow(null)}>
          <div className="glass-card" style={sx.modal} onClick={(e) => e.stopPropagation()}>
            <div style={sx.modalHeader}>
              <h2>📝 إدارة تأخير المحضر (لجنة {selectedRow.comiteName})</h2>
              <button onClick={() => setSelectedRow(null)} style={sx.closeBtn}>✕</button>
            </div>

            <div style={sx.modalContent}>
              <div style={sx.infoGrid}>
                <div>
                  <span style={sx.infoLabel}>مقرر الجلسة المطالب بالمحضر:</span>
                  <span style={sx.infoValue}>{selectedRow.rapporteurName}</span>
                </div>
                <div>
                  <span style={sx.infoLabel}>تاريخ الانعقاد:</span>
                  <span style={sx.infoValue}>{new Date(selectedRow.sessionDate).toLocaleString('ar-TN')}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={sx.infoLabel}>تنبيه للموظف (يظهر للموظف فقط):</label>
                <textarea 
                  value={editWarning}
                  onChange={(e) => setEditWarning(e.target.value)}
                  placeholder="اكتب التنبيه على التأخير هنا..."
                  style={sx.textareaStyle}
                  rows={3}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={sx.infoLabel}>ملاحظات الديوان (تظهر لأعضاء اللجنة):</label>
                <textarea 
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="ملاحظات حول أسباب التأخير أو إجراءات أخرى..."
                  style={sx.textareaStyle}
                  rows={3}
                />
              </div>
            </div>

            <div style={sx.modalFooter}>
              <button className="btn-secondary" onClick={() => setSelectedRow(null)} style={{ padding: '8px 16px', background: 'rgba(21, 96, 130, 0.45)', border: '1px solid rgba(80, 210, 255, 0.28)', borderRadius: '8px', color: '#dff4ff', cursor: 'pointer' }}>
                إغلاق
              </button>
              <button className="btn-premium" onClick={handleSaveNotesAndWarning} disabled={isSaving}>
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const sx = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-main)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #072b3a 0%, #0a3d52 100%)',
    color: '#f5f9ff'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(0, 180, 220, 0.2)',
    borderTop: '4px solid #00b4dc',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '280px',
    padding: '24px',
    background: 'var(--bg-glass)',
    borderLeft: '1px solid var(--border-glass)'
  },
  logoSection: {
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(0, 180, 220, 0.15)'
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    color: '#00d4ff'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  metricsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  cardHeader: {
    fontSize: '14px',
    color: '#00d4ff',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(0, 180, 220, 0.1)'
  },
  metricLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)'
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#00d4ff'
  },
  progressCard: {
    textAlign: 'center'
  },
  progressValue: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#00d4ff',
    margin: '12px 0'
  },
  progressLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '32px',
    padding: '32px',
    overflowY: 'auto'
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px',
    background: 'var(--gradient-light)',
    borderRadius: '20px',
    marginBottom: '0'
  },
  heroTitle: {
    fontSize: '36px',
    margin: '0 0 12px 0',
    color: 'rgb(1, 60, 147)'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  chartsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  },
  chartCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-main)',
    margin: 0
  },
  noData: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    padding: '40px 20px'
  },
  tableSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
  },
  tableTitle: {
    fontSize: '22px',
    fontWeight: 700,
    margin: 0,
    color: 'var(--text-main)'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(13, 90, 122, 0.3)',
    border: '1px solid rgba(0, 180, 220, 0.2)',
    borderRadius: '12px',
    minWidth: '300px'
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '14px',
    flex: 1
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0'
  },
  tableRow: {
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tableCell: {
    padding: '16px 12px',
    textAlign: 'right',
    borderBottom: '1px solid rgba(0, 180, 220, 0.1)',
    fontSize: '14px',
    color: 'var(--text-main)'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(circle at 20% 10%, rgba(0, 180, 220, 0.15), rgba(0, 0, 0, 0.78) 55%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)'
  },
  modal: {
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
    padding: '24px',
    background: 'linear-gradient(160deg, rgba(7, 42, 60, 0.97) 0%, rgba(4, 28, 43, 0.98) 100%)',
    border: '1px solid rgba(0, 198, 255, 0.34)',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 180, 220, 0.12) inset'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(0, 198, 255, 0.28)',
    color: '#eaf7ff'
  },
  closeBtn: {
    background: 'rgba(255, 102, 102, 0.12)',
    border: '1px solid rgba(255, 102, 102, 0.35)',
    color: '#ffb2b2',
    fontSize: '24px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    lineHeight: 1,
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '24px'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  infoLabel: {
    fontSize: '13px',
    color: '#45d4ff',
    display: 'block',
    marginBottom: '6px'
  },
  infoValue: {
    fontSize: '14px',
    color: '#f7fcff',
    display: 'block',
    fontWeight: 'bold'
  },
  textareaStyle: {
    width: '100%',
    background: 'linear-gradient(180deg, rgba(5, 33, 48, 0.92) 0%, rgba(3, 24, 36, 0.92) 100%)',
    border: '1px solid rgba(70, 210, 255, 0.45)',
    borderRadius: '12px',
    padding: '12px',
    color: '#f2fbff',
    resize: 'vertical',
    outline: 'none',
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(0, 180, 220, 0.08)'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '16px',
    borderTop: '1px solid rgba(0, 198, 255, 0.24)'
  }
};

export default Dashboard;
