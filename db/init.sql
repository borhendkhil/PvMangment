-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 02 avr. 2026 à 14:40
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `db_pv_management`
--

-- --------------------------------------------------------

--
-- Structure de la table `sujet_decision`
--

DROP TABLE IF EXISTS `sujet_decision`;
CREATE TABLE IF NOT EXISTS `sujet_decision` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sujet` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comite`
--

DROP TABLE IF EXISTS `comite`;
CREATE TABLE IF NOT EXISTS `comite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sujet` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `current_decision_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comite_decision` (`current_decision_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comite_session`
--

DROP TABLE IF EXISTS `comite_session`;
CREATE TABLE IF NOT EXISTS `comite_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comite_id` int DEFAULT NULL,
  `date_session` datetime DEFAULT NULL,
  `lieu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cabinet_warning` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_session_comite` (`comite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `decision_pdf`
--

DROP TABLE IF EXISTS `decision_pdf`;
CREATE TABLE IF NOT EXISTS `decision_pdf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `decision_id` int NOT NULL,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pdf_name` varchar(255) COLLATE utf8mb4_unicode_ci,
  `date_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_decision_pdf` (`decision_id`),
  FOREIGN KEY (`decision_id`) REFERENCES `decision`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `decision`
--

DROP TABLE IF EXISTS `decision`;
CREATE TABLE IF NOT EXISTS `decision` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sujet_id` int DEFAULT NULL,
  `fichier_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fichier_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci,
  `statut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current` tinyint(1) DEFAULT 0,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_upload` datetime,
  PRIMARY KEY (`id`),
  KEY `idx_decision_sujet` (`sujet_id`),
  FOREIGN KEY (`sujet_id`) REFERENCES `sujet_decision`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `direction`
--

DROP TABLE IF EXISTS `direction`;
CREATE TABLE IF NOT EXISTS `direction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lib` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `direction`
--

INSERT INTO `direction` (`id`, `code`, `lib`, `address`) VALUES
(7, '07', 'الادارة العامة للتنظيم والاعلامية والتصرف في الوثائق والارشيف', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `employe`
--

DROP TABLE IF EXISTS `employe`;
CREATE TABLE IF NOT EXISTS `employe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matricule` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direction_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricule` (`matricule`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `FKjf33dj4v6rigg20heq6j2r68u` (`direction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `employe`
--

INSERT INTO `employe` (`id`, `matricule`, `nom`, `prenom`, `telephone`, `address`, `direction_id`, `user_id`) VALUES
(1, NULL, 'دخيل', 'سماح', '24045515', NULL, 7, 6),
(2, NULL, 'Jane', 'Doe', NULL, NULL, NULL, 2),
(3, NULL, 'Admin', '', '24045515', NULL, NULL, 3),
(4, NULL, 'ميلاد', 'عبد المنعم', '', NULL, 7, 4);

-- --------------------------------------------------------

--
-- Structure de la table `employe_fonction`
--

DROP TABLE IF EXISTS `employe_fonction`;
CREATE TABLE IF NOT EXISTS `employe_fonction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employe_id` int DEFAULT NULL,
  `fonction_id` int DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FKidmrc09oc2m9h9bv3ne3opwk5` (`employe_id`),
  KEY `FK4l6v9l6nchak105kvj7pp8ndp` (`fonction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fonction`
--

DROP TABLE IF EXISTS `fonction`;
CREATE TABLE IF NOT EXISTS `fonction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label_ar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `fonction`
--

INSERT INTO `fonction` (`id`, `name`, `label_ar`) VALUES
(1, 'directeur', 'مدير'),
(2, 'chef_service', 'رئيس مصلحة'),
(3, 'agent', 'عون');

-- --------------------------------------------------------

--
-- Structure de la table `log_activity`
--

DROP TABLE IF EXISTS `log_activity`;
CREATE TABLE IF NOT EXISTS `log_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_action` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `membre_comite`
--

DROP TABLE IF EXISTS `membre_comite`;
CREATE TABLE IF NOT EXISTS `membre_comite` (
  `comite_id` int NOT NULL,
  `employe_id` int NOT NULL,
  `role_comite_id` int DEFAULT NULL,
  PRIMARY KEY (`comite_id`,`employe_id`),
  KEY `FK7cgv3xuvb86andn863x1482mp` (`employe_id`),
  KEY `FK8sqt76lb6og74d0hit8vg6no6` (`role_comite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permission`
--

DROP TABLE IF EXISTS `permission`;
CREATE TABLE IF NOT EXISTS `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `permission`
--

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
(10, 'UPLOAD_PV'),
(11, 'MANAGE_PERMISSIONS'),
(12, 'MANAGE_FONCTIONS');

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label_ar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id`, `name`, `label_ar`) VALUES
(1, 'admin_informatique', 'مسؤول المعلوماتية'),
(2, 'admin_cabinet', 'مسؤول ديوان'),
(3, 'user', 'موظف'),
(4, 'directeur', 'مدير');

-- --------------------------------------------------------

--
-- Structure de la table `role_comite`
--

DROP TABLE IF EXISTS `role_comite`;
CREATE TABLE IF NOT EXISTS `role_comite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label_ar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role_comite`
--

INSERT INTO `role_comite` (`id`, `name`, `label_ar`) VALUES
(1, 'Président', 'رئيس'),
(2, 'Rapporteur', 'مقرر'),
(3, 'Membre', 'عضو');

-- --------------------------------------------------------

--
-- Structure de la table `fonction_role_mapping`
--

DROP TABLE IF EXISTS `fonction_role_mapping`;
CREATE TABLE IF NOT EXISTS `fonction_role_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fonction_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fonction_role` (`fonction_id`, `role_id`),
  KEY `FK_fonction_role_mapping_fonction` (`fonction_id`),
  KEY `FK_fonction_role_mapping_role` (`role_id`),
  FOREIGN KEY (`fonction_id`) REFERENCES `fonction`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `fonction_role_mapping`
--

INSERT INTO `fonction_role_mapping` (`fonction_id`, `role_id`) VALUES
(1, 4),  -- directeur → role 'directeur'
(2, 3),  -- chef_service → role 'user'
(3, 3);  -- agent → role 'user'

-- --------------------------------------------------------

--
-- Structure de la table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE IF NOT EXISTS `role_permission` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role_permission`
--
-- Admin Informatique (id=1): accès système complet
-- Admin Cabinet (id=2): supervision uniquement
-- User (id=3): upload PV (avec contrainte métier en backend)
-- Directeur (id=4): gestion comités

INSERT INTO `role_permission` (`role_id`, `permission_id`) VALUES
-- Admin Informatique: système complet
(1, 1), -- MANAGE_USERS
(1, 2), -- MANAGE_DIRECTIONS
(1, 3), -- MANAGE_ROLES
(1, 4), -- MANAGE_EMPLOYES
(1, 5), -- VIEW_SECURITY_LOGS
(1, 6), -- VIEW_LOGIN_HISTORY
(1, 7), -- VIEW_ALL
(1, 11), -- MANAGE_PERMISSIONS
(1, 12), -- MANAGE_FONCTIONS
-- Admin Cabinet: lecture seule
(2, 7), -- VIEW_ALL
-- Directeur: gestion métier
(4, 7), -- VIEW_ALL
(4, 8), -- MANAGE_COMITE
(4, 9), -- MANAGE_DECISION
-- User: upload (sécurisé en backend)
(3, 10); -- UPLOAD_PV

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `nom_prenom`, `telephone`, `enabled`, `created_at`) VALUES
(1, 'samah.dekhil@agrinet.tn', '$2a$12$fb9qftAbBdfVjTUf2QBv2uo2g55gCZqJvZNvy.yuUpLZgHRfKy3Mu', 'سماح دخيل', NULL, 1, '2026-04-02 14:29:02'),
(2, 'newuser@example.com', '$2a$12$dhJuP0zy4kwwcejROcxtde3jkE8O9J6HwNXaL8QwNNF8Kjyla4fDC', 'Jane Doe', NULL, 0, '2026-04-02 14:29:02'),
(3, 'user@example.com', '$2a$12$xHzUlwOWR4hUTdVL4qWmDO5heqc6IFl7v1ld11EePTdDVV5H/Drfy', 'Admin', '24045515', 1, '2026-04-02 14:29:02'),
(4, 'user@user.com', '$2a$12$bNqcX4qUFJJEqRbvBRAU/.ELZU71qHL1CrdG3Xvr0QLYuX0W1moJm', 'ميلاد عبد المنعم', '', 1, '2026-04-02 14:29:02'),
(5, 'test@test.com', '$2a$12$Y188HnqnmWWIC9QnrrlAYuVkptQtmFqRAhl6HVvuPF2DEzRf8Phvq', 'Test User', '123456', 1, '2026-04-02 15:07:23'),
(6, 'admin_it@agrinet.tn', '$2a$12$HtoPyG4FcFqg/Db7Hcg7sOIL69ZM23FlRMN.0soLN3BJInbp0iteO', 'دخيل سماح', '111111', 1, '2026-04-02 15:08:03'),
(7, 'director@agrinet.tn', '$2a$12$DIi0rpjQKyk83dHg7dioyebcjamFiJdH7DvwHhskoTEbTDucBBXui', 'Director', '222222', 1, '2026-04-02 15:12:42'),
(8, 'cabinet@agrinet.tn', '$2a$12$pKiPWO47hPSnno6lqTKCYOjIRjMTPSSkbcxa1TLjyQ/S7ybg1c10O', 'Cabinet Admin', '333333', 1, '2026-04-02 15:12:46');

-- --------------------------------------------------------

--
-- Structure de la table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE IF NOT EXISTS `user_role` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKa68196081fvvojhkek5m97n3y` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_role`
--

INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 4),
(5, 3),
(6, 1),
(7, 4),
(8, 2);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
