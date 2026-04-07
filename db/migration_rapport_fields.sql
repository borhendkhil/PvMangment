ALTER TABLE `comite_session`
  ADD COLUMN `report_topic` varchar(255) NULL AFTER `statut`,
  ADD COLUMN `report_context` text NULL AFTER `report_topic`,
  ADD COLUMN `report_discussion` text NULL AFTER `report_context`;

ALTER TABLE `decision`
  ADD COLUMN `recommendation_text` text NULL AFTER `description`,
  ADD COLUMN `execution_structure` varchar(255) NULL AFTER `recommendation_text`,
  ADD COLUMN `deadline_text` varchar(255) NULL AFTER `execution_structure`;
