"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const role_entity_1 = require("../database/entities/role.entity");
const user_entity_1 = require("../database/entities/user.entity");
let UsersService = class UsersService extends base_crud_service_1.BaseCrudService {
    constructor(repository, roleRepository) {
        super(repository);
        this.roleRepository = roleRepository;
    }
    sanitizeUser(user) {
        const { password, ...publicUser } = user;
        return publicUser;
    }
    async getRawUser(id) {
        const user = await this.repository.findOne({
            where: { id },
            relations: { roles: true, employe: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User #${id} not found`);
        }
        return user;
    }
    findAll() {
        return this.repository
            .find({
            relations: { roles: true, employe: true },
            order: { id: 'ASC' },
        })
            .then((users) => users.map((user) => this.sanitizeUser(user)));
    }
    async findOne(id) {
        const user = await this.repository.findOne({
            where: { id },
            relations: {
                roles: { permissions: true },
                employe: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User #${id} not found`);
        }
        return this.sanitizeUser(user);
    }
    async findByEmail(email) {
        return this.repository.findOne({
            where: { email },
            relations: {
                roles: { permissions: true },
                employe: { memberComites: { roleComite: true } },
            },
        });
    }
    async findByEmailForAuth(email) {
        return this.findByEmail(email);
    }
    async create(dto) {
        const password = await bcrypt.hash(dto.password, 12);
        const roles = dto.roleIds?.length
            ? await this.roleRepository.findBy({ id: (0, typeorm_2.In)(dto.roleIds) })
            : [];
        if (dto.roleIds?.length && roles.length !== dto.roleIds.length) {
            throw new common_1.NotFoundException('One or more roles were not found');
        }
        const user = this.repository.create({
            email: dto.email,
            password,
            telephone: dto.telephone ?? null,
            enabled: dto.enabled ?? true,
            roles,
        });
        return this.repository.save(user).then((saved) => this.sanitizeUser(saved));
    }
    async update(id, dto) {
        const user = await this.getRawUser(id);
        if (dto.email !== undefined) {
            user.email = dto.email;
        }
        if (dto.password !== undefined) {
            user.password = await bcrypt.hash(dto.password, 12);
        }
        if (dto.telephone !== undefined) {
            user.telephone = dto.telephone ?? null;
        }
        if (dto.enabled !== undefined) {
            user.enabled = dto.enabled;
        }
        if (dto.roleIds) {
            const roles = dto.roleIds.length
                ? await this.roleRepository.findBy({ id: (0, typeorm_2.In)(dto.roleIds) })
                : [];
            if (dto.roleIds.length && roles.length !== dto.roleIds.length) {
                throw new common_1.NotFoundException('One or more roles were not found');
            }
            user.roles = roles;
        }
        const saved = await this.repository.save(user);
        return this.sanitizeUser(saved);
    }
    async setRoles(userId, roleIds) {
        const user = await this.getRawUser(userId);
        const roles = roleIds.length
            ? await this.roleRepository.findBy({ id: (0, typeorm_2.In)(roleIds) })
            : [];
        if (roleIds.length && roles.length !== roleIds.length) {
            throw new common_1.NotFoundException('One or more roles were not found');
        }
        user.roles = roles;
        const saved = await this.repository.save(user);
        return this.sanitizeUser(saved);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map