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
exports.RoleComiteEntity = void 0;
const typeorm_1 = require("typeorm");
const member_comite_entity_1 = require("./member-comite.entity");
let RoleComiteEntity = class RoleComiteEntity {
};
exports.RoleComiteEntity = RoleComiteEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], RoleComiteEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], RoleComiteEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'label_ar', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], RoleComiteEntity.prototype, "labelAr", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => member_comite_entity_1.MemberComiteEntity, (member) => member.roleComite),
    __metadata("design:type", Array)
], RoleComiteEntity.prototype, "memberComites", void 0);
exports.RoleComiteEntity = RoleComiteEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'role_comite' })
], RoleComiteEntity);
//# sourceMappingURL=role-comite.entity.js.map