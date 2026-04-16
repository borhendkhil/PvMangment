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
exports.CommitteesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const comite_entity_1 = require("../database/entities/comite.entity");
let CommitteesService = class CommitteesService extends base_crud_service_1.BaseCrudService {
    constructor(repository) {
        super(repository);
    }
    findAll() {
        return this.repository.find({
            relations: {
                sessions: { decisions: { subject: true } },
                members: { employe: true, roleComite: true },
                decisions: { subject: true },
            },
            order: { id: 'ASC' },
        }).then((committees) => committees.map((committee) => this.decorateCommittee(committee)));
    }
    async findOne(id) {
        const committee = await this.repository.findOne({
            where: { id },
            relations: {
                sessions: { decisions: { subject: true } },
                members: { employe: true, roleComite: true },
                decisions: { subject: true },
            },
        });
        if (!committee) {
            throw new common_1.NotFoundException(`Committee #${id} not found`);
        }
        return this.decorateCommittee(committee);
    }
    async create(dto) {
        const saved = await this.repository.save(this.repository.create({
            titre: dto.titre,
            description: dto.description ?? null,
        }));
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const committee = await this.repository.findOne({
            where: { id },
            relations: {
                sessions: { decisions: { subject: true } },
                members: { employe: true, roleComite: true },
                decisions: { subject: true },
            },
        });
        if (!committee) {
            throw new common_1.NotFoundException(`Committee #${id} not found`);
        }
        if (dto.titre !== undefined)
            committee.titre = dto.titre;
        if (dto.description !== undefined)
            committee.description = dto.description ?? null;
        const saved = await this.repository.save(committee);
        return this.findOne(saved.id);
    }
    decorateCommittee(committee) {
        const sessions = committee.sessions ?? [];
        const directDecisions = committee.decisions ?? [];
        const sessionDecisions = sessions.flatMap((session) => (session.decisions ?? []).map((decision) => ({
            ...decision,
            sessionId: session.id,
        })));
        const allDecisions = [...directDecisions, ...sessionDecisions];
        return {
            ...committee,
            totalSessions: sessions.length,
            totalMembres: committee.members?.length ?? 0,
            totalDecisions: allDecisions.length,
            decisions: allDecisions,
        };
    }
};
exports.CommitteesService = CommitteesService;
exports.CommitteesService = CommitteesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comite_entity_1.CommitteeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommitteesService);
//# sourceMappingURL=committees.service.js.map