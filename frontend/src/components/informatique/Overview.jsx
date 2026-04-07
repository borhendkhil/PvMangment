import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, employesRes, directionsRes, rolesRes, committeesRes, decisionsRes, logsRes] = await Promise.all([
        axios.get(API_CONFIG.ADMIN.USERS),
        axios.get(API_CONFIG.ADMIN.EMPLOYES),
        axios.get(API_CONFIG.ADMIN.DIRECTIONS),
        axios.get(API_CONFIG.ADMIN.ROLES),
        axios.get(API_CONFIG.ADMIN.COMITES),
        axios.get(API_CONFIG.ADMIN.DECISIONS),
        axios.get(API_CONFIG.ADMIN.ACTIVITY_LOGS),
      ]);

      const users = usersRes.data || [];
      const employes = employesRes.data || [];
      const directions = directionsRes.data || [];
      const roles = rolesRes.data || [];
      const committees = committeesRes.data || [];
      const decisions = decisionsRes.data || [];
      const logs = logsRes.data || [];

      setStats({
        totalUsers: users.length,
        totalEmployes: employes.length,
        totalDirections: directions.length,
        totalRoles: roles.length,
        totalComites: committees.length,
        totalDecisions: decisions.length,
        totalLogs: logs.length,
        enabledUsers: users.filter((user) => user.enabled).length,
        disabledUsers: users.filter((user) => !user.enabled).length,
      });
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#69c0e2' }}>جارٍ التحميل...</div>;
  }

  if (!stats) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>خطأ في تحميل البيانات</div>;
  }

  return (
    <div className="overview-container" style={{ padding: '30px 0' }} dir="rtl">
      <h2 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: 'bold', color: '#e2e8f0' }}>
        لوحة المعلومات التفاعلية
      </h2>

      <div className="kpi-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <Card label="إجمالي المستخدمين" value={stats.totalUsers} />
        <Card label="إجمالي الموظفين" value={stats.totalEmployes} />
        <Card label="إجمالي المديريات" value={stats.totalDirections} />
        <Card label="إجمالي الأدوار" value={stats.totalRoles} />
        <Card label="إجمالي اللجان" value={stats.totalComites} />
        <Card label="إجمالي المقررات" value={stats.totalDecisions} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <InfoCard title="حالة الحسابات" rows={[
          ['النشطة', stats.enabledUsers],
          ['المعطلة', stats.disabledUsers],
        ]} />
        <InfoCard title="سجل النظام" rows={[
          ['إجمالي السجلات', stats.totalLogs],
        ]} />
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(51, 126, 158, 0.15) 0%, rgba(105, 192, 226, 0.05) 100%)',
    border: '1.5px solid rgba(105, 192, 226, 0.25)',
    borderRadius: '16px',
    padding: '24px',
    color: '#e2e8f0',
  }}>
    <p style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#94a3b8' }}>{label}</p>
    <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#69c0e2' }}>{value}</h3>
  </div>
);

const InfoCard = ({ title, rows }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#e2e8f0',
  }}>
    <h3 style={{ marginTop: 0 }}>{title}</h3>
    <div style={{ display: 'grid', gap: '10px' }}>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: '#94a3b8' }}>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  </div>
);

export default Overview;
