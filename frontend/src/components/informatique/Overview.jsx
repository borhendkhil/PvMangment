import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, UserCheck, UserX, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../../styles/admindashboard.css';

const API_BASE = 'http://localhost:9091/api/admin';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#69c0e2' }}>⏳ جاري التحميل...</div>;
  if (!stats) return <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>❌ خطأ في تحميل البيانات</div>;

  // Prepare data for Role Distribution Pie Chart
  const roleChartData = [
    { name: 'مسؤولي المعلوماتية', value: stats.roleDistribution.admin_informatique },
    { name: 'مسؤولي الديوان', value: stats.roleDistribution.admin_cabinet },
    { name: 'المديرون', value: stats.roleDistribution.directeur },
    { name: 'موظفون عاديون', value: stats.roleDistribution.user },
  ];

  // Prepare data for User Status Bar Chart
  const userStatusData = [
    { name: 'نشطين', value: stats.enabledUsers, fill: '#2ecc71' },
    { name: 'معطلين', value: stats.disabledUsers, fill: '#e74c3c' },
    { name: 'بدون دور', value: stats.systemHealth.usersWithoutRole, fill: '#f39c12' },
  ];

  // Prepare data for Activity Line Chart
  const activityData = [
    { name: 'اليوم', نشاط: stats.activityStats.activeToday },
    { name: 'الأسبوع', نشاط: stats.activityStats.activeThisWeek },
    { name: 'غير نشط', نشاط: stats.activityStats.inactive },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="overview-container" style={{ padding: '30px 0' }} dir="rtl">
      <h2 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: 'bold', color: '#e2e8f0' }}>📊 لوحة المعلومات التفاعلية</h2>

      {/* KPI Cards Row */}
      <div className="kpi-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <KPICard 
          icon={<User size={28} />} 
          label="إجمالي المستخدمين" 
          value={stats.totalUsers} 
          bgColor="#3b82f6"
          trend="+5%"
        />
        <KPICard 
          icon={<UserCheck size={28} />} 
          label="مستخدمين نشطين" 
          value={stats.enabledUsers}
          percentage={`${stats.enabledPercentage.toFixed(1)}%`}
          bgColor="#10b981"
        />
        <KPICard 
          icon={<UserX size={28} />} 
          label="مستخدمين معطلين" 
          value={stats.disabledUsers} 
          bgColor="#e74c3c"
        />
        <KPICard 
          icon={<Users size={28} />} 
          label="إجمالي الموظفين" 
          value={stats.totalEmployes} 
          bgColor="#06b6d4"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/* Role Distribution Pie Chart */}
        <ChartCard title="📈 توزيع الأدوار في النظام">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={roleChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {roleChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid #69c0e2',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User Status Bar Chart */}
        <ChartCard title="👥 حالة المستخدمين">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={userStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#69c0e233" />
              <XAxis dataKey="name" stroke="#69c0e2" />
              <YAxis stroke="#69c0e2" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid #69c0e2',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {userStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Activity Line Chart Full Width */}
      <ChartCard title="📊 نشاط المستخدمين">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#69c0e233" />
            <XAxis dataKey="name" stroke="#69c0e2" />
            <YAxis stroke="#69c0e2" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a2e', 
                border: '1px solid #69c0e2',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="نشاط" stroke="#69c0e2" strokeWidth={3} dot={{ fill: '#327e9e', r: 6 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* System Health & Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <DetailCard icon="📍" label="عدد المديريات" value={stats.totalDirections} color="#327e9e" />
        <DetailCard icon="👨‍💼" label="موظفين مع حساب" value={stats.employesWithUser} color="#69c0e2" />
        <DetailCard icon="⚠️" label="موظفين بدون حساب" value={stats.systemHealth.employesWithoutAccount} color="#f39c12" />
        <DetailCard icon="🏛️" label="عدد اللجان" value={stats.totalComites} color="#3b82f6" />
        <DetailCard icon="👥" label="أعضاء اللجان" value={stats.totalComiteMembers} color="#8b5cf6" />
        <DetailCard icon="📈" label="معدل التغطية" value={`${stats.systemHealth.directionsCoverage}%`} color="#10b981" />
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ icon, label, value, percentage, trend, bgColor }) => (
  <div style={{
    background: `linear-gradient(135deg, ${bgColor}25 0%, ${bgColor}05 100%)`,
    border: `1.5px solid ${bgColor}40`,
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    color: '#e2e8f0'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
      <div style={{ color: bgColor, opacity: 0.85 }}>{icon}</div>
      {trend && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>{trend}</span>}
    </div>
    <p style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#94a3b8', fontWeight: '500' }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: bgColor }}>{value}</h3>
      {percentage && <span style={{ fontSize: '12px', color: '#10b981' }}>{percentage}</span>}
    </div>
  </div>
);

// Chart Card Wrapper
const ChartCard = ({ title, children }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(51, 126, 158, 0.15) 0%, rgba(105, 192, 226, 0.05) 100%)',
    border: '1.5px solid rgba(105, 192, 226, 0.25)',
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    color: '#e2e8f0'
  }}>
    <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600', color: '#69c0e2' }}>{title}</h3>
    {children}
  </div>
);

// Detail Card Component
const DetailCard = ({ icon, label, value, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
    border: `1px solid ${color}40`,
    borderRadius: '12px',
    padding: '18px',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    color: '#e2e8f0'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = `0 10px 30px ${color}30`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  }}
  >
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <p style={{ fontSize: '12px', margin: '0 0 8px 0', color: '#94a3b8' }}>{label}</p>
    <h4 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color }}>{value}</h4>
  </div>
);

export default Overview;
