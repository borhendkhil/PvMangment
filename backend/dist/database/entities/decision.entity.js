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
exports.DecisionEntity = void 0;
const typeorm_1 = require("typeorm");
const committee_session_entity_1 = require("./committee-session.entity");
const decision_pdf_entity_1 = require("./decision-pdf.entity");
const subject_decision_entity_1 = require("./subject-decision.entity");
const comite_entity_1 = require("./comite.entity");
let DecisionEntity = class DecisionEntity {
};
exports.DecisionEntity = DecisionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], DecisionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_decision_entity_1.SubjectDecisionEntity, (subject) => subject.decisions, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sujet_id' }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => committee_session_entity_1.CommitteeSessionEntity, (session) => session.decisions, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'num_admin', type: 'varchar', length: 50, nullable: true, unique: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "numAdmin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'titre', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recommendation_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "recommendationText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'execution_structure', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "executionStructure", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deadline_text', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "deadlineText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fichier_path', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "fichierPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fichier_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "fichierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statut', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current', type: 'tinyint', width: 1, default: false }),
    __metadata("design:type", Boolean)
], DecisionEntity.prototype, "current", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_creation', type: 'datetime' }),
    __metadata("design:type", Date)
], DecisionEntity.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_upload', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "dateUpload", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => decision_pdf_entity_1.DecisionPdfEntity, (pdf) => pdf.decision),
    __metadata("design:type", Array)
], DecisionEntity.prototype, "decisionPdfs", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comite_entity_1.CommitteeEntity, (comite) => comite.decisions, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'comite_id' }),
    __metadata("design:type", Object)
], DecisionEntity.prototype, "comite", void 0);
exports.DecisionEntity = DecisionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'decision' })
], DecisionEntity);
//# sourceMappingURL=decision.entity.js.map