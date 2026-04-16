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
exports.EmployeFonctionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const employe_entity_1 = require("../database/entities/employe.entity");
const employe_fonction_entity_1 = require("../database/entities/employe-fonction.entity");
const fonction_entity_1 = require("../database/entities/fonction.entity");
let EmployeFonctionsService = class EmployeFonctionsService extends base_crud_service_1.BaseCrudService {
    constructor(repository, employeRepository, fonctionRepository) {
        super(repository);
        this.employeRepository = employeRepository;
        this.fonctionRepository = fonctionRepository;
    }
    findAll() {
        return this.repository.find({
            relations: { employe: true, fonction: true },
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        const row = await this.repository.findOne({
            where: { id },
            relations: { employe: true, fonction: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Employe fonction #${id} not found`);
        }
        return row;
    }
    async getCurrentFunction(employeId) {
        return this.repository.findOne({
            where: {
                employe: { id: employeId },
                isActive: true,
            },
            relations: { employe: true, fonction: true },
        });
    }
    async create(dto) {
        const employe = dto.employeId
            ? await this.employeRepository.findOne({ where: { id: dto.employeId } })
            : null;
        const fonction = dto.fonctionId
            ? await this.fonctionRepository.findOne({ where: { id: dto.fonctionId } })
            : null;
        if (dto.isActive ?? true) {
            await this.repository
                .createQueryBuilder()
                .update(employe_fonction_entity_1.EmployeFonctionEntity)
                .set({ isActive: false })
                .where('employe_id = :employeId', { employeId: dto.employeId })
                .andWhere('is_active = 1')
                .execute();
        }
        return this.repository.save(this.repository.create({
            employe,
            fonction,
            dateDebut: dto.dateDebut,
            dateFin: dto.dateFin ?? null,
            isActive: dto.isActive ?? true,
        }));
    }
    async update(id, dto) {
        const row = await this.findOne(id);
        if (dto.employeId !== undefined) {
            row.employe = dto.employeId
                ? await this.employeRepository.findOne({ where: { id: dto.employeId } })
                : null;
        }
        if (dto.fonctionId !== undefined) {
            row.fonction = dto.fonctionId
                ? await this.fonctionRepository.findOne({ where: { id: dto.fonctionId } })
                : null;
        }
        if (dto.dateDebut !== undefined)
            row.dateDebut = dto.dateDebut;
        if (dto.dateFin !== undefined)
            row.dateFin = dto.dateFin ?? null;
        if (dto.isActive !== undefined) {
            if (dto.isActive && row.employe?.id) {
                await this.repository
                    .createQueryBuilder()
                    .update(employe_fonction_entity_1.EmployeFonctionEntity)
                    .set({ isActive: false })
                    .where('employe_id = :employeId', { employeId: row.employe.id })
                    .andWhere('id != :id', { id })
                    .andWhere('is_active = 1')
                    .execute();
            }
            row.isActive = dto.isActive;
        }
        return this.repository.save(row);
    }
};
exports.EmployeFonctionsService = EmployeFonctionsService;
exports.EmployeFonctionsService = EmployeFonctionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employe_fonction_entity_1.EmployeFonctionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(employe_entity_1.EmployeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(fonction_entity_1.FonctionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeFonctionsService);
//# sourceMappingURL=employe-fonctions.service.js.map