#!/bin/bash

# Script pour trouver tous les fichiers avec des URLs API en dur
# Utilisation: bash find_api_urls.sh

echo "🔍 Recherche des URLs API en dur..."
echo "===================================="
echo ""

# Rechercher les patterns courants d'URLs en dur
echo "📍 Fichiers avec 'http://localhost:9091':"
grep -r "http://localhost:9091" src/ --include="*.jsx" --include="*.js" 2>/dev/null || echo "✅ Aucun trouvé"

echo ""
echo "📍 Fichiers avec 'const API_BASE':"
grep -r "const API_BASE" src/ --include="*.jsx" --include="*.js" 2>/dev/null || echo "✅ Aucun trouvé"

echo ""
echo "📍 Fichiers avec template strings d'API (\`\${API_BASE):"
grep -r '\${API_BASE' src/ --include="*.jsx" --include="*.js" 2>/dev/null | head -20 || echo "✅ Aucun trouvé (ou tous migrés)"

echo ""
echo "✅ Résumé:"
echo "- AdminDashboard.jsx: ✅ MIGRÉ"
echo "- Stats.jsx: ✅ MIGRÉ"
echo "- Login.jsx: ✅ MIGRÉ"
echo ""
echo "À faire:"
echo "- UsersList.jsx"
echo "- UserAdd.jsx"
echo "- RolesManagement.jsx"
echo "- DirectionsList.jsx"
echo "- DirectionAdd.jsx"
echo "- EmployeManagement.jsx"
echo "- SecurityLogs.jsx"
echo "- LoginHistory.jsx"
echo "- AccessManagement.jsx"
echo "- Overview.jsx"
echo "- Et tous les autres composants qui utilisent axios"
