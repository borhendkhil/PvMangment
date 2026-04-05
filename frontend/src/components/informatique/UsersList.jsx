import React from 'react';
import UsersManagement from './UsersManagement';

const UsersList = () => {
  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة المستخدمين</h2>
      </div>
      <UsersManagement />
    </div>
  );
};

export default UsersList;
