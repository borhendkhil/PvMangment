import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';

const LoginHistory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ACTIVITY_LOGS);
      const filtered = (res.data || []).filter((item) => String(item.action || '').toLowerCase().includes('login'));
      setItems(filtered);
    } catch (err) {
      console.error(err);
      setItems([]);
    }
    setLoading(false);
  };

  return (
    <div className="login-history-section" dir="rtl">
      <h2>سجل تسجيل الدخول</h2>
      <div className="table">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جارٍ التحميل...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لا توجد سجلات دخول حالياً</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>النشاط</th>
                <th>التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.userId || '-'}</td>
                  <td>{item.action || '-'}</td>
                  <td>{item.dateAction || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LoginHistory;
