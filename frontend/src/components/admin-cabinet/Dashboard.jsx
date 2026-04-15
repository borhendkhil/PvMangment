import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Search, Users, FileText, AlertCircle, CheckCircle,
  Clock, TrendingUp, MoreVertical, ChevronDown
} from 'lucide-react';
import axios from '../../lib/httpClient';
import API_CONFIG from '../../config/api';
import '../../styles/DashboardCabinet.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionRows, setSessionRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  // جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessResponse, decResponse] = await Promise.all([
          axios.get(API_CONFIG.COMITE_SESSIONS),
          axios.get(API_CONFIG.DECISIONS)
        ]);

        const sessions = sessResponse.data?.data || sessResponse.data || [];
        const decisions = decResponse.data?.data || decResponse.data || [];

        const rows = buildSessionRows(sessions, decisions);
        setSessionRows(rows);
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setSessionRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // بناء صفوف الجلسات
  const buildSessionRows = (sessions, decisions) => {
    return sessions.map(session => {
      const sessionDecisions = decisions.filter(d => d.sessionId === session.id);
      const totalDecisions = sessionDecisions.length;
      const receivedCount = sessionDecisions.filter(d => d.receivedDate).length;
      
      const sessionDate = new Date(session.date);
      const deadline = new Date(sessionDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const latestReceived = sessionDecisions
        .filter(d => d.receivedDate)
        .map(d => new Date(d.receivedDate))
        .sort((a, b) => b - a)[0];

      let status = 'في الآجال';
      let diffHours = null;

      if (!latestReceived) {
        status = 'غير مستلم';
      } else if (latestReceived > deadline) {
        status = 'متأخر';
        diffHours = Math.round((latestReceived - deadline) / (1000 * 60 * 60));
      }

      return {
        id: session.id,
        session: `جلسة #${session.id}`,
        subject: session.subject || 'بدون موضوع',
        structure: session.structure || 'غير محدد',
        sessionDate: formatDateTime(sessionDate),
        receivedDate: latestReceived ? formatDateTime(latestReceived) : 'لم يتم الاستقبال',
        status,
        diffHours,
        totalDecisions,
        receivedCount,
        complianceRate: totalDecisions > 0 ? Math.round((receivedCount / totalDecisions) * 100) : 0
      };
    });
  };

  // تنسيق التاريخ
  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('ar-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // حساب المقاييس
  const metrics = useMemo(() => {
    const total = sessionRows.length;
    const compliant = sessionRows.filter(r => r.status === 'في الآجال').length;
    const late = sessionRows.filter(r => r.status === 'متأخر').length;
    const missing = sessionRows.filter(r => r.status === 'غير مستلم').length;

    return {
      totalSessions: total,
      compliant,
      late,
      missing,
      complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0
    };
  }, [sessionRows]);

  // بيانات الرسم البياني
  const chartData = useMemo(() => {
    return [
      { name: 'في الآجال', value: metrics.compliant, fill: '#00cc88' },
      { name: 'متأخر', value: metrics.late, fill: '#ffaa00' },
      { name: 'غير مستلم', value: metrics.missing, fill: '#ff5555' }
    ];
  }, [metrics]);

  // بيانات الأعمدة
  const barData = useMemo(() => {
    const structureMap = {};
    sessionRows.forEach(row => {
      structureMap[row.structure] = (structureMap[row.structure] || 0) + 1;
    });
    return Object.entries(structureMap).map(([name, count]) => ({
      name,
      العدد: count
    }));
  }, [sessionRows]);

  // الصفوف المصفاة
  const filteredRows = sessionRows.filter(row =>
    row.session.includes(searchTerm) ||
    row.subject.includes(searchTerm) ||
    row.structure.includes(searchTerm)
  );

  if (loading) {
    return (
      <div style={sx.loadingContainer}>
        <div style={sx.spinner}></div>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" dir="rtl">
      {/* الشريط الجانبي */}
      <aside style={sx.sidebar}>
        {/* الشعار والعنوان */}
        <div style={sx.logoSection}>
          <h2 style={sx.sidebarTitle}>متابعة القرارات</h2>
          <p style={sx.subtitle}>لجنة المتابعة الحكومية</p>
        </div>

        {/* بطاقة المقاييس الرئيسية */}
        <div className="glass-card" style={sx.metricsCard}>
          <h4 style={sx.cardHeader}>📊 ملخص الامتثال</h4>
          <div style={sx.metricRow}>
            <span style={sx.metricLabel}>إجمالي الجلسات:</span>
            <span style={sx.metricValue}>{metrics.totalSessions}</span>
          </div>
          <div style={sx.metricRow}>
            <span style={sx.metricLabel}>في الآجال:</span>
            <span style={{...sx.metricValue, color: '#00cc88'}}>{metrics.compliant}</span>
          </div>
          <div style={sx.metricRow}>
            <span style={sx.metricLabel}>متأخر:</span>
            <span style={{...sx.metricValue, color: '#ffaa00'}}>{metrics.late}</span>
          </div>
          <div style={sx.metricRow}>
            <span style={sx.metricLabel}>غير مستلم:</span>
            <span style={{...sx.metricValue, color: '#ff5555'}}>{metrics.missing}</span>
          </div>
        </div>

        {/* معدل الامتثال */}
        <div className="glass-card" style={sx.progressCard}>
          <h4 style={sx.cardHeader}>📈 معدل الامتثال</h4>
          <div style={sx.progressValue}>{metrics.complianceRate}%</div>
          <p style={sx.progressLabel}>من الجلسات في الموعد المحدد</p>
        </div>

        {/* مفتاح الألوان */}
        <div className="glass-card" style={sx.legendCard}>
          <h4 style={sx.cardHeader}>🎯 الحالات</h4>
          <div style={sx.legendItem}>
            <div style={{...sx.legendDot, backgroundColor: '#00cc88'}}></div>
            <span>في الآجال</span>
          </div>
          <div style={sx.legendItem}>
            <div style={{...sx.legendDot, backgroundColor: '#ffaa00'}}></div>
            <span>متأخر</span>
          </div>
          <div style={sx.legendItem}>
            <div style={{...sx.legendDot, backgroundColor: '#ff5555'}}></div>
            <span>غير مستلم</span>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main style={sx.mainContent}>
        {/* رأس الصفحة */}
        <header style={sx.hero}>
          <div>
            <h1 style={sx.heroTitle}>لوحة تحكم الجلسات</h1>
            <p style={sx.heroSubtitle}>إدارة متابعة القرارات الحكومية بكفاءة وشفافية</p>
          </div>
          <div style={sx.heroStats}>
            <div className="glass-card" style={sx.heroStat}>
              <TrendingUp size={24} style={{color: '#00b4dc'}} />
              <div>
                <p style={sx.statValue}>{metrics.complianceRate}%</p>
                <p style={sx.statLabel}>معدل الامتثال</p>
              </div>
            </div>
          </div>
        </header>

        {/* الرسوم البيانية */}
        <section style={sx.chartsSection}>
          {/* رسم التوزيع */}
          <div className="glass-card" style={sx.chartCard}>
            <h3 style={sx.chartTitle}>📊 توزيع الجلسات حسب الهيكل</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,180,220,0.2)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    contentStyle={{background: 'rgba(13,90,122,0.9)', border: '1px solid rgba(0,180,220,0.3)'}}
                    labelStyle={{color: '#00d4ff'}}
                  />
                  <Bar dataKey="العدد" fill="#00b4dc" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={sx.noData}>لا توجد بيانات متاحة</p>
            )}
          </div>

          {/* رسم الحالات */}
          <div className="glass-card" style={sx.chartCard}>
            <h3 style={sx.chartTitle}>🎯 توزيع الحالات</h3>
            {chartData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{background: 'rgba(13,90,122,0.9)', border: '1px solid rgba(0,180,220,0.3)'}}
                    labelStyle={{color: '#00d4ff'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={sx.noData}>لا توجد بيانات متاحة</p>
            )}
          </div>
        </section>

        {/* جدول الجلسات */}
        <section style={sx.tableSection}>
          <div style={sx.tableHeader}>
            <h2 style={sx.tableTitle}>📋 قائمة الجلسات</h2>
            <div style={sx.searchBox}>
              <Search size={18} style={{color: 'var(--text-secondary)'}} />
              <input
                type="text"
                placeholder="ابحث عن جلسة أو موضوع..."
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
                    <th>الجلسة</th>
                    <th>الموضوع</th>
                    <th>الهيكل</th>
                    <th>تاريخ الجلسة</th>
                    <th>تاريخ الاستقبال</th>
                    <th>الحالة</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id} onClick={() => setSelectedRow(row)} style={sx.tableRow}>
                      <td style={sx.tableCell}><strong>{row.session}</strong></td>
                      <td style={sx.tableCell}>{row.subject}</td>
                      <td style={sx.tableCell}>{row.structure}</td>
                      <td style={sx.tableCell}>{row.sessionDate}</td>
                      <td style={sx.tableCell}>{row.receivedDate}</td>
                      <td style={sx.tableCell}>
                        <span className="status-badge" style={{
                          background: row.status === 'في الآجال' ? 'rgba(0, 204, 136, 0.2)' :
                                      row.status === 'متأخر' ? 'rgba(255, 170, 0, 0.2)' :
                                      'rgba(255, 85, 85, 0.2)',
                          color: row.status === 'في الآجال' ? '#00cc88' :
                                 row.status === 'متأخر' ? '#ffaa00' :
                                 '#ff5555',
                          border: `1px solid ${row.status === 'في الآجال' ? '#00cc88' :
                                               row.status === 'متأخر' ? '#ffaa00' :
                                               '#ff5555'}`
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={sx.tableCell}>
                        <button className="btn-premium" onClick={() => setSelectedRow(row)}>
                          تفاصيل
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={sx.noData}>لا توجد جلسات تطابق معايير البحث</p>
            )}
          </div>
        </section>
      </main>

      {/* Modal التفاصيل */}
      {selectedRow && (
        <div style={sx.modalOverlay} onClick={() => setSelectedRow(null)}>
          <div className="glass-card" style={sx.modal} onClick={(e) => e.stopPropagation()}>
            <div style={sx.modalHeader}>
              <h2>تفاصيل {selectedRow.session}</h2>
              <button onClick={() => setSelectedRow(null)} style={sx.closeBtn}>✕</button>
            </div>

            <div style={sx.modalContent}>
              <div style={sx.infoSection}>
                <h4>📌 معلومات عامة</h4>
                <div style={sx.infoGrid}>
                  <div>
                    <span style={sx.infoLabel}>الموضوع:</span>
                    <span style={sx.infoValue}>{selectedRow.subject}</span>
                  </div>
                  <div>
                    <span style={sx.infoLabel}>الهيكل:</span>
                    <span style={sx.infoValue}>{selectedRow.structure}</span>
                  </div>
                  <div>
                    <span style={sx.infoLabel}>تاريخ الجلسة:</span>
                    <span style={sx.infoValue}>{selectedRow.sessionDate}</span>
                  </div>
                  <div>
                    <span style={sx.infoLabel}>الحالة:</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      background: selectedRow.status === 'في الآجال' ? 'rgba(0, 204, 136, 0.2)' :
                                  selectedRow.status === 'متأخر' ? 'rgba(255, 170, 0, 0.2)' :
                                  'rgba(255, 85, 85, 0.2)',
                      color: selectedRow.status === 'في الآجال' ? '#00cc88' :
                             selectedRow.status === 'متأخر' ? '#ffaa00' :
                             '#ff5555'
                    }}>
                      {selectedRow.status}
                    </span>
                  </div>
                </div>
              </div>

              <div style={sx.infoSection}>
                <h4>📊 الإحصائيات</h4>
                <div style={sx.statsGrid}>
                  <div style={sx.statBox}>
                    <span style={sx.statCount}>{selectedRow.totalDecisions}</span>
                    <span style={sx.statName}>إجمالي القرارات</span>
                  </div>
                  <div style={sx.statBox}>
                    <span style={{...sx.statCount, color: '#00cc88'}}>{selectedRow.receivedCount}</span>
                    <span style={sx.statName}>المستلمة</span>
                  </div>
                  <div style={sx.statBox}>
                    <span style={{...sx.statCount, color: '#00b4dc'}}>{selectedRow.complianceRate}%</span>
                    <span style={sx.statName}>معدل الامتثال</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={sx.modalFooter}>
              <button className="btn-premium" onClick={() => setSelectedRow(null)}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// أنماط Tailwind + React Inline
const sx = {
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
    minHeight: '100vh'
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
    fontSize: '48px',
    fontWeight: 800,
    color: '#00d4ff',
    margin: '12px 0'
  },
  progressLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  legendCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px',
    background: 'var(--gradient-light)',
    borderRadius: '20px',
    marginBottom: '20px'
  },
  heroTitle: {
    fontSize: '42px',
    margin: '0 0 12px 0',
    color: '#f5f9ff'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  heroStats: {
    display: 'flex',
    gap: '16px'
  },
  heroStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#00b4dc',
    margin: 0
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '4px 0 0 0'
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
    fontSize: '14px'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  modal: {
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(0, 180, 220, 0.2)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '24px',
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
    fontSize: '12px',
    color: '#00b4dc',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '6px'
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    display: 'block'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    background: 'rgba(0, 180, 220, 0.1)',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statCount: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#00b4dc',
    marginBottom: '8px'
  },
  statName: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    textAlign: 'center'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(0, 180, 220, 0.2)'
  }
};

export default Dashboard;
