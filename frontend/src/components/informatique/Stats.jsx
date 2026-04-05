import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Users, UserX, TrendingUp } from 'lucide-react';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';

const Stats = () => {
  const [rolesDetailed, setRolesDetailed] = useState(null);
  const [employeStats, setEmployeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roles');

  useEffect(() => {
    fetchDetailedStats();
  }, []);

  const fetchDetailedStats = async () => {
    try {
      const [rolesRes, employesRes] = await Promise.all([
        axios.get(API_CONFIG.ADMIN.STATS_ROLES),
        axios.get(API_CONFIG.ADMIN.STATS_EMPLOYES)
      ]);
      setRolesDetailed(rolesRes.data);
      setEmployeStats(employesRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '0' }} dir="rtl">
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>إحصائيات مفصلة</h2>

      {/* Tabs */}
      <div className="tab-buttons">
        <TabButton label="توزيع الأدوار" active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} icon="👥" />
        <TabButton label="الموظفون" active={activeTab === 'employes'} onClick={() => setActiveTab('employes')} icon="👔" />
        <TabButton label="التنبيهات" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} icon="⚠️" />
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && rolesDetailed && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#e2e8f0' }}>قائمة المستخدمين حسب الدور</h3>
          <div className="role-distribution">
            <RoleSection title="مسؤولي المعلوماتية 🖥️" users={rolesDetailed.admin_informatique} color="#3B82F6" />
            <RoleSection title="مسؤولي الديوان 📋" users={rolesDetailed.admin_cabinet} color="#8B5CF6" />
            <RoleSection title="المديرون 👔" users={rolesDetailed.directeur} color="#EC4899" />
            <RoleSection title="موظفون عاديون 👤" users={rolesDetailed.user} color="#10B981" />
            <RoleSection title="بدون دور ⚠️" users={rolesDetailed.sans_role} color="#F59E0B" isAlert={true} />
          </div>
        </div>
      )}

      {/* Employes Tab */}
      {activeTab === 'employes' && employeStats && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#e2e8f0' }}>إحصائيات الموظفين</h3>
          
          {/* Summary Stats */}
          <div className="employee-stats" style={{ marginBottom: '20px' }}>
            <SummaryCard label="إجمالي الموظفين" value={employeStats.withAccounts + employeStats.withoutAccounts} color="#3B82F6" />
            <SummaryCard label="مع حساب مستخدم" value={employeStats.withAccounts} color="#10B981" />
            <SummaryCard label="بدون حساب" value={employeStats.withoutAccounts} color="#F59E0B" />
          </div>

          {/* By Direction */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            backdropFilter: 'blur(15px)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}>
            <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', color: '#e2e8f0' }}>توزيع الموظفين حسب المديرية</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {Object.entries(employeStats.byDirection).map(([direction, count]) => (
                <div key={direction} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '13px',
                  transition: 'all 0.25s ease'
                }} className="hover-lift">
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#94a3b8' }}>{direction}</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#e2e8f0' }}>{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Employees Without Account */}
          {employeStats.employesWithoutAccount && employeStats.employesWithoutAccount.length > 0 && (
            <div className="alert-box warning">
              <h4 className="alert-box-title">⚠️ موظفون بدون حساب مستخدم</h4>
              <p className="alert-box-message">{employeStats.employesWithoutAccount.length} موظف بحاجة إلى حساب مستخدم</p>
              <div className="alert-box-items">
                {employeStats.employesWithoutAccount.map(emp => (
                  <div key={emp.id} className="alert-item">
                    <p className="alert-item-name">{emp.prenom} {emp.nom}</p>
                    <p className="alert-item-details">الرقم: {emp.matricule || 'غير محدد'}</p>
                    {emp.direction && <p className="alert-item-details">المديرية: {emp.direction}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && rolesDetailed && employeStats && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#e2e8f0' }}>التنبيهات والمشاكل</h3>
          
          {rolesDetailed.sans_role && rolesDetailed.sans_role.length > 0 && (
            <AlertBox
              type="warning"
              title="⚠️ مستخدمون بدون دور"
              message={`يوجد ${rolesDetailed.sans_role.length} مستخدم لم يتم تعيين دور له`}
              users={rolesDetailed.sans_role}
            />
          )}

          {employeStats.employesWithoutAccount && employeStats.employesWithoutAccount.length > 0 && (
            <AlertBox
              type="error"
              title="🔴 موظفون بدون حساب مستخدم"
              message={`يوجد ${employeStats.employesWithoutAccount.length} موظف لم يتم إنشاء حساب مستخدم له`}
              employes={employeStats.employesWithoutAccount}
            />
          )}

          {!rolesDetailed.sans_role?.length && !employeStats.employesWithoutAccount?.length && (
            <div className="alert-box success">
              <h4 className="alert-box-title">✅ لا توجد تنبيهات</h4>
              <p className="alert-box-message">جميع المستخدمين والموظفين مصنفون بشكل صحيح</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Tab Button Component
const TabButton = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick} 
    className={`tab-button ${active ? 'active' : ''}`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

// Role Section Component
const RoleSection = ({ title, users, color, isAlert }) => (
  <div className={`role-section ${isAlert ? 'alert' : ''}`} style={{
    ...(color ? { borderTopColor: color } : {})
  }}>
    <div className="role-section-title">
      <span>{title}</span>
      <span 
        className="role-section-title-count"
  
      >
        {users?.length || 0}
      </span>
    </div>
    <div className="role-user-list">
      {users && users.length > 0 ? (
        users.map(user => (
          <div key={user.id} className="role-user-item" style={{
            borderLeftColor: color || '#3B82F6'
          }}>
            <p className="role-user-name">{user.email}</p>
            <p className="role-user-email">
              {user.enabled ? '✓ نشط' : '✗ معطل'}
            </p>
          </div>
        ))
      ) : (
        <p className="no-users-message">لا يوجد مستخدمون</p>
      )}
    </div>
  </div>
);

// Summary Card Component
const SummaryCard = ({ label, value, color }) => (
  <div classic className="summary-card" style={{
    borderTopColor: color,
    borderTopWidth: '3px',
    borderTopStyle: 'solid'
  }}>
    <p className="summary-card-label">{label}</p>
    <p className="summary-card-value" style={{ color: color || '#3B82F6' }}>
      {value}
    </p>
  </div>
);

// Alert Box Component
const AlertBox = ({ type, title, message, users, employes }) => (
  <div className={`alert-box ${type}`}>
    <h4 className="alert-box-title">{title}</h4>
    <p className="alert-box-message">{message}</p>
    {users && users.length > 0 && (
      <div className="alert-box-items">
        {users.map(u => (
          <div key={u.id} className="alert-item">
            <p className="alert-item-name">{u.email}</p>
            <p className="alert-item-details">
              {u.enabled ? '✓ النشاط: مفعل' : '✗ النشاط: معطل'}
            </p>
          </div>
        ))}
      </div>
    )}
    {employes && employes.length > 0 && (
      <div className="alert-box-items">
        {employes.map(e => (
          <div key={e.id} className="alert-item">
            <p className="alert-item-name">{e.prenom} {e.nom}</p>
            <p className="alert-item-details">
              الرقم: {e.matricule || 'غير محدد'}
            </p>
            <p className="alert-item-details">
              المديرية: {e.direction || 'غير محددة'}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Stats;
