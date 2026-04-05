import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admindashboard.css';
import { showToast } from '../common/Toaster';

const API_BASE = 'http://localhost:9091/api';

const AccessManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try { const res = await axios.get(`${API_BASE}/admin/access`); setItems(res.data || []); } catch (err) { console.error(err); setItems([]); }
    setLoading(false);
  };

  const toggle = async (id) => {
    try { await axios.put(`${API_BASE}/admin/access/${id}/toggle`); fetchItems(); showToast('تم تغيير حالة الوصول', 'success'); } catch (err) { console.error(err); showToast('خطأ أثناء تغيير الحالة', 'error'); }
  };

  return (
    <div dir="rtl">
      <h2>إدارة الوصول</h2>
      <div className="table">
        {loading ? 'Chargement...' : (
          <table>
            <thead><tr><th>المورد</th><th>الدور</th><th>مفعل</th><th>إجراء</th></tr></thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id}><td>{it.resource}</td><td>{it.role}</td><td>{it.allowed ? 'نعم' : 'لا'}</td>
                  <td><button className="icon-btn" onClick={() => toggle(it.id)}>{it.allowed ? 'إيقاف' : 'تفعيل'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AccessManagement;
