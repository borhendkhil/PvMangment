/**
 * Centralized API configuration.
 * NestJS backend exposes routes at the server root, without the old /api prefix.
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_ROOT = API_BASE.replace(/\/+$/, '');

const withRoot = (path) => `${API_ROOT}${path.startsWith('/') ? '' : '/'}${path}`;

export const API_CONFIG = {
  BASE: API_ROOT,

  AUTH: {
    LOGIN: withRoot('/auth/login'),
  },

  USERS: withRoot('/users'),
  DIRECTIONS: withRoot('/directions'),
  EMPLOYES: withRoot('/employees'),
  ROLES: withRoot('/roles'),
  PERMISSIONS: withRoot('/permissions'),
  FONCTIONS: withRoot('/fonctions'),
  EMPLOYE_FONCTIONS: withRoot('/employee-functions'),
  ACTIVITY_LOGS: withRoot('/activity-logs'),
  COMITES: withRoot('/committees'),
  COMITE_SESSIONS: withRoot('/committee-sessions'),
  COMITE_MEMBERS: withRoot('/committee-members'),
  COMITE_ROLES: withRoot('/committee-roles'),
  SUBJECTS: withRoot('/decision-subjects'),
  DECISIONS: withRoot('/decisions'),
  DECISION_PDFS: withRoot('/decision-pdfs'),

  ADMIN: {
    BASE: API_ROOT,
    USERS: withRoot('/users'),
    EMPLOYES: withRoot('/employees'),
    DIRECTIONS: withRoot('/directions'),
    ROLES: withRoot('/roles'),
    FONCTIONS: withRoot('/fonctions'),
    EMPLOYE_FONCTIONS: withRoot('/employee-functions'),
    PERMISSIONS: withRoot('/permissions'),
    ACTIVITY_LOGS: withRoot('/activity-logs'),
    COMITES: withRoot('/committees'),
    COMITE_SESSIONS: withRoot('/committee-sessions'),
    COMITE_MEMBERS: withRoot('/committee-members'),
    COMITE_ROLES: withRoot('/committee-roles'),
    SUBJECTS: withRoot('/decision-subjects'),
    DECISIONS: withRoot('/decisions'),
    DECISION_PDFS: withRoot('/decision-pdfs'),
  },

  DIRECTEUR: {
    DASHBOARD: withRoot('/committees'),
    DASHBOARD_STATS: withRoot('/dashboard/director/stats'),
    COMITES: withRoot('/committees'),
    DECISIONS_FULL: withRoot('/decisions'),
    DECISION_FULL: (id) => withRoot(`/decisions/${id}`),
    DECISION_ARTICLES: (id) => withRoot(`/decisions/${id}/articles`),
    ARTICLE: (id) => withRoot(`/articles/${id}`),
    DECISIONS_BY_COMITE: (comiteId) => withRoot(`/decisions?comiteId=${comiteId}`),
    SESSIONS: (comiteId) => withRoot(`/committee-sessions?comiteId=${comiteId}`),
    DECISIONS: (sessionId) => withRoot(`/decisions?sessionId=${sessionId}`),
    CREATE_SESSION: withRoot('/committee-sessions'),
    CREATE_DECISION: withRoot('/decisions'),
    UPDATE_SESSION: (id) => withRoot(`/committee-sessions/${id}`),
    UPDATE_DECISION: (id) => withRoot(`/decisions/${id}`),
    DELETE_SESSION: (id) => withRoot(`/committee-sessions/${id}`),
    DELETE_DECISION: (id) => withRoot(`/decisions/${id}`),
    PROCESS: {
      SUJETS: withRoot('/decision-subjects'),
      DECISIONS: withRoot('/decisions'),
      DECISIONS_FULL: withRoot('/decisions'),
      DECISION_FULL: (id) => withRoot(`/decisions/${id}`),
      DECISION_ARTICLES: (id) => withRoot(`/decisions/${id}/articles`),
      ARTICLE: (id) => withRoot(`/articles/${id}`),
      DECISIONS_BY_COMITE: (comiteId) => withRoot(`/decisions?comiteId=${comiteId}`),
      UPLOAD_FILE: (decisionId) => withRoot(`/decision-pdfs/upload/${decisionId}`),
      UPLOAD_PDF: (decisionId) => withRoot(`/decision-pdfs/upload/${decisionId}`),
      GET_PDFS: () => withRoot('/decision-pdfs'),
      DELETE_PDF: (pdfId) => withRoot(`/decision-pdfs/${pdfId}`),
      MARK_CURRENT: (id) => withRoot(`/decisions/${id}/current`),
      DELETE_DECISION: (id) => withRoot(`/decisions/${id}`),
      FILES_BASE: API_ROOT,
    },
  },

  USER: {
    PROFILE: withRoot('/users/me'),
    DASHBOARD: withRoot('/users/dashboard'),
  },

  COMITE: {
    ASSIGNED_DECISIONS: withRoot('/decisions/assigned/me'),
    ASSIGNED_SESSIONS: withRoot('/committee-sessions/assigned/me'),
    UPDATE_ASSIGNED_SESSION_REPORT: (sessionId) => withRoot(`/committee-sessions/assigned/${sessionId}/report`),
    UPDATE_ASSIGNED_DECISION_REPORT: (decisionId) => withRoot(`/decisions/assigned/${decisionId}/report`),
  },
};

export default API_CONFIG;
