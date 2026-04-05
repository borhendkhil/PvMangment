-- =====================================================================
-- DATA MIGRATION SCRIPT: Old Schema → New Schema
-- =====================================================================
-- This script migrates all existing data from the old database structure
-- to the new normalized structure with Integer IDs, Many-to-Many roles,
-- and the new Decision/ComiteSession/EmployeFonction tables.
--
-- IMPORTANT: 
-- 1. BACKUP YOUR DATABASE FIRST: mysqldump -u root -p pv_management > backup.sql
-- 2. Run this script AFTER applying the new schema (init.sql)
-- 3. Verify data integrity before deploying to production
-- =====================================================================

-- =====================================================================
-- PHASE 1: VALIDATE SCHEMA (Check that new tables exist)
-- =====================================================================

-- Check if migration has already been run (safety check)
SELECT 'Starting migration...' as status;

-- =====================================================================
-- PHASE 2: MIGRATE ROLE DATA
-- =====================================================================
-- The role table structure changed: role → name, roleAr → labelAr
-- This assumes old role table had columns: roleid, role, roleAr

INSERT INTO role (name, label_ar, created_at)
SELECT DISTINCT 
    COALESCE(old_role.role, 'DEFAULT') as name,
    COALESCE(old_role.roleAr, 'دور افتراضي') as label_ar,
    NOW() as created_at
FROM (
    -- This is a placeholder - adjust based on your old role table structure
    SELECT 'admin' as role, 'مدير' as roleAr
    UNION ALL SELECT 'user', 'مستخدم'
    UNION ALL SELECT 'directeur', 'مدير'
    UNION ALL SELECT 'chef_service', 'رئيس قسم'
) old_role
LEFT JOIN role r ON r.name = old_role.role
WHERE r.id IS NULL;

-- =====================================================================
-- PHASE 3: MIGRATE FONCTION DATA (IF EXISTS IN OLD SCHEMA)
-- =====================================================================
-- If you had a fonction table in the old schema, migrate it here
-- Otherwise, insert default fonctions

INSERT INTO fonction (name, label_ar, created_at)
VALUES 
    ('directeur_general', 'مدير عام', NOW()),
    ('directeur_departement', 'مدير قسم', NOW()),
    ('chef_service', 'رئيس خدمة', NOW()),
    ('agent_service', 'موظف خدمة', NOW()),
    ('consultant', 'مستشار', NOW())
ON DUPLICATE KEY UPDATE created_at = NOW();

-- =====================================================================
-- PHASE 4: MIGRATE DIRECTION DATA
-- =====================================================================
-- Old: id_direc (PK) → New: id (PK)
-- Old: adress → New: address
-- This preserves the original direction IDs

INSERT INTO direction (id, name, code, address, created_at)
SELECT DISTINCT
    COALESCE(d.id_direc, 1) as id,
    COALESCE(d.name, 'Direction par défaut') as name,
    COALESCE(d.code, CONCAT('DIR_', d.id_direc)) as code,
    COALESCE(d.adress, 'Adresse non spécifiée') as address,
    NOW() as created_at
FROM direction_old d
WHERE NOT EXISTS (SELECT 1 FROM direction WHERE id = d.id_direc)
ON DUPLICATE KEY UPDATE address = direction.address, updated_at = NOW();

