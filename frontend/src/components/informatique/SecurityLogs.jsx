import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../styles/admindashboard.css';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.ACTIVITY_LOGS);
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
      setLogs([]);
    }
    setLoading(false);
  };

  return (
    <div className="logs-section" dir="rtl">
      <h2>سجلات النظام الأمنية</h2>
      <div className="table">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#b0b0c0' }}>
            <p>جارٍ التحميل...</p>
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
                <th>الرسالة</th>
                <th>المستخدم</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.dateAction || '-'}</td>
                  <td>{log.action || '-'}</td>
                  <td>{log.userId || '-'}</td>
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
