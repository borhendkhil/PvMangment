-- =====================================================
-- PERMISSIONS - REMPLIR LA TABLE role_permission
-- =====================================================

-- Vider la table pour réinitialiser
DELETE FROM role_permission;

-- ADMIN INFORMATIQUE - Permissions complètes
INSERT INTO role_permission (role_id, permission_id) VALUES
(1, 1), -- CREATE_USER
(1, 2), -- DELETE_USER
(1, 3), -- VIEW_ALL
(1, 4), -- MANAGE_COMITE
(1, 5); -- UPLOAD_PV

-- ADMIN CABINET - Permissions modérées
INSERT INTO role_permission (role_id, permission_id) VALUES
(2, 3), -- VIEW_ALL
(2, 4), -- MANAGE_COMITE
(2, 5); -- UPLOAD_PV

-- USER (Employé) - Permissions limitées
INSERT INTO role_permission (role_id, permission_id) VALUES
(3, 3), -- VIEW_ALL
(3, 5); -- UPLOAD_PV

-- DIRECTEUR - Permissions modérées
INSERT INTO role_permission (role_id, permission_id) VALUES
(4, 3), -- VIEW_ALL
(4, 4), -- MANAGE_COMITE
(4, 5); -- UPLOAD_PV

-- =====================================================
-- AJOUTER PLUS DE PERMISSIONS SI NÉCESSAIRE
-- =====================================================

INSERT INTO permission (`id`, `name`) VALUES
(6, 'MANAGE_USERS'),
(7, 'MANAGE_DIRECTIONS'),
(8, 'MANAGE_ROLES'),
(9, 'VIEW_SECURITY_LOGS'),
(10, 'VIEW_LOGIN_HISTORY');

-- Assigner les nouvelles permissions
INSERT INTO role_permission (role_id, permission_id) VALUES
-- Admin Informatique - Tout
(1, 6), -- MANAGE_USERS
(1, 7), -- MANAGE_DIRECTIONS
(1, 8), -- MANAGE_ROLES
(1, 9), -- VIEW_SECURITY_LOGS
(1, 10), -- VIEW_LOGIN_HISTORY
-- Admin Cabinet - Modération
(2, 6), -- MANAGE_USERS
(2, 7), -- MANAGE_DIRECTIONS
(2, 10), -- VIEW_LOGIN_HISTORY
-- User - Rien de plus
-- Directeur - Modération
(4, 6), -- MANAGE_USERS
(4, 10); -- VIEW_LOGIN_HISTORY
