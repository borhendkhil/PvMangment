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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const permission_entity_1 = require("../database/entities/permission.entity");
const role_entity_1 = require("../database/entities/role.entity");
let RolesService = class RolesService extends base_crud_service_1.BaseCrudService {
    constructor(repository, permissionRepository) {
        super(repository);
        this.permissionRepository = permissionRepository;
    }
    sanitizeRole(role) {
        if (!role.users) {
            return role;
        }
        return {
            ...role,
            users: role.users.map((user) => {
                const { password, ...publicUser } = user;
                return publicUser;
            }),
        };
    }
    findAll() {
        return this.repository.find({
            relations: { permissions: true },
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        const role = await this.repository.findOne({
            where: { id },
            relations: { permissions: true, users: true, fonctions: true },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role #${id} not found`);
        }
        return this.sanitizeRole(role);
    }
    async create(dto) {
        const permissions = dto.permissionIds?.length
            ? await this.permissionRepository.findBy({ id: (0, typeorm_2.In)(dto.permissionIds) })
            : [];
        if (dto.permissionIds?.length && permissions.length !== dto.permissionIds.length) {
            throw new common_1.NotFoundException('One or more permissions were not found');
        }
        return this.repository.save(this.repository.create({
            name: dto.name,
            labelAr: dto.label_ar,
            permissions,
        }));
    }
    async update(id, dto) {
        const role = await this.findOne(id);
        if (dto.permissionIds) {
            const permissions = dto.permissionIds.length
                ? await this.permissionRepository.findBy({ id: (0, typeorm_2.In)(dto.permissionIds) })
                : [];
            if (dto.permissionIds.length && permissions.length !== dto.permissionIds.length) {
                throw new common_1.NotFoundException('One or more permissions were not found');
            }
            role.permissions = permissions;
        }
        if (dto.name !== undefined) {
            role.name = dto.name;
        }
        if (dto.label_ar !== undefined) {
            role.labelAr = dto.label_ar;
        }
        return this.repository.save(role);
    }
    async setPermissions(roleId, dto) {
        const role = await this.findOne(roleId);
        const permissions = dto.permissionIds.length
            ? await this.permissionRepository.findBy({ id: (0, typeorm_2.In)(dto.permissionIds) })
            : [];
        if (dto.permissionIds.length && permissions.length !== dto.permissionIds.length) {
            throw new common_1.NotFoundException('One or more permissions were not found');
        }
        role.permissions = permissions;
        return this.repository.save(role);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map