-- =====================================================
-- ADD MISSING PERMISSIONS AND ASSIGN TO ROLES
-- =====================================================

-- Add missing permissions if they don't exist
INSERT INTO permission (`id`, `name`) VALUES
(11, 'MANAGE_DECISION'),
(12, 'MANAGE_EMPLOYES')
ON DUPLICATE KEY UPDATE `name` = `name`;

-- Assign MANAGE_DECISION to roles that should have it
-- Admin Informatique (role_id=1)
INSERT INTO role_permission (role_id, permission_id) VALUES (1, 11)
ON DUPLICATE KEY UPDATE permission_id = permission_id;

-- Admin Cabinet (role_id=2)
INSERT INTO role_permission (role_id, permission_id) VALUES (2, 11)
ON DUPLICATE KEY UPDATE permission_id = permission_id;

-- Directeur (role_id=4)
INSERT INTO role_permission (role_id, permission_id) VALUES (4, 11)
ON DUPLICATE KEY UPDATE permission_id = permission_id;

-- Assign MANAGE_EMPLOYES to roles that should have it
-- Admin Informatique (role_id=1)
INSERT INTO role_permission (role_id, permission_id) VALUES (1, 12)
ON DUPLICATE KEY UPDATE permission_id = permission_id;

-- Admin Cabinet (role_id=2)
INSERT INTO role_permission (role_id, permission_id) VALUES (2, 12)
ON DUPLICATE KEY UPDATE permission_id = permission_id;

-- Directeur (role_id=4)
INSERT INTO role_permission (role_id, permission_id) VALUES (4, 12)
ON DUPLICATE KEY UPDATE permission_id = permission_id;
