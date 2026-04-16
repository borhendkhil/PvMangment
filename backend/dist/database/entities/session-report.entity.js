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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionReportEntity = void 0;
const typeorm_1 = require("typeorm");
const committee_session_entity_1 = require("./committee-session.entity");
const report_feedback_entity_1 = require("./report-feedback.entity");
let SessionReportEntity = class SessionReportEntity {
};
exports.SessionReportEntity = SessionReportEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], SessionReportEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => committee_session_entity_1.CommitteeSessionEntity, (session) => session.report, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", committee_session_entity_1.CommitteeSessionEntity)
], SessionReportEntity.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'topic', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SessionReportEntity.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'context', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SessionReportEntity.prototype, "context", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discussion', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SessionReportEntity.prototype, "discussion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rows_json', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], SessionReportEntity.prototype, "rowsJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statut', type: 'varchar', length: 50, default: 'DRAFT' }),
    __metadata("design:type", String)
], SessionReportEntity.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_creation', type: 'datetime' }),
    __metadata("design:type", Date)
], SessionReportEntity.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_feedback_entity_1.ReportFeedbackEntity, (feedback) => feedback.report),
    __metadata("design:type", Array)
], SessionReportEntity.prototype, "feedbacks", void 0);
exports.SessionReportEntity = SessionReportEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'session_report' })
], SessionReportEntity);
//# sourceMappingURL=session-report.entity.js.map