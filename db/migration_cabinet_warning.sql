ALTER TABLE `comite_session`
ADD COLUMN `cabinet_warning` text COLLATE utf8mb4_unicode_ci NULL AFTER `statut`;
