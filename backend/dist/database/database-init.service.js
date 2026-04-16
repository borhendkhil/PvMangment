"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseInitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseInitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let DatabaseInitService = DatabaseInitService_1 = class DatabaseInitService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(DatabaseInitService_1.name);
    }
    async onModuleInit() {
        try {
            await this.initializeMissingTables();
        }
        catch (error) {
            this.logger.error('Failed to initialize database tables', error);
        }
    }
    async initializeMissingTables() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
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
            const decisionColumns = await queryRunner.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'decision' AND TABLE_SCHEMA = DATABASE()`);
            const hasSessionId = decisionColumns.some((col) => col.COLUMN_NAME === 'session_id');
            if (!hasSessionId) {
                await queryRunner.query(`
          ALTER TABLE \`decision\` ADD COLUMN \`session_id\` int DEFAULT NULL
        `);
                await queryRunner.query(`
          ALTER TABLE \`decision\` ADD FOREIGN KEY (\`session_id\`) REFERENCES \`comite_session\`(\`id\`) ON DELETE SET NULL
        `);
                this.logger.log('session_id column added to decision table');
            }
            else {
                this.logger.log('session_id column already exists in decision table');
            }
        }
        catch (error) {
            this.logger.error('Error initializing database tables', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.DatabaseInitService = DatabaseInitService;
exports.DatabaseInitService = DatabaseInitService = DatabaseInitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DatabaseInitService);
//# sourceMappingURL=database-init.service.js.map