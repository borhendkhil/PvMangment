import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.initializeMissingTables();
    } catch (error) {
      this.logger.error('Failed to initialize database tables', error);
    }
  }

  private async initializeMissingTables() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Create session_report table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`session_report\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`session_id\` int NOT NULL,
          \`topic\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`context\` text COLLATE utf8mb4_unicode_ci,
          \`discussion\` text COLLATE utf8mb4_unicode_ci,
          \`rows_json\` longtext COLLATE utf8mb4_unicode_ci,
          \`statut\` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
          \`date_creation\` datetime DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`session_id\` (\`session_id\`),
          FOREIGN KEY (\`session_id\`) REFERENCES \`comite_session\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      this.logger.log('session_report table created or already exists');

      // Create report_feedback table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS \`report_feedback\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`report_id\` int NOT NULL,
          \`user_id\` int DEFAULT NULL,
          \`type\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
          \`content\` text COLLATE utf8mb4_unicode_ci NOT NULL,
          \`date_creation\` datetime DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          KEY \`idx_report_feedback\` (\`report_id\`),
          KEY \`idx_user_feedback\` (\`user_id\`),
          FOREIGN KEY (\`report_id\`) REFERENCES \`session_report\`(\`id\`) ON DELETE CASCADE,
          FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      this.logger.log('report_feedback table created or already exists');

      // Check if session_id column exists in decision table, if not add it
      const decisionColumns = await queryRunner.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'decision' AND TABLE_SCHEMA = DATABASE()`
      );

      const hasSessionId = decisionColumns.some((col: any) => col.COLUMN_NAME === 'session_id');
      if (!hasSessionId) {
        await queryRunner.query(`
          ALTER TABLE \`decision\` ADD COLUMN \`session_id\` int DEFAULT NULL
        `);
        await queryRunner.query(`
          ALTER TABLE \`decision\` ADD FOREIGN KEY (\`session_id\`) REFERENCES \`comite_session\`(\`id\`) ON DELETE SET NULL
        `);
        this.logger.log('session_id column added to decision table');
      } else {
        this.logger.log('session_id column already exists in decision table');
      }
    } catch (error) {
      this.logger.error('Error initializing database tables', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
