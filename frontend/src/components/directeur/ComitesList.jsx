import React from 'react';
import ComitesManagement from './ComitesManagement';

const ComitesList = () => {
  return (
    <div style={{ padding: '32px 0px ' }} dir="rtl">
      <div className="section-header">
        <h2>قائمة اللجان</h2>
      </div>
      <ComitesManagement />
    </div>
  );
};

export default ComitesList;
