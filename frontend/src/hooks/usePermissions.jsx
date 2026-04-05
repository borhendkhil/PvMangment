/**
 * Hook usePermissions
 * Vérifier les permissions de l'utilisateur connecté
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const roleId = localStorage.getItem('roleId');
        
        if (!token || !roleId) {
          setPermissions([]);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_CONFIG.ADMIN.BASE}/permissions/${roleId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setPermissions(response.data.permissions || []);
        setRole(response.data.role || null);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  /**
   * Vérifier si l'utilisateur a une permission spécifique
   */
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  /**
   * Vérifier si l'utilisateur a au moins une permission parmi plusieurs
   */
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(p => permissions.includes(p));
  };

  /**
   * Vérifier si l'utilisateur a toutes les permissions
   */
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(p => permissions.includes(p));
  };

  return {
    permissions,
    role,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};

/**
 * Composant ProtectedComponent
 * Affiche un composant seulement si l'utilisateur a la permission
 */
export const ProtectedComponent = ({ 
  requiredPermission, 
  requiredPermissions,
  requireAll = false,
  children,
  fallback = null 
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
