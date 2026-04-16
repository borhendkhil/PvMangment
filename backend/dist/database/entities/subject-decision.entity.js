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
exports.SubjectDecisionEntity = void 0;
const typeorm_1 = require("typeorm");
const decision_entity_1 = require("./decision.entity");
let SubjectDecisionEntity = class SubjectDecisionEntity {
};
exports.SubjectDecisionEntity = SubjectDecisionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], SubjectDecisionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sujet', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SubjectDecisionEntity.prototype, "sujet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SubjectDecisionEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_creation', type: 'datetime' }),
    __metadata("design:type", Date)
], SubjectDecisionEntity.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => decision_entity_1.DecisionEntity, (decision) => decision.subject),
    __metadata("design:type", Array)
], SubjectDecisionEntity.prototype, "decisions", void 0);
exports.SubjectDecisionEntity = SubjectDecisionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'sujet_decision' })
], SubjectDecisionEntity);
//# sourceMappingURL=subject-decision.entity.js.map