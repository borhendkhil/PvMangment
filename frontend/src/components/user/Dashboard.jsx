import React from 'react';
import '../../styles/admindashboard.css';

const UserDashboard = () => {
  return (
    <div className="main" dir="rtl">
      <div className="header">
        <div>
          <p>مرحباً</p>
          <strong>{localStorage.getItem('nomPrenom') || 'المستخدم'}</strong>
        </div>
        <h1>لوحة التحكم</h1>
      </div>

      <div className="card">
        <h3>استقبال المستخدم</h3>
        <p>هذه صفحة مخصصة للعضو — أضف هنا المعلومات والأدوات التي يحتاجها.</p>
      </div>
    </div>
  );
};

export default UserDashboard;
