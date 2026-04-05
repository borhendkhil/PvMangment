import React, { useState, useEffect } from 'react';
import { Users, LayoutDashboard, LogOut, ShieldCheck, Settings, Briefcase, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import usePermissions from '../../hooks/usePermissions';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';
import Toaster, { showToast } from '../common/Toaster';

// Lazy load components - chargement à la demande
const Overview = React.lazy(() => import('./Overview'));
const Stats = React.lazy(() => import('./Stats'));
const UsersList = React.lazy(() => import('./UsersList'));
const UserAdd = React.lazy(() => import('./UserAdd'));
const RolesManagement = React.lazy(() => import('./RolesManagement'));
const DirectionsList = React.lazy(() => import('./DirectionsList'));
const DirectionAdd = React.lazy(() => import('./DirectionAdd'));
const EmployeManagement = React.lazy(() => import('./EmployeManagement'));
const SecurityLogs = React.lazy(() => import('./SecurityLogs'));
const LoginHistory = React.lazy(() => import('./LoginHistory'));
const AccessManagement = React.lazy(() => import('./AccessManagement'));
const MyProfile = React.lazy(() => import('./MyProfile'));
const ComitesManagement = React.lazy(() => import('../directeur/ComitesManagement'));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [nomPrenom] = useState(localStorage.getItem('nomPrenom') || 'المستخدم');
  const [stats, setStats] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const navigate = useNavigate();
  
  const { 
    permissions, 
    role, 
    loading: permLoading, 
    hasPermission 
  } = usePermissions();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(API_CONFIG.ADMIN.STATS);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (permLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div>جاري التحميل...</div>
      </div>
    );
  }

  // Définir les sections du menu selon les permissions
  const menuSections = [
    {
      key: 'dashboard',
      label: '🏠 لوحة التحكم',
      icon: <LayoutDashboard />,
      visible: true,
      items: [
        { key: 'overview', label: 'نظرة عامة', visible: true },
        { key: 'stats', label: 'إحصائيات', visible: hasPermission('VIEW_ALL') },
      ]
    },
    {
      key: 'users',
      label: '👥 المستخدمين',
      icon: <Users />,
      visible: hasPermission('MANAGE_USERS'),
      items: [
        { key: 'users-list', label: 'قائمة المستخدمين', visible: true },
        { key: 'users-add', label: 'إضافة مستخدم', visible: true },
        { key: 'roles', label: 'إدارة الأدوار', visible: hasPermission('MANAGE_ROLES') },
      ]
    },
    {
      key: 'directions',
      label: '🏢 المديريات',
      icon: <ShieldCheck />,
      visible: hasPermission('MANAGE_DIRECTIONS'),
      items: [
        { key: 'directions-list', label: 'قائمة المديريات', visible: true },
        { key: 'directions-add', label: 'إضافة مديرية', visible: true },
      ]
    },
    {
      key: 'employes',
      label: '👔 الموظفون',
      icon: <Briefcase />,
      visible: hasPermission('MANAGE_USERS'),
      items: [
        { key: 'employes', label: 'إدارة الموظفين', visible: true },
      ]
    },
    {
      key: 'comites',
      label: '📋 اللجان',
      icon: <Briefcase />,
      visible: hasPermission('MANAGE_COMITE'),
      items: [
        { key: 'comites', label: 'إدارة اللجان', visible: true },
      ]
    },
    {
      key: 'security',
      label: '🔒 الأمن',
      icon: <Settings />,
      visible: hasPermission('VIEW_SECURITY_LOGS') || hasPermission('VIEW_LOGIN_HISTORY'),
      items: [
        { key: 'security-logs', label: 'سجلات النظام', visible: hasPermission('VIEW_SECURITY_LOGS') },
        { key: 'login-history', label: 'سجل تسجيل الدخول', visible: hasPermission('VIEW_LOGIN_HISTORY') },
        { key: 'access-management', label: 'إدارة الوصول', visible: hasPermission('MANAGE_USERS') },
      ]
    }
  ];

  return (
    <div className="dashboard" dir="rtl">
      <div className="bg-effects"></div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <ShieldCheck />
          <span>نظام الإدارة</span>
        </div>

        <nav>
          {menuSections
            .filter(section => section.visible)
            .map(section => (
              <div key={section.key} className="nav-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <NavItem 
                    icon={section.icon} 
                    label={section.label} 
                    active={section.items.some(item => item.key === activeTab)}
                    onClick={() => {
                      const firstVisibleItem = section.items.find(item => item.visible);
                      if (firstVisibleItem) setActiveTab(firstVisibleItem.key);
                    }}
                  />
                  <button 
                    className="icon-btn" 
                    aria-label="toggle"
                    onClick={() => toggleGroup(section.key)}
                  >
                    {openGroups[section.key] ? '▾' : '▸'}
                  </button>
                </div>
                <div className={`nav-sub ${openGroups[section.key] ? '' : 'collapsed'}`}>
                  {section.items
                    .filter(item => item.visible)
                    .map(item => (
                      <button 
                        key={item.key}
                        className={`nav-item sub ${activeTab === item.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.key)}
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
              </div>
            ))}

          {/* Profil utilisateur */}
          <div className="nav-group" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ width: '100%' }}
            >
              👤 ملف شخصي
            </button>
          </div>
        </nav>

        <button className="logout" onClick={logout}>
          <LogOut /> تسجيل الخروج
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="header">
          <div className="user-box">
            <div>
              <p>مرحباً</p>
              <strong>{nomPrenom}</strong>
            </div>
          </div>

          <h1>
            {getPageTitle(activeTab)}
          </h1>
        </header>

        {/* Contenu Dynamique Sécurisé */}
        <React.Suspense fallback={<div>جاري التحميل...</div>}>
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'stats' && hasPermission('VIEW_ALL') && <Stats />}
          {activeTab === 'users-list' && hasPermission('MANAGE_USERS') && <UsersList />}
          {activeTab === 'users-add' && hasPermission('MANAGE_USERS') && <UserAdd />}
          {activeTab === 'roles' && hasPermission('MANAGE_ROLES') && <RolesManagement />}
          {activeTab === 'directions-list' && hasPermission('MANAGE_DIRECTIONS') && <DirectionsList />}
          {activeTab === 'directions-add' && hasPermission('MANAGE_DIRECTIONS') && <DirectionAdd />}
          {activeTab === 'employes' && hasPermission('MANAGE_USERS') && <EmployeManagement />}
          {activeTab === 'comites' && hasPermission('MANAGE_COMITE') && <ComitesManagement />}
          {activeTab === 'security-logs' && hasPermission('VIEW_SECURITY_LOGS') && <SecurityLogs />}
          {activeTab === 'login-history' && hasPermission('VIEW_LOGIN_HISTORY') && <LoginHistory />}
          {activeTab === 'access-management' && hasPermission('MANAGE_USERS') && <AccessManagement />}
          {activeTab === 'profile' && <MyProfile />}

          {/* Message d'accès refusé */}
          {!hasPermissionForTab(activeTab, hasPermission) && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#ef4444'
            }}>
              <h2>❌ Accès Refusé</h2>
              <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            </div>
          )}
        </React.Suspense>
      </main>
      <Toaster />
    </div>
  );
};

// Fonction utilitaire pour vérifier les permissions requis d'une page
const hasPermissionForTab = (tab, hasPermission) => {
  const tabPermissions = {
    'stats': 'VIEW_ALL',
    'users-list': 'MANAGE_USERS',
    'users-add': 'MANAGE_USERS',
    'roles': 'MANAGE_ROLES',
    'directions-list': 'MANAGE_DIRECTIONS',
    'directions-add': 'MANAGE_DIRECTIONS',
    'employes': 'MANAGE_USERS',
    'comites': 'MANAGE_COMITE',
    'security-logs': 'VIEW_SECURITY_LOGS',
    'login-history': 'VIEW_LOGIN_HISTORY',
    'access-management': 'MANAGE_USERS',
  };

  const requiredPermission = tabPermissions[tab];
  if (!requiredPermission) return true; // Pas de permission requise
  
  return hasPermission(requiredPermission);
};

// Fonction pour obtenir le titre de la page
const getPageTitle = (tab) => {
  const titles = {
    'overview': 'لوحة التحكم الرئيسية',
    'stats': 'إحصائيات مفصلة',
    'users-list': 'قائمة المستخدمين',
    'users-add': 'إضافة مستخدم جديد',
    'roles': 'إدارة الأدوار',
    'directions-list': 'قائمة المديريات',
    'directions-add': 'إضافة مديرية جديدة',
    'employes': 'إدارة الموظفين',
    'comites': 'إدارة اللجان',
    'security-logs': 'سجلات النظام',
    'login-history': 'سجل تسجيل الدخول',
    'access-management': 'إدارة الوصول',
    'profile': 'ملفي الشخصي',
  };
  return titles[tab] || 'لوحة التحكم';
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`nav-item ${active ? 'active' : ''}`}>
    {icon}
    <span>{label}</span>
  </button>
);

export default Dashboard;
