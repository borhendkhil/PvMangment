import React from 'react';
import '../../styles/admindashboard.css';

const AccessManagement = () => {
  return (
    <div dir="rtl">
      <h2>إدارة الوصول</h2>
      <div className="table">
        <div style={{ padding: '20px', color: '#b0b0c0' }}>
          لا توجد نقطة نهاية مخصصة لإدارة الوصول في NestJS حالياً. يمكنك إدارة الصلاحيات من تبويبي الأدوار والصلاحيات.
        </div>
      </div>
    </div>
  );
};

export default AccessManagement;
