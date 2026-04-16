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
exports.MemberComiteEntity = void 0;
const typeorm_1 = require("typeorm");
const comite_entity_1 = require("./comite.entity");
const employe_entity_1 = require("./employe.entity");
const role_comite_entity_1 = require("./role-comite.entity");
let MemberComiteEntity = class MemberComiteEntity {
};
exports.MemberComiteEntity = MemberComiteEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'comite_id', type: 'int' }),
    __metadata("design:type", Number)
], MemberComiteEntity.prototype, "comiteId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'employe_id', type: 'int' }),
    __metadata("design:type", Number)
], MemberComiteEntity.prototype, "employeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => comite_entity_1.CommitteeEntity, (comite) => comite.members, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'comite_id' }),
    __metadata("design:type", comite_entity_1.CommitteeEntity)
], MemberComiteEntity.prototype, "comite", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employe_entity_1.EmployeEntity, (employe) => employe.memberComites, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'employe_id' }),
    __metadata("design:type", employe_entity_1.EmployeEntity)
], MemberComiteEntity.prototype, "employe", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_comite_entity_1.RoleComiteEntity, (roleComite) => roleComite.memberComites, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'role_comite_id' }),
    __metadata("design:type", Object)
], MemberComiteEntity.prototype, "roleComite", void 0);
exports.MemberComiteEntity = MemberComiteEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'membre_comite' })
], MemberComiteEntity);
//# sourceMappingURL=member-comite.entity.js.map