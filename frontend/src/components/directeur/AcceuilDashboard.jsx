import React, { useEffect, useState } from 'react';
import {
  Bell,
  Briefcase,
  CheckCircle,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Users,
  AlertTriangle,
  Activity,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import '../../styles/directeur-dashboard.css';
import Toaster, { showToast } from '../common/Toaster';
import ComitesManagement from './ComitesManagement';
import DecisionManagement from './DecisionManagement';
import ProcessWizard from './ProcessWizard';
import SujetDecisionManagement from './SujetDecisionManagement';

// Dashboard stats logic is now handled in the backend

const AcceuilDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [nomPrenom, setNomPrenom] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem('nomPrenom');
    setNomPrenom(userName && userName !== 'undefined' ? userName : 'مستخدم');
    void fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_CONFIG.DIRECTEUR.DASHBOARD_STATS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      showToast('تعذر تحميل بيانات لوحة التحكم', 'error');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      <div className="dashboard directeur-dashboard" dir="rtl">
        <div className="bg-effects"></div>

        <aside className="sidebar directeur-sidebar">
          <div className="logo">
            <img src="/images/logo_mini.png" alt="Logo" />
            <span>منظومة إدارة ومتابعة الجلسات</span>
          </div>

          <nav>
            <div className="nav-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NavItem
                  icon={<LayoutDashboard color="white" strokeWidth={2} />}
                  label="لوحة التحكم"
                  active={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                />
              </div>
            </div>

            <div className="nav-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NavItem
                  icon={<FileText color="white" strokeWidth={2} />}
                  label="إدارة الموضوعات"
                  active={activeTab === 'sujets'}
                  onClick={() => setActiveTab('sujets')}
                />
              </div>
            </div>

            <div className="nav-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NavItem
                  icon={<CheckCircle color="white" strokeWidth={2} />}
                  label="إدارة المقررات"
                  active={activeTab === 'decisions'}
                  onClick={() => setActiveTab('decisions')}
                />
              </div>
            </div>

            {/* <div className="nav-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NavItem
                  icon={<FileText color="white" strokeWidth={2} />}
                  label="المقررات"
                  active={activeTab === 'decisions-full'}
                  onClick={() => setActiveTab('decisions-full')}
                />
              </div>
            </div> */}

            <div className="nav-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NavItem
                  icon={<Briefcase color="white" strokeWidth={2} />}
                  label="إدارة اللجان"
                  active={activeTab === 'comites'}
                  onClick={() => setActiveTab('comites')}
                />
              </div>
            </div>
          </nav>
        </aside>

        <main className="main">
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '76%' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#b0b0c0' }}>مرحبا</p>
                <strong style={{ color: 'white', fontSize: '16px' }}>{nomPrenom}</strong>
              </div>
            </div>

            <button className="logout-btn" onClick={logout} title="تسجيل الخروج">
              <LogOut size={20} />
            </button>
          </header>

          <div className="content">
            <Toaster />

            {loading ? (
              <div></div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <h2>لوحة تحكم المدير</h2>
                    </div>

                    {stats && (
                      <>
                        <div className="stats-grid">
                          <StatCard
                            title="موظفي الإدارة"
                            value={stats.employeeCountByDirection || 0}
                            icon={<Users size={28} />}
                            color="#69c0e2"
                          />
                          <StatCard
                            title="القرارات التابعة"
                            value={stats.decisionsByDirection || 0}
                            icon={<FileText size={28} />}
                            color="#69c0e2"
                          />
                          <StatCard
                            title="محاضر متأخرة 48س"
                            value={stats.delayedMinutes || 0}
                            icon={<AlertTriangle size={28} />}
                            color="#e26969"
                          />
                          <StatCard
                            title="أنشط عضو لجنة"
                            value={stats.mostActiveCommitteeMember?.name || 'لا يوجد'}
                            icon={<Activity size={28} />}
                            color="#69c0e2"
                          />
                        </div>

                        <div className="dashboard-widgets" style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <div className="chart-container" style={{ flex: '2', minWidth: '400px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                            <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '18px', fontWeight: '600' }}>نشاط الجلسات والإنجاز (محاضر كل شهر)</h3>
                            <div style={{ height: '300px', width: '100%', direction: 'ltr' }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.minutesPerMonth || []}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3d" vertical={false} />
                                  <XAxis dataKey="monthName" stroke="#8a8d9d" axisLine={false} tickLine={false} />
                                  <YAxis stroke="#8a8d9d" axisLine={false} tickLine={false} />
                                  <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#1a1d2d', borderColor: '#333', borderRadius: '8px', color: '#fff' }} 
                                    itemStyle={{ color: '#4B9FE3' }}
                                  />
                                  <Bar dataKey="count" name="عدد المحاضر" fill="#4B9FE3" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="rapporteur-container" style={{ flex: '1', minWidth: '300px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
                              <div style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '10px', borderRadius: '12px' }}>
                                <Award color="#FFD700" size={24} />
                              </div>
                              <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: '600' }}>مقرر الجلسات الأكثر نشاطاً</h3>
                            </div>
                            {stats.topRapporteur ? (
                              <div style={{ textAlign: 'center', marginBottom: '30px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#4B9FE3' }}>{stats.topRapporteur.name}</div>
                                <div style={{ color: '#a0a0b0', fontSize: '14px', marginTop: '6px' }}>{stats.topRapporteur.count} عضوية كمقرر</div>
                              </div>
                            ) : (
                              <p style={{ color: '#8a8d9d', textAlign: 'center', padding: '20px 0' }}>لا يوجد بيانات</p>
                            )}

                            <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FileText size={18} color="#69c0e2" />
                              إحصائيات المقررات
                            </h4>
                            <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
                              {stats.rapporteurStatsData && stats.rapporteurStatsData.length > 0 ? (
                                stats.rapporteurStatsData.map((r, index) => (
                                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '10px', marginBottom: '10px', borderLeft: '3px solid #4B9FE3' }}>
                                    <div style={{ color: '#eee', fontWeight: '500', fontSize: '15px' }}>{r.name}</div>
                                    <div style={{ textAlign: 'left', fontSize: '12px' }}>
                                      <div style={{ color: '#4B9FE3', fontWeight: '600' }}>{r.sessionCount} جلسات</div>
                                      {r.sessionCount > 1 && <div style={{ color: '#a0a0b0', marginTop: '2px' }}>تباعد {r.averageDaysSpacing} يوم</div>}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p style={{ color: '#8a8d9d', textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>لا يوجد مقررات حالياً</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'sujets' && <SujetDecisionManagement />}
                {activeTab === 'decisions' && <DecisionManagement />}
                {activeTab === 'decisions-full' && <DecisionManagement />}
                {activeTab === 'comites' && <ComitesManagement />}
              </>
            )}
          </div>
        </main>
      </div>

      {showWizard && (
        <ProcessWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            void fetchStats();
            setShowWizard(false);
          }}
        />
      )}
    </>
  );
};

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ width: '100%', marginBottom: '8px' }}
    >
      {icon}
      <span style={{ marginRight: '8px' }}>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card-container">
      <div className="stat-card-icon">{icon}</div>
      <p className="stat-card-title">{title}</p>
      <h3 className="stat-card-value">{value}</h3>
    </div>
  );
}

export default AcceuilDashboard;
