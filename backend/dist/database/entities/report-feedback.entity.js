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
exports.ReportFeedbackEntity = void 0;
const typeorm_1 = require("typeorm");
const session_report_entity_1 = require("./session-report.entity");
const user_entity_1 = require("./user.entity");
let ReportFeedbackEntity = class ReportFeedbackEntity {
};
exports.ReportFeedbackEntity = ReportFeedbackEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], ReportFeedbackEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => session_report_entity_1.SessionReportEntity, (report) => report.feedbacks, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'report_id' }),
    __metadata("design:type", session_report_entity_1.SessionReportEntity)
], ReportFeedbackEntity.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, undefined, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], ReportFeedbackEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReportFeedbackEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text' }),
    __metadata("design:type", String)
], ReportFeedbackEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_creation', type: 'datetime' }),
    __metadata("design:type", Date)
], ReportFeedbackEntity.prototype, "dateCreation", void 0);
exports.ReportFeedbackEntity = ReportFeedbackEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'report_feedback' })
], ReportFeedbackEntity);
//# sourceMappingURL=report-feedback.entity.js.map