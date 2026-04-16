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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleComiteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const role_comite_entity_1 = require("../database/entities/role-comite.entity");
let RoleComiteService = class RoleComiteService extends base_crud_service_1.BaseCrudService {
    constructor(repository) {
        super(repository);
    }
    findAll() {
        return this.repository.find({ order: { id: 'ASC' } });
    }
    create(dto) {
        return super.create({ name: dto.name, labelAr: dto.label_ar });
    }
    update(id, dto) {
        return super.update(id, {
            ...(dto.name !== undefined ? { name: dto.name } : {}),
            ...(dto.label_ar !== undefined ? { labelAr: dto.label_ar } : {}),
        });
    }
};
exports.RoleComiteService = RoleComiteService;
exports.RoleComiteService = RoleComiteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_comite_entity_1.RoleComiteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoleComiteService);
//# sourceMappingURL=role-comite.service.js.map