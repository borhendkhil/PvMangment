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
exports.DecisionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path_1 = require("path");
const base_crud_service_1 = require("../common/services/base-crud.service");
const committee_session_entity_1 = require("../database/entities/committee-session.entity");
const decision_entity_1 = require("../database/entities/decision.entity");
const decision_pdf_entity_1 = require("../database/entities/decision-pdf.entity");
const subject_decision_entity_1 = require("../database/entities/subject-decision.entity");
const user_entity_1 = require("../database/entities/user.entity");
const comite_entity_1 = require("../database/entities/comite.entity");
let DecisionsService = class DecisionsService extends base_crud_service_1.BaseCrudService {
    constructor(repository, subjectRepository, sessionRepository, decisionPdfRepository, comiteRepository, userRepository) {
        super(repository);
        this.subjectRepository = subjectRepository;
        this.sessionRepository = sessionRepository;
        this.decisionPdfRepository = decisionPdfRepository;
        this.comiteRepository = comiteRepository;
        this.userRepository = userRepository;
    }
    async findAll() {
        const rows = await this.repository.find({
            relations: { subject: true, session: { comite: true }, decisionPdfs: true, comite: true },
            order: { id: 'DESC' },
        });
        return rows.map((row) => this.normalizeDecision(row));
    }
    async findAssignedToUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                employe: {
                    memberComites: {
                        comite: true,
                    },
                },
            },
        });
        const committeeIds = Array.from(new Set((user?.employe?.memberComites ?? [])
            .map((membership) => membership.comiteId || membership.comite?.id)
            .filter((id) => Number.isInteger(id) && id > 0)));
        if (!committeeIds.length) {
            return [];
        }
        const rows = await this.repository
            .createQueryBuilder('decision')
            .leftJoinAndSelect('decision.subject', 'subject')
            .leftJoinAndSelect('decision.session', 'session')
            .leftJoinAndSelect('session.comite', 'sessionComite')
            .leftJoinAndSelect('decision.decisionPdfs', 'decisionPdfs')
            .leftJoinAndSelect('decision.comite', 'decisionComite')
            .where('decisionComite.id IN (:...committeeIds)', { committeeIds })
            .orWhere('sessionComite.id IN (:...committeeIds)', { committeeIds })
            .distinct(true)
            .orderBy('decision.id', 'DESC')
            .getMany();
        return rows.map((row) => this.normalizeDecision(row));
    }
    async findOne(id) {
        const decision = await this.repository.findOne({
            where: { id },
            relations: {
                subject: true,
                session: { comite: true },
                decisionPdfs: true,
                comite: true,
            },
        });
        if (!decision) {
            throw new common_1.NotFoundException(`Decision #${id} not found`);
        }
        return this.normalizeDecision(decision);
    }
    async findCurrentDecision(sessionId) {
        const decision = await this.repository.findOne({
            where: {
                session: { id: sessionId },
                current: true,
            },
            relations: { subject: true, session: { comite: true }, decisionPdfs: true, comite: true },
        });
        return decision ? this.normalizeDecision(decision) : null;
    }
    async create(dto) {
        const subject = dto.sujetId
            ? await this.subjectRepository.findOne({ where: { id: dto.sujetId } })
            : null;
        const session = dto.sessionId
            ? await this.sessionRepository.findOne({ where: { id: dto.sessionId } })
            : null;
        const comite = dto.comiteId
            ? await this.comiteRepository.findOne({ where: { id: dto.comiteId } })
            : null;
        if (dto.sujetId && !subject) {
            throw new common_1.NotFoundException(`Subject decision #${dto.sujetId} not found`);
        }
        if (dto.sessionId && !session) {
            throw new common_1.NotFoundException(`Committee session #${dto.sessionId} not found`);
        }
        if (dto.comiteId && !comite) {
            throw new common_1.NotFoundException(`Committee #${dto.comiteId} not found`);
        }
        const saved = await this.repository.save(this.repository.create({
            subject,
            session,
            comite,
            numAdmin: dto.numAdmin ?? null,
            titre: dto.titre ?? null,
            description: dto.description ?? null,
            recommendationText: dto.recommendationText ?? null,
            executionStructure: dto.executionStructure ?? null,
            deadlineText: dto.deadlineText ?? null,
            fichierPath: dto.fichierPath ?? null,
            fichierName: this.normalizeFileName(dto.fichierName ?? null),
            statut: dto.statut ?? null,
            current: dto.current ?? false,
            dateUpload: dto.dateUpload ? new Date(dto.dateUpload) : null,
        }));
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const decision = await this.findOne(id);
        if (dto.sujetId !== undefined) {
            if (dto.sujetId) {
                const subject = await this.subjectRepository.findOne({ where: { id: dto.sujetId } });
                if (!subject) {
                    throw new common_1.NotFoundException(`Subject decision #${dto.sujetId} not found`);
                }
                decision.subject = subject;
            }
            else {
                decision.subject = null;
            }
        }
        if (dto.sessionId !== undefined) {
            if (dto.sessionId) {
                const session = await this.sessionRepository.findOne({ where: { id: dto.sessionId } });
                if (!session) {
                    throw new common_1.NotFoundException(`Committee session #${dto.sessionId} not found`);
                }
                decision.session = session;
            }
            else {
                decision.session = null;
            }
        }
        if (dto.comiteId !== undefined) {
            if (dto.comiteId) {
                const comite = await this.comiteRepository.findOne({ where: { id: dto.comiteId } });
                if (!comite) {
                    throw new common_1.NotFoundException(`Committee #${dto.comiteId} not found`);
                }
                decision.comite = comite;
            }
            else {
                decision.comite = null;
            }
        }
        if (dto.numAdmin !== undefined)
            decision.numAdmin = dto.numAdmin ?? null;
        if (dto.titre !== undefined)
            decision.titre = dto.titre ?? null;
        if (dto.description !== undefined)
            decision.description = dto.description ?? null;
        if (dto.recommendationText !== undefined)
            decision.recommendationText = dto.recommendationText ?? null;
        if (dto.executionStructure !== undefined)
            decision.executionStructure = dto.executionStructure ?? null;
        if (dto.deadlineText !== undefined)
            decision.deadlineText = dto.deadlineText ?? null;
        if (dto.fichierPath !== undefined)
            decision.fichierPath = dto.fichierPath ?? null;
        if (dto.fichierName !== undefined)
            decision.fichierName = this.normalizeFileName(dto.fichierName ?? null);
        if (dto.statut !== undefined)
            decision.statut = dto.statut ?? null;
        if (dto.current !== undefined)
            decision.current = dto.current;
        if (dto.dateUpload !== undefined) {
            decision.dateUpload = dto.dateUpload ? new Date(dto.dateUpload) : null;
        }
        const saved = await this.repository.save(decision);
        return this.findOne(saved.id);
    }
    async updateAssignedReportRow(userId, decisionId, dto) {
        const decision = await this.repository.findOne({
            where: { id: decisionId },
            relations: {
                comite: true,
                session: { comite: true },
            },
        });
        if (!decision) {
            throw new common_1.NotFoundException(`Decision #${decisionId} not found`);
        }
        const committeeId = decision.comite?.id || decision.session?.comite?.id;
        if (!committeeId) {
            throw new common_1.ForbiddenException('This decision is not linked to a committee session');
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
        const membership = memberships.find((member) => (member.comiteId || member.comite?.id) === committeeId);
        if (!membership) {
            throw new common_1.ForbiddenException('Decision not assigned to your committee');
        }
        const roleName = `${membership.roleComite?.labelAr || ''} ${membership.roleComite?.name || ''}`.toLowerCase();
        const canEditReport = roleName.includes('\u0645\u0642\u0631\u0631') ||
            roleName.includes('rapporteur') ||
            roleName.includes('reporter');
        if (!canEditReport) {
            throw new common_1.ForbiddenException('Only rapporteur can edit session report rows');
        }
        if (dto.recommendationText !== undefined) {
            decision.recommendationText = dto.recommendationText ?? null;
        }
        if (dto.executionStructure !== undefined) {
            decision.executionStructure = dto.executionStructure ?? null;
        }
        if (dto.deadlineText !== undefined) {
            decision.deadlineText = dto.deadlineText ?? null;
        }
        const saved = await this.repository.save(decision);
        return this.findOne(saved.id);
    }
    async createDecisionPdf(dto) {
        const decision = await this.findOne(dto.decisionId);
        const pdfName = this.normalizeFileName(dto.pdfName ?? null);
        const pdf = this.decisionPdfRepository.create({
            decision,
            pdfPath: dto.pdfPath,
            pdfName,
        });
        const savedPdf = await this.decisionPdfRepository.save(pdf);
        await this.repository.update(decision.id, {
            fichierPath: savedPdf.pdfPath,
            fichierName: pdfName ?? decision.fichierName,
            dateUpload: savedPdf.dateUpload,
        });
        return this.normalizeDecisionPdf(savedPdf);
    }
    async addDecisionPdfs(decisionId, files) {
        const decision = await this.findOne(decisionId);
        const rows = files.map((file) => this.decisionPdfRepository.create({
            decision,
            pdfPath: this.normalizeDecisionPdfPath(file),
            pdfName: this.normalizeFileName(file.originalname ?? file.filename ?? null),
        }));
        const savedRows = await this.decisionPdfRepository.save(rows);
        const lastPdf = savedRows[savedRows.length - 1];
        if (lastPdf) {
            await this.repository.update(decision.id, {
                fichierPath: lastPdf.pdfPath,
                fichierName: lastPdf.pdfName ?? decision.fichierName,
                dateUpload: lastPdf.dateUpload,
            });
        }
        return savedRows.map((row) => this.normalizeDecisionPdf(row));
    }
    normalizeDecisionPdfPath(file) {
        if (file.path) {
            return `/uploads/decision-pdfs/${(0, path_1.basename)(file.path)}`;
        }
        if (file.filename) {
            return `/uploads/decision-pdfs/${file.filename}`;
        }
        if (file.originalname) {
            return `/uploads/decision-pdfs/${file.originalname}`;
        }
        return '';
    }
    async findAllDecisionPdfs() {
        const rows = await this.decisionPdfRepository.find({
            relations: { decision: true },
            order: { id: 'ASC' },
        });
        return rows.map((row) => this.normalizeDecisionPdf(row));
    }
    async findDecisionPdf(id) {
        const row = await this.decisionPdfRepository.findOne({
            where: { id },
            relations: { decision: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Decision PDF #${id} not found`);
        }
        return this.normalizeDecisionPdf(row);
    }
    async findDecisionPdfBySafeName(safeName) {
        const row = await this.decisionPdfRepository.findOne({
            where: { pdfPath: `/uploads/decision-pdfs/${safeName}` },
        });
        return row ? this.normalizeDecisionPdf(row) : null;
    }
    async updateDecisionPdf(id, dto) {
        const row = await this.findDecisionPdf(id);
        if (dto.decisionId !== undefined && dto.decisionId) {
            const decision = await this.repository.findOne({ where: { id: dto.decisionId } });
            if (!decision) {
                throw new common_1.NotFoundException(`Decision #${dto.decisionId} not found`);
            }
            row.decision = decision;
        }
        if (dto.pdfPath !== undefined)
            row.pdfPath = dto.pdfPath;
        if (dto.pdfName !== undefined)
            row.pdfName = this.normalizeFileName(dto.pdfName ?? null);
        const savedRow = await this.decisionPdfRepository.save(row);
        return this.normalizeDecisionPdf(savedRow);
    }
    async removeDecisionPdf(id) {
        const row = await this.findDecisionPdf(id);
        await this.decisionPdfRepository.remove(row);
    }
    normalizeDecision(decision) {
        decision.fichierName = this.normalizeFileName(decision.fichierName);
        if (decision.decisionPdfs?.length) {
            decision.decisionPdfs = decision.decisionPdfs.map((pdf) => {
                pdf.pdfName = this.normalizeFileName(pdf.pdfName);
                return pdf;
            });
        }
        return decision;
    }
    normalizeDecisionPdf(pdf) {
        pdf.pdfName = this.normalizeFileName(pdf.pdfName);
        if (pdf.decision) {
            pdf.decision.fichierName = this.normalizeFileName(pdf.decision.fichierName);
        }
        return pdf;
    }
    normalizeFileName(fileName) {
        if (!fileName) {
            return fileName;
        }
        const looksMisencoded = /(?:\u00C3|\u00D8|\u00D9|\u00D0|\u00D1|\uFFFD|[\u0080-\u009F])/.test(fileName);
        if (!looksMisencoded) {
            return fileName;
        }
        try {
            const decoded = Buffer.from(fileName, 'latin1').toString('utf8');
            return decoded && !decoded.includes('\uFFFD') ? decoded : fileName;
        }
        catch {
            return fileName;
        }
    }
};
exports.DecisionsService = DecisionsService;
exports.DecisionsService = DecisionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(decision_entity_1.DecisionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(subject_decision_entity_1.SubjectDecisionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(committee_session_entity_1.CommitteeSessionEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(decision_pdf_entity_1.DecisionPdfEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(comite_entity_1.CommitteeEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DecisionsService);
//# sourceMappingURL=decisions.service.js.map