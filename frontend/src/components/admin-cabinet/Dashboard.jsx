import React from 'react';
import '../../styles/admindashboard.css';

const AdminCabinetDashboard = () => {
  return (
    <div className="main" dir="rtl">
      <div className="header">
        <div>
          <p>مرحباً</p>
          <strong>{localStorage.getItem('nomPrenom') || 'المسؤول'}</strong>
        </div>
        <h1>لوحة اختصاص المكتب الخاص</h1>
      </div>

      <div className="card">
        <h3>استقبال مسؤول الديوان</h3>
        <p>هذه صفحة مخصصة لمسؤول الديوان — أضف هنا الأدوات والتقارير المطلوبة.</p>
      </div>
    </div>
  );
};

export default AdminCabinetDashboard;
