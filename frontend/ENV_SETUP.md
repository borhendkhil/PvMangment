# 🔧 Guide Configuration API - Variables d'Environnement

## 📋 Vue d'ensemble

Au lieu de répéter l'URL API dans chaque fichier, vous avez maintenant une **configuration centralisée** qui se change **en une seule ligne**.

---

## 📁 Structure des Fichiers

```
frontend/
├── .env                  ← Configuration (à changer lors du déploiement)
├── .env.example         ← Template (pour documentation)
└── src/
    ├── config/
    │   └── api.js       ← Configuration centralisée des APIs
    └── components/
        └── informatique/
            └── AdminDashboard.jsx (utilisations de la config)
```

---

## ⚙️ Fichier `.env`

### Development (Localhost):
```env
REACT_APP_API_BASE=http://localhost:9091/api
```

### Production (Serveur):
```env
REACT_APP_API_BASE=https://api.example.com/api
```

### Staging (Test):
```env
REACT_APP_API_BASE=https://staging-api.example.com/api
```

---

## 💡 Comment Utiliser

### Avant (❌ Ancien Système):
```javascript
// Dans AdminDashboard.jsx
const API_BASE = 'http://localhost:9091/api';

// Dans Stats.jsx
const API_BASE = 'http://localhost:9091/api';

// Dans UsersList.jsx
const API_BASE = 'http://localhost:9091/api';

// ❌ Si on change de serveur, changer 50+ lignes dans 20+ fichiers
```

### Après (✅ Nouveau Système):
```javascript
// Dans n'importe quel composant
import API_CONFIG from '../../config/api';

// Utiliser directement
axios.get(API_CONFIG.ADMIN.STATS)
axios.get(API_CONFIG.ADMIN.USERS)
axios.get(API_CONFIG.AUTH.LOGIN)

// ✅ Si on change de serveur, changer 1 ligne dans .env
```

---

## 🎯 Endpoints Disponibles

### Admin Endpoints:
```javascript
API_CONFIG.ADMIN.STATS              // GET /admin/stats
API_CONFIG.ADMIN.STATS_ROLES        // GET /admin/stats/roles-detailed
API_CONFIG.ADMIN.STATS_EMPLOYES     // GET /admin/stats/employes
API_CONFIG.ADMIN.USERS              // GET /admin/users
API_CONFIG.ADMIN.EMPLOYES           // GET /admin/employes
API_CONFIG.ADMIN.DIRECTIONS         // GET /admin/directions
API_CONFIG.ADMIN.ROLES              // GET /admin/roles
API_CONFIG.ADMIN.SECURITY_LOGS      // GET /admin/security-logs
API_CONFIG.ADMIN.LOGIN_HISTORY      // GET /admin/login-history
API_CONFIG.ADMIN.ACCESS             // GET /admin/access
```

### Auth Endpoints:
```javascript
API_CONFIG.AUTH.LOGIN               // POST /auth/login
API_CONFIG.AUTH.REGISTER            // POST /auth/register
API_CONFIG.AUTH.LOGOUT              // POST /auth/logout
API_CONFIG.AUTH.REFRESH             // POST /auth/refresh
```

### Directeur Endpoints:
```javascript
API_CONFIG.DIRECTEUR.DASHBOARD      // GET /directeur/dashboard
API_CONFIG.DIRECTEUR.COMITES        // GET /directeur/comites
```

### User Endpoints:
```javascript
API_CONFIG.USER.PROFILE             // GET /user/profile
API_CONFIG.USER.DASHBOARD           // GET /user/dashboard
```

---

## 📝 Exemples d'Utilisation

### Exemple 1: AdminDashboard.jsx
```javascript
import axios from 'axios';
import API_CONFIG from '../../config/api';

const AdminDashboard = () => {
  const fetchStats = async () => {
    const res = await axios.get(API_CONFIG.ADMIN.STATS);
    setStats(res.data);
  };
};
```

### Exemple 2: Stats.jsx
```javascript
import axios from 'axios';
import API_CONFIG from '../../config/api';

const Stats = () => {
  const fetchDetailedStats = async () => {
    const [rolesRes, employesRes] = await Promise.all([
      axios.get(API_CONFIG.ADMIN.STATS_ROLES),
      axios.get(API_CONFIG.ADMIN.STATS_EMPLOYES)
    ]);
    // ...
  };
};
```

