import React, { useState, useEffect } from 'react';
import axios from 'axios';
import usePermissions from '../../hooks/usePermissions';
import API_CONFIG from '../../config/api';
import { showToast } from '../common/Toaster';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const { permissions, role } = usePermissions();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_CONFIG.USER.PROFILE, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      showToast('خطأ في جلب البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_CONFIG.USER.PROFILE, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfile(formData);
      setEditing(false);
      showToast('تم تحديث البيانات بنجاح', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast('خطأ في تحديث البيانات', 'error');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>جاري التحميل...</div>;
  }

  if (!profile) {
    return <div style={{ padding: '20px' }}>لم يتم العثور على البيانات</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }} dir="rtl">
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#e2e8f0'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>
          🔐 ملفي الشخصي
        </h2>

        {/* معلومات الحساب */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#cbd5e1' }}>
            معلومات الحساب
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8' }}>البريد الإلكتروني</label>
              <div style={{
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                marginTop: '5px',
                color: '#e2e8f0'
              }}>
                {profile.email}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8' }}>الاسم الكامل</label>
              <div style={{
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                marginTop: '5px',
                color: '#e2e8f0'
              }}>
                {profile.nomPrenom || 'غير محدد'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8' }}>رقم الهاتف</label>
              <div style={{
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                marginTop: '5px',
                color: '#e2e8f0'
              }}>
                {profile.telephone || 'غير محدد'}
              </div>
            </div>
          </div>
        </div>

        {/* معلومات الدور والصلاحيات */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#cbd5e1' }}>
            الدور والصلاحيات
          </h3>

          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>الدور الحالي</label>
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              borderRadius: '8px',
              marginTop: '5px',
              color: '#60a5fa',
              fontWeight: '600'
            }}>
              {getRoleLabel(role)}
            </div>
          </div>

          {permissions.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <label style={{ fontSize: '13px', color: '#94a3b8' }}>الصلاحيات</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '8px',
                marginTop: '10px'
              }}>
                {permissions.map((perm, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#6ee7b7',
                      textAlign: 'center'
                    }}
                  >
                    ✓ {getPermissionLabel(perm)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Statut du compte */}
        <div style={{
          padding: '15px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          color: '#6ee7b7',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          ✓ حسابك نشط وجاهز للاستخدام
        </div>
      </div>
    </div>
  );
};

/**
 * تحويل معرف الدور إلى تسمية عربية
 */
const getRoleLabel = (role) => {
  const labels = {
    'admin_informatique': 'مسؤول المعلوماتية',
    'admin_cabinet': 'مسؤول الديوان',
    'user': 'موظف عادي',
    'directeur': 'مدير',
  };
  return labels[role] || role || 'غير محدد';
};

/**
 * تحويل اسم الصلاحية إلى نص عربي
 */
const getPermissionLabel = (permission) => {
  const labels = {
    'CREATE_USER': 'إضافة مستخدم',
    'DELETE_USER': 'حذف مستخدم',
    'VIEW_ALL': 'عرض الكل',
    'MANAGE_COMITE': 'إدارة اللجان',
    'UPLOAD_PV': 'رفع محاضر',
    'MANAGE_USERS': 'إدارة المستخدمين',
    'MANAGE_DIRECTIONS': 'إدارة المديريات',
    'MANAGE_ROLES': 'إدارة الأدوار',
    'VIEW_SECURITY_LOGS': 'عرض سجلات الأمان',
    'VIEW_LOGIN_HISTORY': 'عرض سجل الدخول',
  };
  return labels[permission] || permission;
};

export default MyProfile;
