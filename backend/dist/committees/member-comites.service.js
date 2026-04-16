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
exports.MemberComitesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comite_entity_1 = require("../database/entities/comite.entity");
const employe_entity_1 = require("../database/entities/employe.entity");
const member_comite_entity_1 = require("../database/entities/member-comite.entity");
const role_comite_entity_1 = require("../database/entities/role-comite.entity");
let MemberComitesService = class MemberComitesService {
    constructor(repository, committeeRepository, employeRepository, roleComiteRepository) {
        this.repository = repository;
        this.committeeRepository = committeeRepository;
        this.employeRepository = employeRepository;
        this.roleComiteRepository = roleComiteRepository;
    }
    findAll() {
        return this.repository.find({
            relations: { comite: true, employe: true, roleComite: true },
        });
    }
    async findOne(comiteId, employeId) {
        const row = await this.repository.findOne({
            where: { comiteId, employeId },
            relations: { comite: true, employe: true, roleComite: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Member #${comiteId}/${employeId} not found`);
        }
        return row;
    }
    async create(dto) {
        const comite = await this.committeeRepository.findOne({ where: { id: dto.comiteId } });
        const employe = await this.employeRepository.findOne({ where: { id: dto.employeId } });
        const roleComite = dto.roleComiteId
            ? await this.roleComiteRepository.findOne({ where: { id: dto.roleComiteId } })
            : null;
        if (!comite) {
            throw new common_1.NotFoundException(`Committee #${dto.comiteId} not found`);
        }
        if (!employe) {
            throw new common_1.NotFoundException(`Employee #${dto.employeId} not found`);
        }
        if (dto.roleComiteId && !roleComite) {
            throw new common_1.NotFoundException(`Committee role #${dto.roleComiteId} not found`);
        }
        return this.repository.save(this.repository.create({
            comiteId: dto.comiteId,
            employeId: dto.employeId,
            comite,
            employe,
            roleComite,
        }));
    }
    async update(comiteId, employeId, dto) {
        const row = await this.findOne(comiteId, employeId);
        if (dto.roleComiteId !== undefined) {
            if (dto.roleComiteId) {
                const roleComite = await this.roleComiteRepository.findOne({
                    where: { id: dto.roleComiteId },
                });
                if (!roleComite) {
                    throw new common_1.NotFoundException(`Committee role #${dto.roleComiteId} not found`);
                }
                row.roleComite = roleComite;
            }
            else {
                row.roleComite = null;
            }
        }
        return this.repository.save(row);
    }
    async remove(comiteId, employeId) {
        const row = await this.findOne(comiteId, employeId);
        await this.repository.remove(row);
    }
};
exports.MemberComitesService = MemberComitesService;
exports.MemberComitesService = MemberComitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(member_comite_entity_1.MemberComiteEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(comite_entity_1.CommitteeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(employe_entity_1.EmployeEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(role_comite_entity_1.RoleComiteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MemberComitesService);
//# sourceMappingURL=member-comites.service.js.map