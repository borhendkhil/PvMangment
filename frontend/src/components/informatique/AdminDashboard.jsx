import React, { useState, useEffect } from 'react';
import { Users, LayoutDashboard, LogOut, ShieldCheck, Settings, Briefcase, Bell, Mail } from 'lucide-react';
import Overview from './Overview';
import Stats from './Stats';
import UsersList from './UsersList';
import UserAdd from './UserAdd';
import RolesList from './RolesList';
import RolesManagement from './RolesManagement';
import PermissionsList from './PermissionsList';
import RolePermissionsList from './RolePermissionsList';
import DirectionsList from './DirectionsList';
import EmployeesList from './EmployeesList';
import EmployeFonctionsList from './EmployeFonctionsList';
import FonctionsList from './FonctionsList';
import SecurityLogs from './SecurityLogs';
import LoginHistory from './LoginHistory';
import AccessManagement from './AccessManagement';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';

import Toaster, { showToast } from '../common/Toaster';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [nomPrenom, setNomPrenom] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState({ dashboard: true, users: true, security: true, gestion: true });

  useEffect(() => { 
    // Récupérer le nom de l'utilisateur du localStorage
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
      const res = await axios.get(API_CONFIG.ADMIN.STATS);
      setStats(res.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  

  return (
    <div className="dashboard" dir="rtl">
      
      <div className="bg-effects"></div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/images/logo_mini.png" alt="Logo" />
          <span>منظومة إدارة ومتابعة الجلسات</span>
        </div>

        <nav>
          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<LayoutDashboard color="white" strokeWidth={2} />} label="🏠 لوحة التحكم" active={activeTab === 'overview' || activeTab === 'stats'} onClick={() => setActiveTab('overview')} />
              <button className="icon-btn" aria-label="toggle" onClick={() => toggleGroup('dashboard')}>{openGroups.dashboard ? '▾' : '▸'}</button>
            </div>
            <div className={`nav-sub ${openGroups.dashboard ? '' : 'collapsed'}`}>
              <button className={`nav-item sub ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>نظرة عامة</button>
              <button className={`nav-item sub ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>إحصائيات</button>
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<Users color="white" strokeWidth={2} />} label=" المستخدمين" active={activeTab.startsWith('users') || activeTab === 'roles-list' || activeTab === 'permissions-list' || activeTab === 'role-permissions-list'} onClick={() => setActiveTab('users-list')} />
              <button className="icon-btn" aria-label="toggle" onClick={() => toggleGroup('users')}>{openGroups.users ? '▾' : '▸'}</button>
            </div>
            <div className={`nav-sub ${openGroups.users ? '' : 'collapsed'}`}>
              <button className={`nav-item sub ${activeTab === 'users-list' ? 'active' : ''}`} onClick={() => setActiveTab('users-list')}>قائمة المستخدمين</button>
              <button className={`nav-item sub ${activeTab === 'users-add' ? 'active' : ''}`} onClick={() => setActiveTab('users-add')}>إضافة مستخدم</button>
              <button className={`nav-item sub ${activeTab === 'roles-list' ? 'active' : ''}`} onClick={() => setActiveTab('roles-list')}>إدارة الأدوار</button>
              <button className={`nav-item sub ${activeTab === 'permissions-list' ? 'active' : ''}`} onClick={() => setActiveTab('permissions-list')}>إدارة الصلاحيات</button>
              <button className={`nav-item sub ${activeTab === 'role-permissions-list' ? 'active' : ''}`} onClick={() => setActiveTab('role-permissions-list')}>صلاحيات الأدوار</button>
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<ShieldCheck color="white" strokeWidth={2} />} label="الإدارات" active={activeTab === 'directions-list'} onClick={() => setActiveTab('directions-list')} />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<Briefcase color="white" strokeWidth={2} />} label=" الموظفون" active={activeTab === 'employees-list'} onClick={() => setActiveTab('employees-list')} />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<Settings color="white" strokeWidth={2} />} label="الوظائف الموكلة" active={activeTab === 'employe-fonctions-list'} onClick={() => setActiveTab('employe-fonctions-list')} />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<Settings color="white" strokeWidth={2} />} label="الوظائف" active={activeTab === 'fonctions-list'} onClick={() => setActiveTab('fonctions-list')} />
            </div>
          </div>

          <div className="nav-group">
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <NavItem icon={<Settings color="white" strokeWidth={2} />} label="الأمن" active={activeTab.startsWith('security')} onClick={() => setActiveTab('security-logs')} />
              <button className="icon-btn" aria-label="toggle" onClick={() => toggleGroup('security')}>{openGroups.security ? '▾' : '▸'}</button>
            </div>
            <div className={`nav-sub ${openGroups.security ? '' : 'collapsed'}`}>
              <button className={`nav-item sub ${activeTab === 'security-logs' ? 'active' : ''}`} onClick={() => setActiveTab('security-logs')}>سجلات النظام</button>
              <button className={`nav-item sub ${activeTab === 'login-history' ? 'active' : ''}`} onClick={() => setActiveTab('login-history')}>سجل تسجيل الدخول</button>
              <button className={`nav-item sub ${activeTab === 'access-management' ? 'active' : ''}`} onClick={() => setActiveTab('access-management')}>إدارة الوصول</button>
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
              <strong style={{ color: 'white', fontSize: '16px' }}>{nomPrenom}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px' }}>
              <Mail size={24} style={{ color: 'white' }} strokeWidth={2} />
              <span style={{ color: 'white' }}>الرسائل</span>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px' }}>
              <Bell size={24} style={{ color: 'white' }} strokeWidth={2} />
              <span style={{ color: 'white' }}>التنبيهات</span>
            </button>
            <button 
              onClick={logout}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0',
                color: '#ff6b6b', 
                fontSize: '14px', 
                transition: 'all 0.3s ease',
                padding: '8px',
                borderRadius: '8px',
                width: '40px',
                height: '40px'
              }}
              onMouseEnter={(e) => { 
                e.target.style.color = '#ff8787';
                e.target.style.background = 'rgba(255, 107, 107, 0.1)';
                e.target.style.boxShadow = '0 0 12px rgba(255, 107, 107, 0.2)';
              }}
              onMouseLeave={(e) => { 
                e.target.style.color = '#ff6b6b';
                e.target.style.background = 'none';
                e.target.style.boxShadow = 'none';
              }}
              title="تسجيل الخروج"
            >
              <LogOut size={24} strokeWidth={2} />
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <Overview />
        )}

        {activeTab === 'stats' && (
          <Stats />
        )}

        {activeTab === 'users-list' && (
          <UsersList />
        )}

        {activeTab === 'users-add' && (
          <UserAdd />
        )}

        {activeTab === 'roles-list' && (
          <RolesList />
        )}

        {activeTab === 'permissions-list' && (
          <PermissionsList />
        )}

        {activeTab === 'role-permissions-list' && (
          <RolePermissionsList />
        )}

        {activeTab === 'directions-list' && (
          <DirectionsList />
        )}

        {activeTab === 'employees-list' && (
          <EmployeesList />
        )}

        {activeTab === 'employe-fonctions-list' && (
          <EmployeFonctionsList />
        )}

        {activeTab === 'fonctions-list' && (
          <FonctionsList />
        )}

        {activeTab === 'security-logs' && (
          <SecurityLogs />
        )}

        {activeTab === 'login-history' && (
          <LoginHistory />
        )}

        {activeTab === 'access-management' && (
          <AccessManagement />
        )}
      </main>
      <Toaster />
      {/* modal handled inside UsersManagement component */}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon }) => (
  <div className="card">
    <div className="icon">{icon}</div>
    <div>
      <p>{label}</p>
      <h2>{value || 0}</h2>
    </div>
  </div>
);

export default AdminDashboard;