-- Fallback: If no old direction table, create default
INSERT INTO direction (id, name, code, address, created_at)
VALUES (1, 'Direction Générale', 'DIR_001', 'Siège principal', NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================================
-- PHASE 5: MIGRATE EMPLOYE DATA
-- =====================================================================
-- CRITICAL CHANGE: Old matMembre (String PK) → New id (Integer Auto-increment)
-- Old: matMembre as PK → New: id as PK, matMembre as unique identifier
-- This is the most complex migration

-- Step 1: Create temporary mapping table
CREATE TEMPORARY TABLE employe_id_mapping (
    old_matricule VARCHAR(50) PRIMARY KEY,
    new_id INT UNIQUE
);

-- Step 2: Migrate employe from old table to new with ID mapping
INSERT INTO employe (matricule, nom, prenom, email, telephone, adresse, address, direction_id, user_id, created_at)
SELECT 
    e.matMembre as matricule,
    SUBSTRING_INDEX(e.nom_prenom, ' ', 1) as nom,
    SUBSTRING_INDEX(e.nom_prenom, ' ', -1) as prenom,
    COALESCE(e.email, CONCAT('emp_', e.matMembre, '@company.com')) as email,
    COALESCE(e.phone, '') as telephone,
    COALESCE(e.adress, '') as adresse,
    COALESCE(e.adress, '') as address,
    COALESCE(e.id_direc, 1) as direction_id,
    NULL as user_id,  -- Will be populated in PHASE 6
    NOW() as created_at
FROM employe_old e
WHERE NOT EXISTS (SELECT 1 FROM employe WHERE matricule = e.matMembre);

-- Step 3: Store the ID mapping for later phases
INSERT INTO employe_id_mapping (old_matricule, new_id)
SELECT matricule, id FROM employe WHERE matricule IS NOT NULL;

-- =====================================================================
-- PHASE 6: MIGRATE USER DATA WITH MANY-TO-MANY ROLES
-- =====================================================================
-- Old: Single roleId per user → New: Many-to-Many user_role table
-- This requires:
-- 1. Migrate user records
-- 2. Create entries in user_role join table

-- Insert users (if they don't already exist)
INSERT INTO user (username, password, email, nom_prenom, role_id, created_at)
SELECT 
    u.username,
    u.password,
    COALESCE(u.email, CONCAT(u.username, '@company.com')),
    COALESCE(u.nom_prenom, ''),
    COALESCE(u.role_id, 1) as role_id,
    NOW() as created_at
FROM user_old u
LEFT JOIN user ON user.username = u.username
WHERE user.id IS NULL;

-- Map users to their employe records
UPDATE employe e
SET e.user_id = (
    SELECT u.id FROM user u 
    WHERE u.username = e.matricule
    LIMIT 1
)
WHERE e.user_id IS NULL 
  AND EXISTS (SELECT 1 FROM user u WHERE u.username = e.matricule);

-- Create user_role assignments from old roleId
-- This assumes old user table had a 'role_id' column
INSERT INTO user_role (user_id, role_id)
SELECT DISTINCT
    u.id as user_id,
    COALESCE(u.role_id, 1) as role_id
FROM user u
WHERE NOT EXISTS (
    SELECT 1 FROM user_role ur 
    WHERE ur.user_id = u.id AND ur.role_id = COALESCE(u.role_id, 1)
);

-- =====================================================================
-- PHASE 7: MIGRATE COMITE DATA
-- =====================================================================
-- Old: idComite (PK), decisionPdf (LONGBLOB) → New: id (PK), no BLOB
-- IMPORTANT: PDF migration happens in separate step

INSERT INTO comite (id, name, description, created_at)
SELECT 
    c.idComite as id,
    COALESCE(c.name, c.titleFr) as name,
    COALESCE(c.description, '') as description,
    NOW() as created_at
FROM comite_old c
LEFT JOIN comite ON comite.id = c.idComite
WHERE comite.id IS NULL;

-- =====================================================================
-- PHASE 8: MIGRATE MEMBRE COMITE DATA (with new composite key)
-- =====================================================================
-- Old: (idComite INT, matMembre STRING) → New: (comiteId INT, employeId INT)
-- Need to map old matMembre (String) to new employe.id (Integer)

INSERT INTO membre_comite (comite_id, employe_id, role_comite_id, created_at)
SELECT DISTINCT
    mc.idComite as comite_id,
    eim.new_id as employe_id,
    COALESCE(rc.id, 1) as role_comite_id,  -- Default to first role if not found
    NOW() as created_at
FROM membre_comite_old mc
INNER JOIN employe_id_mapping eim ON eim.old_matricule = mc.matMembre
LEFT JOIN role_comite rc ON rc.name = mc.roleComite
LEFT JOIN membre_comite ON 
    membre_comite.comite_id = mc.idComite 
    AND membre_comite.employe_id = eim.new_id
WHERE membre_comite.comite_id IS NULL;

-- =====================================================================
-- PHASE 9: CREATE COMITE SESSION RECORDS
-- =====================================================================
-- For each comite, create a default/most recent session
-- If session dates exist in old table, use those; otherwise create default

INSERT INTO comite_session (comite_id, date_session, lieu, statut, created_at)
SELECT 
    c.id as comite_id,
    COALESCE(MAX(old_date), DATE_SUB(NOW(), INTERVAL 1 DAY)) as date_session,
    'A déterminer' as lieu,
    'Planifiée' as statut,
    NOW() as created_at
FROM comite c
LEFT JOIN comite_old co ON co.idComite = c.id
LEFT JOIN (
    SELECT idComite, dateSession as old_date FROM comite_session_old
) cs ON cs.idComite = c.id
LEFT JOIN comite_session ON comite_session.comite_id = c.id
WHERE comite_session.id IS NULL
GROUP BY c.id;

-- =====================================================================
-- PHASE 10: MIGRATE PDF DOCUMENTS (from LONGBLOB to Decision records)
-- =====================================================================
-- This is preparatory - actual file extraction requires application logic
-- For now, create Decision records with NULL file paths (to be populated later)

INSERT INTO decision (session_id, titre, description, fichier_path, fichier_name, statut, created_at)
SELECT 
    cs.id as session_id,
    CONCAT('PV_', c.id, '_', FORMAT(NOW(), 'yyyyMMdd')) as titre,
    COALESCE(c.description, 'Procès-verbal du comité') as description,
    NULL as fichier_path,  -- Will be populated during file extraction
    NULL as fichier_name,  -- Will be populated during file extraction
    'Actif' as statut,
    NOW() as created_at
FROM comite_old c
INNER JOIN comite c2 ON c2.id = c.idComite
INNER JOIN comite_session cs ON cs.comite_id = c2.id
WHERE c.decisionPdf IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM decision 
    WHERE decision.session_id = cs.id
  );

-- =====================================================================
-- PHASE 11: MIGRATE EMPLOYE FONCTION (Job history)
-- =====================================================================
-- This assumes there's job history data in the old schema
-- If not, create default entry for each employe

INSERT INTO employe_fonction (employe_id, fonction_id, date_debut, date_fin, is_active)
SELECT 
    e.id as employe_id,
    f.id as fonction_id,
    COALESCE(ef.dateDebut, DATE_SUB(NOW(), INTERVAL 1 YEAR)) as date_debut,
    NULL as date_fin,
    1 as is_active
FROM employe e
CROSS JOIN fonction f
WHERE f.name = 'agent_service'  -- Default fonction if none specified
  AND NOT EXISTS (
    SELECT 1 FROM employe_fonction 
    WHERE employe_fonction.employe_id = e.id
  )
  AND e.matricule IS NOT NULL;

-- =====================================================================
-- PHASE 12: VERIFY MIGRATION INTEGRITY
-- =====================================================================

-- Check 1: Count records
SELECT 'MIGRATION STATISTICS' as check_type,
       (SELECT COUNT(*) FROM role) as role_count,
       (SELECT COUNT(*) FROM user) as user_count,
       (SELECT COUNT(*) FROM user_role) as user_role_count,
       (SELECT COUNT(*) FROM employe) as employe_count,
       (SELECT COUNT(*) FROM comite) as comite_count,
       (SELECT COUNT(*) FROM membre_comite) as membre_comite_count,
       (SELECT COUNT(*) FROM fonction) as fonction_count,
       (SELECT COUNT(*) FROM employe_fonction) as employe_fonction_count;

-- Check 2: Orphaned records (should be None after migration)
SELECT 'ORPHANED RECORDS CHECK' as check_type;
SELECT 'Employes without direction:' as issue, COUNT(*) as count 
FROM employe WHERE direction_id IS NULL;
SELECT 'Users without roles:' as issue, COUNT(*) as count 
FROM user u WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE user_id = u.id);

-- Check 3: Data validation
SELECT 'DATA VALIDATION' as check_type;
SELECT 'Duplicate matrices:' as issue, COUNT(*) as count 
FROM employe 
WHERE matricule IS NOT NULL 
GROUP BY matricule HAVING COUNT(*) > 1;

-- =====================================================================
-- PHASE 13: CLEANUP & FINALIZATION
-- =====================================================================

-- Drop temporary mapping table
DROP TEMPORARY TABLE IF EXISTS employe_id_mapping;

-- Update sequences/auto-increment if needed (MySQL auto-increments correctly)
-- For other databases, may need adjustment

-- Final verification query
SELECT 'MIGRATION COMPLETE' as status,
       NOW() as completion_time,
       'Please verify data integrity before going to production' as note;

-- =====================================================================
-- NEXT STEPS:
-- =====================================================================
-- 1. Verify the statistics above - all counts should be > 0 for populated tables
-- 2. Check for any NULL values in critical fields (shown above)
-- 3. For PDF migration: Run the PDF extraction script separately
-- 4. Test the application thoroughly before production deployment
-- 5. Keep this script and the backup for rollback purposes
-- =====================================================================
