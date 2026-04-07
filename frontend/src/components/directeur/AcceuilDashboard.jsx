import React, { useState, useEffect } from 'react';
import { Users, LayoutDashboard, LogOut, ShieldCheck, Settings, Briefcase, Bell, Mail, FolderOpen, CheckCircle, Plus, FileText } from 'lucide-react';
import ComitesManagement from './ComitesManagement';
import DecisionManagement from './DecisionManagement';
import SujetDecisionManagement from './SujetDecisionManagement';
import MembreComiteManagement from './MembreComiteManagement';
import ProcessWizard from './ProcessWizard';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import '../../styles/directeur-dashboard.css';
import Toaster, { showToast } from '../common/Toaster';

const AcceuilDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [nomPrenom, setNomPrenom] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => { 
    const userName = localStorage.getItem('nomPrenom');
    if (userName && userName !== 'undefined') {
      setNomPrenom(userName);
    } else {
      setNomPrenom('مستخدم');
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_CONFIG.DIRECTEUR.DASHBOARD);
      setStats(res.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      showToast('Erreur lors du chargement des données', 'error');
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

      {/* SIDEBAR */}
      <aside className="sidebar directeur-sidebar">
        <div className="logo">
          <img src="/images/logo_mini.png" alt="Logo" />
          <span>منظومة إدارة ومتابعة الجلسات</span>
        </div>

        <nav>
          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<LayoutDashboard color="white" strokeWidth={2} />} label="🏠 لوحة التحكم" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<FileText color="white" strokeWidth={2} />} label="📝 إدارة الموضوعات" active={activeTab === 'sujets'} onClick={() => setActiveTab('sujets')} />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<CheckCircle color="white" strokeWidth={2} />} label="✓ إدارة المقررات" active={activeTab === 'decisions'} onClick={() => setActiveTab('decisions')} />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem 
                icon={<FileText color="white" strokeWidth={2} />} 
                label="📋 المقررات" 
                active={activeTab === 'decisions-full'} 
                onClick={() => setActiveTab('decisions-full')} 
              />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<Briefcase color="white" strokeWidth={2} />} label=" إدارة اللجان" active={activeTab === 'comites'} onClick={() => setActiveTab('comites')} />
            </div>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '76%' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#b0b0c0' }}>مرحبا</p>
              <strong style={{ color: 'white', fontSize: '16px' }}>{nomPrenom}</strong></div>
          </div>
          <button 
            className="logout-btn" 
            onClick={logout} 
            title="تسجيل الخروج"
          >
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>لوحة تحكم المدير</h2>
                    
                  </div>
                  {stats && (
                    <div className="stats-grid">
                      <StatCard title="إجمالي اللجان" value={stats.totalComites || 0} icon={<Briefcase size={28} />} color="#69c0e2" />
                      <StatCard title="الجلسات النشطة" value={stats.activeSessions || 0} icon={<FolderOpen size={28} />} color="#69c0e2" />
                      <StatCard title="المقررات" value={stats.pendingDecisions || 0} icon={<Bell size={28} />} color="#69c0e2" />
                      <StatCard title="اللجان المكتملة" value={stats.completedComites || 0} icon={<CheckCircle size={28} />} color="#69c0e2" />
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'stats' && <div><h2>الإحصائيات</h2></div>}
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
          fetchStats();
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

function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card-container">
      <div className="stat-card-icon">
        {icon}
      </div>
      <p className="stat-card-title">{title}</p>
      <h3 className="stat-card-value">
        {value}
      </h3>
    </div>
  );
}

export default AcceuilDashboard;