### Exemple 3: Login.jsx
```javascript
import axios from 'axios';
import API_CONFIG from '../../config/api';

const handleLogin = async (email, password) => {
  const res = await axios.post(API_CONFIG.AUTH.LOGIN, {
    email,
    password
  });
  // ...
};
```

---

## 🚀 Déploiement

### Pour Serveur Production:

1. **Mettre à jour .env:**
```env
REACT_APP_API_BASE=https://api.votre-domaine.com/api
```

2. **Build le projet:**
```bash
npm run build
```

3. **Déployer:**
```bash
# Les variables d'environnement sont compilées dans le build
# Aucun change de code nécessaire
```

---

## 📦 Ajouter de Nouveaux Endpoints

Si vous devez ajouter un nouvel endpoint, modifiez `src/config/api.js`:

```javascript
// AVANT
export const API_CONFIG = {
  BASE: API_BASE,
  ADMIN: {
    STATS: `${API_BASE}/admin/stats`,
    // ...
  },
};

// APRÈS
export const API_CONFIG = {
  BASE: API_BASE,
  ADMIN: {
    STATS: `${API_BASE}/admin/stats`,
    REPORTS: `${API_BASE}/admin/reports`,  // ← Nouveau
    // ...
  },
};

// Utiliser dans le composant
axios.get(API_CONFIG.ADMIN.REPORTS)
```

---

## ✅ Migration Checklist

Pour mettre à jour vos composants existants:

```
Files à mettre à jour:
☐ AdminDashboard.jsx
☐ Stats.jsx
☐ UsersList.jsx
☐ UserAdd.jsx
☐ RolesManagement.jsx
☐ DirectionsList.jsx
☐ DirectionAdd.jsx
☐ EmployeManagement.jsx
☐ SecurityLogs.jsx
☐ LoginHistory.jsx
☐ AccessManagement.jsx
☐ Overview.jsx
☐ Login.jsx
☐ ComiteController (Directeur)
☐ AcceuilDashboard.jsx (Directeur)
```

### Template de Migration:
```javascript
// AVANT
const API_BASE = 'http://localhost:9091/api';
axios.get(`${API_BASE}/admin/stats`)

// APRÈS
import API_CONFIG from '../../config/api';
axios.get(API_CONFIG.ADMIN.STATS)
```

---

## 🔐 Sécurité

### Important:
- ✅ `.env` contient les variables d'environnement sensibles
- ✅ `.env` est dans `.gitignore` (ne pas commiter)
- ✅ `.env.example` est commité (pour documentation)
- ✅ Les variables `REACT_APP_` sont visibles dans le build (c'est normal)

### .gitignore Structure:
```
.env
.env.local
.env.*.local
```

---

## 📋 Variables Disponibles

```
Development (localhost):
  REACT_APP_API_BASE=http://localhost:9091/api

Staging:
  REACT_APP_API_BASE=https://staging-api.example.com/api

Production:
  REACT_APP_API_BASE=https://api.example.com/api
```

---

## 🔄 Avantages

| Avant | Après |
|-------|-------|
| ❌ URL répétée 50+ fois | ✅ URL définie 1 seule fois |
| ❌ Changer 20+ fichiers pour déployer | ✅ Changer 1 ligne (.env) |
| ❌ Risque d'incohérence | ✅ Configuration centralisée |
| ❌ Difficile à maintenir | ✅ Facile à maintenir |
| ❌ Endpoints non organiiés | ✅ Endpoints bien organisés par groupe |

---

## 📞 Support

Pour ajouter un nouvel endpoint:
1. Ouvrir `src/config/api.js`
2. Ajouter la nouvelle ligne dans la section appropriée
3. Utiliser dans vos composants

Exemple:
```javascript
// Dans api.js
ADMIN: {
  STATS: `${API_BASE}/admin/stats`,
  NEW_ENDPOINT: `${API_BASE}/admin/new-endpoint`,  // ← Ajout
}

// Dans composant
axios.get(API_CONFIG.ADMIN.NEW_ENDPOINT)
```

---

**Version:** 1.0
**Status:** ✅ Production Ready
**Dernière mise à jour:** 2024
