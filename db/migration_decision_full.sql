-- Migration for the enhanced decision model

ALTER TABLE `decision`
  ADD COLUMN IF NOT EXISTS `numero` VARCHAR(20),
  ADD COLUMN IF NOT EXISTS `titre` VARCHAR(500),
  ADD COLUMN IF NOT EXISTS `date_decision` DATE,
  ADD COLUMN IF NOT EXISTS `objet` TEXT,
  ADD COLUMN IF NOT EXISTS `comite_id` INT,
  ADD COLUMN IF NOT EXISTS `decision_annulee_numero` VARCHAR(20),
  ADD COLUMN IF NOT EXISTS `decision_annulee_date` DATE,
  ADD COLUMN IF NOT EXISTS `date_limite` DATE,
  ADD COLUMN IF NOT EXISTS `rapport_periodique` BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS `periodicite_rapport` VARCHAR(50);

CREATE TABLE IF NOT EXISTS `decision_article` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `decision_id` INT NOT NULL,
  `numero_article` INT NOT NULL,
  `titre_article` VARCHAR(100),
  `contenu` TEXT NOT NULL,
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_decision_article_decision`
    FOREIGN KEY (`decision_id`) REFERENCES `decision`(`id`) ON DELETE CASCADE
);

