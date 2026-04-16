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
exports.FonctionEntity = void 0;
const typeorm_1 = require("typeorm");
const employe_fonction_entity_1 = require("./employe-fonction.entity");
const role_entity_1 = require("./role.entity");
let FonctionEntity = class FonctionEntity {
};
exports.FonctionEntity = FonctionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], FonctionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], FonctionEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'label_ar', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], FonctionEntity.prototype, "labelAr", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employe_fonction_entity_1.EmployeFonctionEntity, (employeFonction) => employeFonction.fonction),
    __metadata("design:type", Array)
], FonctionEntity.prototype, "employeFonctions", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.RoleEntity, (role) => role.fonctions),
    (0, typeorm_1.JoinTable)({
        name: 'fonction_role_mapping',
        joinColumn: { name: 'fonction_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], FonctionEntity.prototype, "roles", void 0);
exports.FonctionEntity = FonctionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'fonction' })
], FonctionEntity);
//# sourceMappingURL=fonction.entity.js.map