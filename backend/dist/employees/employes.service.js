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
exports.EmployesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const direction_entity_1 = require("../database/entities/direction.entity");
const employe_entity_1 = require("../database/entities/employe.entity");
const user_entity_1 = require("../database/entities/user.entity");
let EmployesService = class EmployesService extends base_crud_service_1.BaseCrudService {
    constructor(repository, directionRepository, userRepository) {
        super(repository);
        this.directionRepository = directionRepository;
        this.userRepository = userRepository;
    }
    sanitizeEmploye(employe) {
        if (employe.user && employe.user.password) {
            const { password, ...publicUser } = employe.user;
            return {
                ...employe,
                user: publicUser,
            };
        }
        return employe;
    }
    findAll() {
        return this.repository
            .find({
            relations: { direction: true, user: true, employeFonctions: { fonction: true } },
            order: { id: 'ASC' },
        })
            .then((rows) => rows.map((row) => this.sanitizeEmploye(row)));
    }
    async findOne(id) {
        const employe = await this.repository.findOne({
            where: { id },
            relations: {
                direction: true,
                user: true,
                employeFonctions: { fonction: true },
                memberComites: { comite: true, roleComite: true },
            },
        });
        if (!employe) {
            throw new common_1.NotFoundException(`Employe #${id} not found`);
        }
        return this.sanitizeEmploye(employe);
    }
    async create(dto) {
        const direction = dto.directionId
            ? await this.directionRepository.findOne({ where: { id: dto.directionId } })
            : null;
        const user = dto.userId
            ? await this.userRepository.findOne({ where: { id: dto.userId } })
            : null;
        if (dto.directionId && !direction) {
            throw new common_1.NotFoundException(`Direction #${dto.directionId} not found`);
        }
        if (dto.userId && !user) {
            throw new common_1.NotFoundException(`User #${dto.userId} not found`);
        }
        return this.repository.save(this.repository.create({
            matricule: dto.matricule ?? null,
            nom: dto.nom,
            prenom: dto.prenom,
            telephone: dto.telephone ?? null,
            address: dto.address ?? null,
            direction,
            user,
        }));
    }
    async update(id, dto) {
        const employe = await this.findOne(id);
        if (dto.matricule !== undefined)
            employe.matricule = dto.matricule ?? null;
        if (dto.nom !== undefined)
            employe.nom = dto.nom;
        if (dto.prenom !== undefined)
            employe.prenom = dto.prenom;
        if (dto.telephone !== undefined)
            employe.telephone = dto.telephone ?? null;
        if (dto.address !== undefined)
            employe.address = dto.address ?? null;
        if (dto.directionId !== undefined) {
            if (dto.directionId) {
                const direction = await this.directionRepository.findOne({ where: { id: dto.directionId } });
                if (!direction) {
                    throw new common_1.NotFoundException(`Direction #${dto.directionId} not found`);
                }
                employe.direction = direction;
            }
            else {
                employe.direction = null;
            }
        }
        if (dto.userId !== undefined) {
            if (dto.userId) {
                const user = await this.userRepository.findOne({ where: { id: dto.userId } });
                if (!user) {
                    throw new common_1.NotFoundException(`User #${dto.userId} not found`);
                }
                employe.user = user;
            }
            else {
                employe.user = null;
            }
        }
        return this.repository.save(employe);
    }
};
exports.EmployesService = EmployesService;
exports.EmployesService = EmployesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employe_entity_1.EmployeEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(direction_entity_1.DirectionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployesService);
//# sourceMappingURL=employes.service.js.map