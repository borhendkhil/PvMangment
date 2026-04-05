-- Données initiales de test - chargées au démarrage

-- Nettoyer les anciennes données
DELETE FROM `user_role`;
DELETE FROM `user`;
DELETE FROM `role_permission`;
DELETE FROM `role`;
DELETE FROM `employe`;
DELETE FROM `direction`;
DELETE FROM `fonction_role_mapping`;
DELETE FROM `fonction`;
DELETE FROM `permission`;
DELETE FROM `role_comite`;

-- Direction
INSERT INTO `direction` (`id`, `code`, `lib`, `address`) VALUES
(7, '07', 'الادارة العامة للتنظيم والاعلامية والتصرف في الوثائق والارشيف', NULL);

-- Employes  
INSERT INTO `employe` (`id`, `matricule`, `nom`, `prenom`, `telephone`, `address`, `direction_id`, `user_id`) VALUES
(1, NULL, 'دخيل', 'سماح', '24045515', NULL, NULL, 6),
(2, NULL, 'Jane', 'Doe', NULL, NULL, NULL, 2),
(3, NULL, 'Admin', '', '24045515', NULL, NULL, 3),
(4, NULL, 'ميلاد', 'عبد المنعم', '', NULL, NULL, 4);

-- Fonctions
INSERT INTO `fonction` (`id`, `name`, `label_ar`) VALUES
(1, 'directeur', 'مدير'),
(2, 'chef_service', 'رئيس مصلحة'),
(3, 'agent', 'عون');

-- Permissions
INSERT INTO `permission` (`id`, `name`) VALUES
(1, 'MANAGE_USERS'),
(2, 'MANAGE_DIRECTIONS'),
(3, 'MANAGE_ROLES'),
(4, 'MANAGE_EMPLOYES'),
(5, 'VIEW_SECURITY_LOGS'),
(6, 'VIEW_LOGIN_HISTORY'),
(7, 'VIEW_ALL'),
(8, 'MANAGE_COMITE'),
(9, 'MANAGE_DECISION'),
(10, 'UPLOAD_PV');

-- Roles
INSERT INTO `role` (`id`, `name`, `label_ar`) VALUES
(1, 'admin_informatique', 'مسؤول المعلوماتية'),
(2, 'admin_cabinet', 'مسؤول ديوان'),
(3, 'user', 'موظف'),
(4, 'directeur', 'مدير');

-- Role/Comite mapping
INSERT INTO `role_comite` (`id`, `name`, `label_ar`) VALUES
(1, 'Président', 'رئيس'),
(2, 'Rapporteur', 'مقرر'),
(3, 'Membre', 'عضو');

-- Fonction/Role Mapping
INSERT INTO `fonction_role_mapping` (`fonction_id`, `role_id`) VALUES
(1, 4),
(2, 3),
(3, 3);

-- Role/Permission Mapping
INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
(2, 7),
(4, 7), (4, 8), (4, 9),
(3, 10);

-- Users (Mot de passe pour tous = "123456" - Hash BCrypt: $2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG)
INSERT INTO `user` (`id`, `email`, `password`, `telephone`, `enabled`, `created_at`) VALUES
(1, 'samah.dekhil@agrinet.tn', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', NULL, 1, '2026-04-02 14:29:02'),
(2, 'newuser@example.com', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', NULL, 0, '2026-04-02 14:29:02'),
(3, 'user@example.com', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', '24045515', 1, '2026-04-02 14:29:02'),
(4, 'user@user.com', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', '', 1, '2026-04-02 14:29:02'),
(5, 'test@test.com', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', '123456', 1, '2026-04-02 15:07:23'),
(6, 'admin_it@agrinet.tn', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', '111111', 1, '2026-04-02 15:08:03'),
(7, 'director@agrinet.tn', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', '222222', 1, '2026-04-02 15:12:42'),
(8, 'cabinet@agrinet.tn', '$2a$12$Qkwe3L3.xJL2jxJWJJPXCeQjPWoL/ktL1G0VqQaP4zKpqyQkj6VlG', '333333', 1, '2026-04-02 15:12:46');

-- User/Role Mapping
INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 4),
(5, 3),
(6, 1),
(7, 4),
(8, 2);
