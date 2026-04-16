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
exports.CommitteeSessionEntity = void 0;
const typeorm_1 = require("typeorm");
const comite_entity_1 = require("./comite.entity");
const decision_entity_1 = require("./decision.entity");
const session_report_entity_1 = require("./session-report.entity");
let CommitteeSessionEntity = class CommitteeSessionEntity {
};
exports.CommitteeSessionEntity = CommitteeSessionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], CommitteeSessionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comite_entity_1.CommitteeEntity, (comite) => comite.sessions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'comite_id' }),
    __metadata("design:type", comite_entity_1.CommitteeEntity)
], CommitteeSessionEntity.prototype, "comite", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_session', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], CommitteeSessionEntity.prototype, "dateSession", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lieu', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], CommitteeSessionEntity.prototype, "lieu", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statut', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CommitteeSessionEntity.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cabinet_warning', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CommitteeSessionEntity.prototype, "cabinetWarning", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => session_report_entity_1.SessionReportEntity, report => report.session),
    __metadata("design:type", session_report_entity_1.SessionReportEntity)
], CommitteeSessionEntity.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => decision_entity_1.DecisionEntity, (decision) => decision.session),
    __metadata("design:type", Array)
], CommitteeSessionEntity.prototype, "decisions", void 0);
exports.CommitteeSessionEntity = CommitteeSessionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'comite_session' })
], CommitteeSessionEntity);
//# sourceMappingURL=committee-session.entity.js.map