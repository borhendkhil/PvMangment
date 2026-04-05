# 📋 Guide Migration API - Mettre à Jour les Fichiers

## 🎯 Objectif

Remplacer `const API_BASE = 'http://localhost:9091/api'` par `import API_CONFIG from '../../config/api'`

---

## 📝 Fichiers à Mettre à Jour

### Dashboard Admin:
1. ✅ **AdminDashboard.jsx** - DÉJÀ FAIT
2. **Stats.jsx**
3. **Overview.jsx**
4. **UsersList.jsx**
5. **UserAdd.jsx**
6. **RolesManagement.jsx**
7. **DirectionsList.jsx**
8. **DirectionAdd.jsx**
9. **EmployeManagement.jsx**
10. **SecurityLogs.jsx**
11. **LoginHistory.jsx**
12. **AccessManagement.jsx**

### Composants Directeur:
13. **AcceuilDashboard.jsx**
14. **ComitesManagement.jsx**

### Composants User:
15. **Dashboard.jsx** (user)

### Composants Common:
16. **Login.jsx**

### Autres:
17. Tous les fichiers qui utilisent axios avec API

---

## 🔄 Modèle de Migration

### Étape 1: Importer la Configuration
**AVANT:**
```javascript
import axios from 'axios';
const API_BASE = 'http://localhost:9091/api';
```

**APRÈS:**
```javascript
import axios from 'axios';
import API_CONFIG from '../../config/api';
```

### Étape 2: Remplacer les URLs

**Pour Stats.jsx:**
```javascript
// AVANT
axios.get(`${API_BASE}/admin/stats/roles-detailed`)
axios.get(`${API_BASE}/admin/stats/employes`)

// APRÈS
axios.get(API_CONFIG.ADMIN.STATS_ROLES)
axios.get(API_CONFIG.ADMIN.STATS_EMPLOYES)
```

**Pour UsersList.jsx:**
```javascript
// AVANT
axios.get(`${API_BASE}/admin/users`)
axios.delete(`${API_BASE}/admin/users/${id}`)

// APRÈS
axios.get(API_CONFIG.ADMIN.USERS)
axios.delete(`${API_CONFIG.ADMIN.USERS}/${id}`)
```

**Pour RolesManagement.jsx:**
```javascript
// AVANT
axios.get(`${API_BASE}/admin/roles`)
axios.post(`${API_BASE}/admin/roles`, data)

// APRÈS
axios.get(API_CONFIG.ADMIN.ROLES)
axios.post(API_CONFIG.ADMIN.ROLES, data)
```

**Pour Login.jsx:**
```javascript
// AVANT
axios.post(`${API_BASE}/auth/login`, { email, password })

// APRÈS
axios.post(API_CONFIG.AUTH.LOGIN, { email, password })
```

---

## 📂 Chemins d'Import Selon le Dossier

### Depuis `./informatique/`:
```javascript
import API_CONFIG from '../../config/api';
```

### Depuis `./user/`:
```javascript
import API_CONFIG from '../../../config/api';
```

### Depuis `./ common/`:
```javascript
import API_CONFIG from '../../config/api';
```

### Depuis `./directeur/`:
```javascript
import API_CONFIG from '../../config/api';
```

---

## 📊 Liste Complète des Remplacements

### Stats.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/stats/roles-detailed  → API_CONFIG.ADMIN.STATS_ROLES
${API_BASE}/admin/stats/employes        → API_CONFIG.ADMIN.STATS_EMPLOYES
```

### UsersList.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/users                 → API_CONFIG.ADMIN.USERS
axios.delete(`${API_BASE}/admin/users...`) → axios.delete(`${API_CONFIG.ADMIN.USERS}...`)
```

### UserAdd.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/users                 → API_CONFIG.ADMIN.USERS
```

### RolesManagement.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/roles                 → API_CONFIG.ADMIN.ROLES
```

### DirectionsList.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/directions             → API_CONFIG.ADMIN.DIRECTIONS
```

### DirectionAdd.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/directions             → API_CONFIG.ADMIN.DIRECTIONS
```

### EmployeManagement.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/employes               → API_CONFIG.ADMIN.EMPLOYES
${API_BASE}/admin/directions             → API_CONFIG.ADMIN.DIRECTIONS
${API_BASE}/admin/users                  → API_CONFIG.ADMIN.USERS
```

### SecurityLogs.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/security-logs          → API_CONFIG.ADMIN.SECURITY_LOGS
```

### LoginHistory.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/login-history          → API_CONFIG.ADMIN.LOGIN_HISTORY
```

### AccessManagement.jsx:
```javascript
// Remplacements:
${API_BASE}/admin/access                 → API_CONFIG.ADMIN.ACCESS
```

### Login.jsx:
```javascript
// Remplacements:
${API_BASE}/auth/login                   → API_CONFIG.AUTH.LOGIN
${API_BASE}/auth/register                → API_CONFIG.AUTH.REGISTER
```

---

## ✅ Vérification

Après migration, vérifiez:

```bash
# Rechercher les occurrences restantes de "const API_BASE"
grep -r "const API_BASE" frontend/src/

# Devrait retourner vide (0 résultats)
```

---

## 📋 Checklist Migration

```
☐ AdminDashboard.jsx ✅ (FAIT)
☐ Stats.jsx
☐ Overview.jsx
☐ UsersList.jsx
☐ UserAdd.jsx
☐ RolesManagement.jsx
☐ DirectionsList.jsx
☐ DirectionAdd.jsx
☐ EmployeManagement.jsx
☐ SecurityLogs.jsx
☐ LoginHistory.jsx
☐ AccessManagement.jsx
☐ Login.jsx
☐ AcceuilDashboard.jsx
☐ ComitesManagement.jsx
☐ User/Dashboard.jsx
☐ Vérifier qu'aucune "const API_BASE" ne reste
☐ Tester l'application
```

---

## 🚀 Optimisations Supplémentaires

Après migration, vous pourrez aussi:

### 1. Créer un Service API:
```javascript
// src/services/api.js
import axios from 'axios';
import API_CONFIG from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE
});

// Interceptors pour logs, tokens, etc.
apiClient.interceptors.request.use(...)
apiClient.interceptors.response.use(...)

export default apiClient;
```

### 2. Créer des Hooks Réutilisables:
```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get(url)
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};

// Utilisation
const Stats = () => {
  const { data: stats } = useApi(API_CONFIG.ADMIN.STATS);
  // ...
};
```

---

## 📞 Aide et Questions

Si vous avez besoin d'aide pour migrer un fichier spécifique, consultez:
1. Le fichier `src/config/api.js` pour voir les endpoints disponibles
2. Ce guide pour les remplacements
3. L'exemple AdminDashboard.jsx qui est déjà migré

---

**Version:** 1.0
**Status:** En Cours
**Dernière mise à jour:** 2024
