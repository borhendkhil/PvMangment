-- Add missing session_report and report_feedback tables
-- Migration: Add report functionality

-- Create session_report table if it doesn't exist
CREATE TABLE IF NOT EXISTS `session_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `topic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` text COLLATE utf8mb4_unicode_ci,
  `discussion` text COLLATE utf8mb4_unicode_ci,
  `rows_json` longtext COLLATE utf8mb4_unicode_ci,
  `statut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`),
  FOREIGN KEY (`session_id`) REFERENCES `comite_session`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create report_feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS `report_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_report_feedback` (`report_id`),
  KEY `idx_user_feedback` (`user_id`),
  FOREIGN KEY (`report_id`) REFERENCES `session_report`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add session_id column to decision table if it doesn't exist
ALTER TABLE `decision` ADD COLUMN `session_id` int DEFAULT NULL AFTER `id`;
ALTER TABLE `decision` ADD FOREIGN KEY (`session_id`) REFERENCES `comite_session`(`id`) ON DELETE SET NULL;
ALTER TABLE `decision` ADD INDEX `idx_decision_session` (`session_id`);
