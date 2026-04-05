import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admindashboard.css';

const API_BASE = 'http://localhost:9091/api';

const LoginHistory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try { const res = await axios.get(`${API_BASE}/admin/login-history`); setItems(res.data || []); } catch (err) { console.error(err); setItems([]); }
    setLoading(false);
  };

  return (
    <div className="login-history-section" dir="rtl">
      <h2>سجل تسجيل الدخول</h2>
      <div className="table">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
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
                <th>عنوان IP</th>
                <th>التاريخ والوقت</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{it.username || it.user || '-'}</td>
                  <td>{it.ip || '-'}</td>
                  <td>{it.date || it.timestamp || '-'}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: it.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: it.success ? '#6ee7b7' : '#fca5a5'
                    }}>
                      {it.success ? '✓ نجاح' : '✗ فشل'}
                    </span>
                  </td>
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
