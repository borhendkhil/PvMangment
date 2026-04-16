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
exports.FonctionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const role_entity_1 = require("../database/entities/role.entity");
const fonction_entity_1 = require("../database/entities/fonction.entity");
let FonctionsService = class FonctionsService extends base_crud_service_1.BaseCrudService {
    constructor(repository, roleRepository) {
        super(repository);
        this.roleRepository = roleRepository;
    }
    findAll() {
        return this.repository.find({ relations: { roles: true }, order: { id: 'ASC' } });
    }
    async findOne(id) {
        const fonction = await this.repository.findOne({
            where: { id },
            relations: { roles: true, employeFonctions: true },
        });
        if (!fonction) {
            throw new common_1.NotFoundException(`Fonction #${id} not found`);
        }
        return fonction;
    }
    async create(dto) {
        const roles = dto.roleIds?.length
            ? await this.roleRepository.findBy({ id: (0, typeorm_2.In)(dto.roleIds) })
            : [];
        if (dto.roleIds?.length && roles.length !== dto.roleIds.length) {
            throw new common_1.NotFoundException('One or more roles were not found');
        }
        return this.repository.save(this.repository.create({
            name: dto.name,
            labelAr: dto.label_ar,
            roles,
        }));
    }
    async update(id, dto) {
        const fonction = await this.findOne(id);
        if (dto.name !== undefined)
            fonction.name = dto.name;
        if (dto.label_ar !== undefined)
            fonction.labelAr = dto.label_ar;
        if (dto.roleIds) {
            const roles = dto.roleIds.length
                ? await this.roleRepository.findBy({ id: (0, typeorm_2.In)(dto.roleIds) })
                : [];
            if (dto.roleIds.length && roles.length !== dto.roleIds.length) {
                throw new common_1.NotFoundException('One or more roles were not found');
            }
            fonction.roles = roles;
        }
        return this.repository.save(fonction);
    }
    async setRoles(fonctionId, roleIds) {
        const fonction = await this.findOne(fonctionId);
        const roles = roleIds.length
            ? await this.roleRepository.findBy({ id: (0, typeorm_2.In)(roleIds) })
            : [];
        if (roleIds.length && roles.length !== roleIds.length) {
            throw new common_1.NotFoundException('One or more roles were not found');
        }
        fonction.roles = roles;
        return this.repository.save(fonction);
    }
};
exports.FonctionsService = FonctionsService;
exports.FonctionsService = FonctionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fonction_entity_1.FonctionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FonctionsService);
//# sourceMappingURL=fonctions.service.js.map