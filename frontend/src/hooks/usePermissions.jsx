/**
 * Hook usePermissions
 * Reads the authenticated user's permissions from localStorage.
 */

import { useEffect, useState } from 'react';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedPermissions = localStorage.getItem('permissions');
      const storedRoles = localStorage.getItem('roles');

      setPermissions(storedPermissions ? JSON.parse(storedPermissions) : []);
      setRole(storedRoles ? JSON.parse(storedRoles)[0] || null : null);
    } catch (err) {
      console.error('Error reading cached permissions:', err);
      setError(err);
      setPermissions([]);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasPermission = (permission) => permissions.includes(permission);
  const hasAnyPermission = (permissionList) => permissionList.some((permission) => permissions.includes(permission));
  const hasAllPermissions = (permissionList) => permissionList.every((permission) => permissions.includes(permission));

  return {
    permissions,
    role,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

export const ProtectedComponent = ({
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) return <div>Chargement...</div>;

  let hasAccess = false;

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  } else if (requiredPermissions) {
    hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  return hasAccess ? children : fallback;
};

export default usePermissions;
