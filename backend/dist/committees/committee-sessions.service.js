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
exports.CommitteeSessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const comite_entity_1 = require("../database/entities/comite.entity");
const committee_session_entity_1 = require("../database/entities/committee-session.entity");
const user_entity_1 = require("../database/entities/user.entity");
let CommitteeSessionsService = class CommitteeSessionsService extends base_crud_service_1.BaseCrudService {
    constructor(repository, committeeRepository, userRepository) {
        super(repository);
        this.committeeRepository = committeeRepository;
        this.userRepository = userRepository;
    }
    findAll() {
        return this.repository.find({ relations: { comite: true, decisions: true }, order: { id: 'ASC' } });
    }
    async findOne(id) {
        const session = await this.repository.findOne({
            where: { id },
            relations: { comite: true, decisions: true },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Committee session #${id} not found`);
        }
        return session;
    }
    async create(dto) {
        const comite = await this.committeeRepository.findOne({ where: { id: dto.comiteId } });
        if (!comite) {
            throw new common_1.NotFoundException(`Committee #${dto.comiteId} not found`);
        }
        return this.repository.save(this.repository.create({
            comite,
            dateSession: dto.dateSession ? new Date(dto.dateSession) : null,
            lieu: dto.lieu ?? null,
            statut: dto.statut ?? null,
        }));
    }
    async update(id, dto) {
        const session = await this.findOne(id);
        if (dto.comiteId !== undefined) {
            const comite = dto.comiteId
                ? await this.committeeRepository.findOne({ where: { id: dto.comiteId } })
                : null;
            if (dto.comiteId && !comite) {
                throw new common_1.NotFoundException(`Committee #${dto.comiteId} not found`);
            }
            session.comite = comite;
        }
        if (dto.dateSession !== undefined) {
            session.dateSession = dto.dateSession ? new Date(dto.dateSession) : null;
        }
        if (dto.lieu !== undefined)
            session.lieu = dto.lieu ?? null;
        if (dto.statut !== undefined)
            session.statut = dto.statut ?? null;
        return this.repository.save(session);
    }
    async findAssignedToUser(userId) {
        return this.repository
            .createQueryBuilder('session')
            .leftJoinAndSelect('session.comite', 'comite')
            .leftJoinAndSelect('session.decisions', 'decisions')
            .leftJoin('comite.members', 'members')
            .leftJoin('members.employe', 'employe')
            .leftJoin('employe.user', 'user')
            .where('user.id = :userId', { userId })
            .orderBy('session.id', 'DESC')
            .getMany();
    }
    async updateAssignedReport(userId, sessionId, dto) {
        const session = await this.repository.findOne({
            where: { id: sessionId },
            relations: {
                comite: true,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Committee session #${sessionId} not found`);
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                employe: {
                    memberComites: {
                        roleComite: true,
                        comite: true,
                    },
                },
            },
        });
        const memberships = user?.employe?.memberComites ?? [];
        const membership = memberships.find((member) => (member.comiteId || member.comite?.id) === session.comite?.id);
        if (!membership) {
            throw new common_1.ForbiddenException('Session not assigned to your committee');
        }
        const roleName = `${membership.roleComite?.labelAr || ''} ${membership.roleComite?.name || ''}`.toLowerCase();
        const canEditReport = roleName.includes('مقرر') || roleName.includes('rapporteur') || roleName.includes('reporter');
        if (!canEditReport) {
            throw new common_1.ForbiddenException('Only rapporteur can edit session report');
        }
        return session;
    }
};
exports.CommitteeSessionsService = CommitteeSessionsService;
exports.CommitteeSessionsService = CommitteeSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(committee_session_entity_1.CommitteeSessionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(comite_entity_1.CommitteeEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommitteeSessionsService);
//# sourceMappingURL=committee-sessions.service.js.map