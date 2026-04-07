import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { permissions, role } = usePermissions();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedRoles = localStorage.getItem('roles');
      setProfile({
        ...(storedUser ? JSON.parse(storedUser) : {}),
        roles: storedRoles ? JSON.parse(storedRoles) : [],
      });
    } catch (err) {
      console.error('Error reading profile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>جارٍ التحميل...</div>;
  }

  if (!profile) {
    return <div style={{ padding: '20px' }}>لم يتم العثور على بيانات الحساب</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }} dir="rtl">
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#e2e8f0',
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>
          🔐 ملفي الشخصي
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#cbd5e1' }}>
            معلومات الحساب
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <Info label="البريد الإلكتروني" value={profile.email || '-'} />
            <Info label="الاسم الكامل" value={profile.nomPrenom || profile.fullName || 'غير محدد'} />
            <Info label="رقم الهاتف" value={profile.telephone || 'غير محدد'} />
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#cbd5e1' }}>
            الدور والصلاحيات
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>الدور الحالي</label>
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              borderRadius: '8px',
              marginTop: '5px',
              color: '#60a5fa',
              fontWeight: '600',
            }}>
              {getRoleLabel(role || profile.roles?.[0])}
            </div>
          </div>

          {permissions.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <label style={{ fontSize: '13px', color: '#94a3b8' }}>الصلاحيات</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '8px',
                marginTop: '10px',
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
                      textAlign: 'center',
                    }}
                  >
                    ✓ {getPermissionLabel(perm)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: '15px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          color: '#6ee7b7',
          textAlign: 'center',
          fontSize: '14px',
        }}>
          ✓ حسابك نشط وجاهز للاستخدام
        </div>
      </div>
    </div>
  );
};

function Info({ label, value }) {
  return (
    <div>
      <label style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</label>
      <div style={{
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        marginTop: '5px',
        color: '#e2e8f0',
      }}>
        {value}
      </div>
    </div>
  );
}

const getRoleLabel = (roleName) => {
  const labels = {
    admin_informatique: 'مسؤول المعلوماتية',
    admin_cabinet: 'مسؤول الديوان',
    user: 'موظف عادي',
    directeur: 'مدير',
  };
  return labels[roleName] || roleName || 'غير محدد';
};

const getPermissionLabel = (permission) => {
  const labels = {
    CREATE_USER: 'إضافة مستخدم',
    DELETE_USER: 'حذف مستخدم',
    VIEW_ALL: 'عرض الكل',
    MANAGE_COMITE: 'إدارة اللجان',
    UPLOAD_PV: 'رفع محاضر',
    MANAGE_USERS: 'إدارة المستخدمين',
    MANAGE_DIRECTIONS: 'إدارة المديريات',
    MANAGE_ROLES: 'إدارة الأدوار',
    VIEW_SECURITY_LOGS: 'عرض سجلات الأمن',
    VIEW_LOGIN_HISTORY: 'عرض سجل الدخول',
  };
  return labels[permission] || permission;
};

export default MyProfile;
