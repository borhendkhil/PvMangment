/**
 * Configuration API Centralisée
 * Utilise les variables d'environnement depuis .env
 * Avec Vite: utiliser import.meta.env avec préfixe VITE_
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:9091/api';

export const API_CONFIG = {
  BASE: API_BASE,
  
  // Endpoints Admin
  ADMIN: {
    STATS: `${API_BASE}/admin/stats`,
    STATS_ROLES: `${API_BASE}/admin/stats/roles-detailed`,
    STATS_EMPLOYES: `${API_BASE}/admin/stats/employes`,
    USERS: `${API_BASE}/admin/users`,
    EMPLOYES: `${API_BASE}/admin/employes`,
    DIRECTIONS: `${API_BASE}/admin/directions`,
    ROLES: `${API_BASE}/admin/roles`,
    FONCTIONS: `${API_BASE}/admin/fonctions`,
    EMPLOYE_FONCTIONS: `${API_BASE}/admin/employe-fonctions`,
    PERMISSIONS: `${API_BASE}/admin/permissions`,
    ROLE_PERMISSIONS: `${API_BASE}/admin/role-permissions`,
    SECURITY_LOGS: `${API_BASE}/admin/security-logs`,
    LOGIN_HISTORY: `${API_BASE}/admin/login-history`,
    ACCESS: `${API_BASE}/admin/access`,
  },
  
  // Endpoints Auth
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    LOGOUT: `${API_BASE}/auth/logout`,
    REFRESH: `${API_BASE}/auth/refresh`,
  },
  
  // Endpoints Directeur
  DIRECTEUR: {
    DASHBOARD: `${API_BASE}/directeur/dashboard`,
    COMITES: `${API_BASE}/directeur/comites`,
    SESSIONS: (comiteId) => `${API_BASE}/directeur/comites/${comiteId}/sessions`,
    DECISIONS: (sessionId) => `${API_BASE}/directeur/sessions/${sessionId}/decisions`,
    CREATE_SESSION: `${API_BASE}/directeur/sessions`,
    CREATE_DECISION: `${API_BASE}/directeur/decisions`,
    UPDATE_SESSION: (id) => `${API_BASE}/directeur/sessions/${id}`,
    UPDATE_DECISION: (id) => `${API_BASE}/directeur/decisions/${id}`,
    DELETE_SESSION: (id) => `${API_BASE}/directeur/sessions/${id}`,
    DELETE_DECISION: (id) => `${API_BASE}/directeur/decisions/${id}`,
    
    // Endpoints Processus Complet
    PROCESS: {
      SUJETS: `${API_BASE}/directeur/process/sujets`,
      DECISIONS: `${API_BASE}/directeur/process/decisions`,
      UPLOAD_PDF: (decisionId) => `${API_BASE}/directeur/process/decisions/${decisionId}/upload-pdf`,
      GET_PDFS: (decisionId) => `${API_BASE}/directeur/process/decisions/${decisionId}/pdfs`,
      DELETE_PDF: (pdfId) => `${API_BASE}/directeur/process/pdfs/${pdfId}`,
      MARK_CURRENT: (id) => `${API_BASE}/directeur/process/decisions/${id}/current`,
    }
  },
  
  // Endpoints User
  USER: {
    PROFILE: `${API_BASE}/user/profile`,
    DASHBOARD: `${API_BASE}/user/dashboard`,
  },
};

export default API_CONFIG;
