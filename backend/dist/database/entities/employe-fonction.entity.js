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
exports.EmployeFonctionEntity = void 0;
const typeorm_1 = require("typeorm");
const employe_entity_1 = require("./employe.entity");
const fonction_entity_1 = require("./fonction.entity");
let EmployeFonctionEntity = class EmployeFonctionEntity {
};
exports.EmployeFonctionEntity = EmployeFonctionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], EmployeFonctionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employe_entity_1.EmployeEntity, (employe) => employe.employeFonctions, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'employe_id' }),
    __metadata("design:type", Object)
], EmployeFonctionEntity.prototype, "employe", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => fonction_entity_1.FonctionEntity, (fonction) => fonction.employeFonctions, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'fonction_id' }),
    __metadata("design:type", Object)
], EmployeFonctionEntity.prototype, "fonction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_debut', type: 'date' }),
    __metadata("design:type", String)
], EmployeFonctionEntity.prototype, "dateDebut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_fin', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], EmployeFonctionEntity.prototype, "dateFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: true }),
    __metadata("design:type", Boolean)
], EmployeFonctionEntity.prototype, "isActive", void 0);
exports.EmployeFonctionEntity = EmployeFonctionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'employe_fonction' })
], EmployeFonctionEntity);
//# sourceMappingURL=employe-fonction.entity.js.map