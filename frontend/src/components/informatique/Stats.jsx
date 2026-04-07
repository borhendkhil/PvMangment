import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';

const Stats = () => {
  const [roles, setRoles] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedStats();
  }, []);

  const fetchDetailedStats = async () => {
    try {
      const [rolesRes, employesRes] = await Promise.all([
        axios.get(API_CONFIG.ADMIN.ROLES),
        axios.get(API_CONFIG.ADMIN.EMPLOYES),
      ]);
      setRoles(rolesRes.data || []);
      setEmployes(employesRes.data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setRoles([]);
      setEmployes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>جارٍ التحميل...</div>;

  return (
    <div style={{ padding: '0' }} dir="rtl">
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>
        إحصائيات مفصلة
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <Panel title="الأدوار" value={roles.length} />
        <Panel title="الموظفون" value={employes.length} />
        <Panel title="الأدوار المعرّفة" value={roles.map((role) => role.name).join(', ') || '-'} />
      </div>
    </div>
  );
};

const Panel = ({ title, value }) => (
  <div style={{
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '18px',
    color: '#e2e8f0',
  }}>
    <div style={{ color: '#94a3b8', fontSize: '13px' }}>{title}</div>
    <div style={{ marginTop: '8px', fontSize: '22px', fontWeight: 'bold' }}>{value}</div>
  </div>
);

export default Stats;
