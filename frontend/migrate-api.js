#!/usr/bin/env node

/**
 * Script d'Automatisation Migration API
 * 
 * Usage:
 *   node migrate-api.js          # Affiche les fichiers à migrer
 *   node migrate-api.js --check  # Vérifier les URLs restantes
 *   node migrate-api.js --fix    # Migrer automatiquement les fichiers
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'src');
const args = process.argv.slice(2);

// Patterns à chercher
const patterns = {
  apiBase: /const\s+API_BASE\s*=\s*['"`]http:\/\/localhost:9091\/api['"`]/g,
  templateString: /\$\{API_BASE\}/g,
  directUrl: /['"`]http:\/\/localhost:9091\/api\//g,
};

// Mapping des remplacements
const replacements = {
  '/admin/stats': 'API_CONFIG.ADMIN.STATS',
  '/admin/stats/roles-detailed': 'API_CONFIG.ADMIN.STATS_ROLES',
  '/admin/stats/employes': 'API_CONFIG.ADMIN.STATS_EMPLOYES',
  '/admin/users': 'API_CONFIG.ADMIN.USERS',
  '/admin/employes': 'API_CONFIG.ADMIN.EMPLOYES',
  '/admin/directions': 'API_CONFIG.ADMIN.DIRECTIONS',
  '/admin/roles': 'API_CONFIG.ADMIN.ROLES',
  '/admin/security-logs': 'API_CONFIG.ADMIN.SECURITY_LOGS',
  '/admin/login-history': 'API_CONFIG.ADMIN.LOGIN_HISTORY',
  '/admin/access': 'API_CONFIG.ADMIN.ACCESS',
  '/auth/login': 'API_CONFIG.AUTH.LOGIN',
  '/auth/register': 'API_CONFIG.AUTH.REGISTER',
  '/auth/logout': 'API_CONFIG.AUTH.LOGOUT',
  '/auth/refresh': 'API_CONFIG.AUTH.REFRESH',
  '/directeur/dashboard': 'API_CONFIG.DIRECTEUR.DASHBOARD',
  '/directeur/comites': 'API_CONFIG.DIRECTEUR.COMITES',
  '/user/profile': 'API_CONFIG.USER.PROFILE',
  '/user/dashboard': 'API_CONFIG.USER.DASHBOARD',
};

/**
 * Trouver tous les fichiers .jsx et .js
 */
function findSourceFiles(dir) {
  let files = [];
  
  const traverse = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    entries.forEach(entry => {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        traverse(path.join(currentDir, entry.name));
      } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
        files.push(path.join(currentDir, entry.name));
      }
    });
  };
  
  traverse(dir);
  return files;
}

/**
 * Vérifier si un fichier a besoin de migration
 */
function needsMigration(content) {
  return patterns.apiBase.test(content) || 
         patterns.templateString.test(content) || 
         patterns.directUrl.test(content);
}

/**
 * Migrer un fichier
 */
function migrateFile(filePath, content) {
  let migrated = content;
  
  // 1. Ajouter l'import si absent
  if (!migrated.includes('import API_CONFIG')) {
    // Insérer après les autres imports
    const importMatch = migrated.match(/^(import\s+.*?;)/m);
    if (importMatch) {
      const lastImport = migrated.lastIndexOf('import ');
      const lastSemicolon = migrated.indexOf(';', lastImport) + 1;
      migrated = migrated.slice(0, lastSemicolon) + '\nimport API_CONFIG from \'../../config/api\';' + migrated.slice(lastSemicolon);
    }
  }
  
  // 2. Remplacer const API_BASE
  migrated = migrated.replace(
    /const\s+API_BASE\s*=\s*['"`]http:\/\/localhost:9091\/api['/"`]\s*;?\s*\n/g,
    ''
  );
  
  // 3. Remplacer ${API_BASE}
  migrated = migrated.replace(/`\$\{API_BASE\}/g, '`${API_CONFIG.BASE}');
  
  // 4. Remplacer les endpoints spécifiques
  Object.entries(replacements).forEach(([endpoint, config]) => {
    // Pattern pour template strings: `${API_BASE}/endpoint`
    migrated = migrated.replace(
      new RegExp(`\`\\\$\\{API_BASE\\}${endpoint}\``, 'g'),
      config
    );
    
    // Pattern pour strings: 'http://localhost:9091/api/endpoint'
    migrated = migrated.replace(
      new RegExp(`['"\`]http://localhost:9091/api${endpoint}['"\`]`, 'g'),
      config
    );
  });
  
  return migrated;
}

/**
 * Afficher le statut de migration
 */
function checkStatus() {
  console.log('\n🔍 Vérification du statut de migration...\n');
  
  const files = findSourceFiles(SOURCE_DIR);
  let needsMigration_count = 0;
  let migrated = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(SOURCE_DIR, file);
    
    if (needsMigration(content)) {
      console.log(`❌ ${relativePath}`);
      needsMigration_count++;
    } else {
      migrated.push(relativePath);
    }
  });
  
  console.log(`\n✅ Fichiers migrés: ${migrated.length}`);
  console.log(`❌ Fichiers à migrer: ${needsMigration_count}`);
  console.log(`Total: ${files.length}\n`);
  
  if (migrated.length > 0) {
    console.log('✅ Fichiers migrés:');
    migrated.forEach(f => console.log(`  - ${f}`));
  }
}

/**
 * Migrer tous les fichiers
 */
function migrateAll() {
  console.log('\n🚀 Migration de tous les fichiers...\n');
  
  const files = findSourceFiles(SOURCE_DIR);
  let count = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(SOURCE_DIR, file);
    
    if (needsMigration(content)) {
      const migrated = migrateFile(file, content);
      fs.writeFileSync(file, migrated, 'utf8');
      console.log(`✅ ${relativePath}`);
      count++;
    }
  });
  
  console.log(`\n✨ ${count} fichier(s) migré(s)!\n`);
}

/**
 * Afficher l'aide
 */
function showHelp() {
  console.log(`
🔧 Script Migration API

Usage:
  node migrate-api.js          # Affiche les fichiers à migrer
  node migrate-api.js --check  # Vérifier le statut (détaillé)
  node migrate-api.js --fix    # Migrer automatiquement
  node migrate-api.js --help   # Afficher cette aide

Options:
  --check    Afficher les fichiers avec URLs en dur
  --fix      Migrer automatiquement tous les fichiers
  --help     Afficher cette aide

Exemples:
  $ node migrate-api.js --check   # Voir ce qui reste à migrer
  $ node migrate-api.js --fix     # Migrer automatiquement
`);
}

// Main
const command = args[0];

if (command === '--help' || command === '-h') {
  showHelp();
} else if (command === '--check' || command === '-c') {
  checkStatus();
} else if (command === '--fix' || command === '-f') {
  migrateAll();
} else {
  checkStatus();
}
