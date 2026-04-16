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
exports.EmployeEntity = void 0;
const typeorm_1 = require("typeorm");
const direction_entity_1 = require("./direction.entity");
const employe_fonction_entity_1 = require("./employe-fonction.entity");
const user_entity_1 = require("./user.entity");
const member_comite_entity_1 = require("./member-comite.entity");
let EmployeEntity = class EmployeEntity {
};
exports.EmployeEntity = EmployeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], EmployeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'matricule', type: 'varchar', length: 50, nullable: true, unique: true }),
    __metadata("design:type", Object)
], EmployeEntity.prototype, "matricule", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nom', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], EmployeEntity.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prenom', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], EmployeEntity.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'telephone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], EmployeEntity.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], EmployeEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => direction_entity_1.DirectionEntity, (direction) => direction.employes, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'direction_id' }),
    __metadata("design:type", Object)
], EmployeEntity.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, (user) => user.employe, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], EmployeEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employe_fonction_entity_1.EmployeFonctionEntity, (employeFonction) => employeFonction.employe),
    __metadata("design:type", Array)
], EmployeEntity.prototype, "employeFonctions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => member_comite_entity_1.MemberComiteEntity, (member) => member.employe),
    __metadata("design:type", Array)
], EmployeEntity.prototype, "memberComites", void 0);
exports.EmployeEntity = EmployeEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'employe' })
], EmployeEntity);
//# sourceMappingURL=employe.entity.js.map