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
exports.CommitteeEntity = void 0;
const typeorm_1 = require("typeorm");
const committee_session_entity_1 = require("./committee-session.entity");
const member_comite_entity_1 = require("./member-comite.entity");
const decision_entity_1 = require("./decision.entity");
let CommitteeEntity = class CommitteeEntity {
};
exports.CommitteeEntity = CommitteeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], CommitteeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'titre', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CommitteeEntity.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CommitteeEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_creation', type: 'datetime' }),
    __metadata("design:type", Date)
], CommitteeEntity.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => committee_session_entity_1.CommitteeSessionEntity, (session) => session.comite),
    __metadata("design:type", Array)
], CommitteeEntity.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => member_comite_entity_1.MemberComiteEntity, (member) => member.comite),
    __metadata("design:type", Array)
], CommitteeEntity.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => decision_entity_1.DecisionEntity, (decision) => decision.comite),
    __metadata("design:type", Array)
], CommitteeEntity.prototype, "decisions", void 0);
exports.CommitteeEntity = CommitteeEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'comite' })
], CommitteeEntity);
//# sourceMappingURL=comite.entity.js.map