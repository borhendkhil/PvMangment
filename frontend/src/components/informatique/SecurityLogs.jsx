import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admindashboard.css';

const API_BASE = 'http://localhost:9091/api';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try { const res = await axios.get(`${API_BASE}/admin/logs`); setLogs(res.data || []); } catch (err) { console.error(err); setLogs([]); }
    setLoading(false);
  };

  return (
    <div className="logs-section" dir="rtl">
      <h2>سجلات النظام الأمنية</h2>
      <div className="table">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7a8a' }}>
            <p>لا توجد سجلات حالياً</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الوقت</th>
                <th>المستوى</th>
                <th>الرسالة</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i}>
                  <td>{l.timestamp || l.time || '-'}</td>
                  <td>{l.level || l.levelName || '-'}</td>
                  <td style={{maxWidth:400}}>{l.message || l.msg || JSON.stringify(l)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SecurityLogs;
