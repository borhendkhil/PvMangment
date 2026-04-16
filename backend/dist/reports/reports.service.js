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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_report_entity_1 = require("../database/entities/session-report.entity");
const report_feedback_entity_1 = require("../database/entities/report-feedback.entity");
const committee_session_entity_1 = require("../database/entities/committee-session.entity");
const user_entity_1 = require("../database/entities/user.entity");
let ReportsService = class ReportsService {
    constructor(reportRepository, feedbackRepository, sessionRepository, userRepository) {
        this.reportRepository = reportRepository;
        this.feedbackRepository = feedbackRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }
    async saveReport(sessionId, userId, dto) {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
            relations: ['comite', 'report'],
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session ${sessionId} not found`);
        }
        let report = session.report;
        if (!report) {
            report = this.reportRepository.create({
                session,
                topic: dto.topic ?? null,
                context: dto.context ?? null,
                discussion: dto.discussion ?? null,
                rowsJson: dto.rowsJson ?? null,
                statut: dto.statut ?? 'DRAFT',
            });
        }
        else {
            if (dto.topic !== undefined)
                report.topic = dto.topic ?? null;
            if (dto.context !== undefined)
                report.context = dto.context ?? null;
            if (dto.discussion !== undefined)
                report.discussion = dto.discussion ?? null;
            if (dto.rowsJson !== undefined)
                report.rowsJson = dto.rowsJson ?? null;
            if (dto.statut !== undefined)
                report.statut = dto.statut;
        }
        return this.reportRepository.save(report);
    }
    async getSessionReport(sessionId) {
        const report = await this.reportRepository
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.session', 'session')
            .leftJoinAndSelect('report.feedbacks', 'feedbacks')
            .leftJoinAndSelect('feedbacks.user', 'user')
            .where('session.id = :sessionId', { sessionId })
            .getOne();
        return report || { feedbacks: [], session: { id: sessionId } };
    }
    async getReportFeedbacks(reportId) {
        return this.feedbackRepository
            .createQueryBuilder('feedback')
            .leftJoinAndSelect('feedback.report', 'report')
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('user.employe', 'employe')
            .where('report.id = :reportId', { reportId })
            .orderBy('feedback.dateCreation', 'DESC')
            .getMany();
    }
    async initializeFeedback(reportId, userId, dto) {
        const report = await this.reportRepository.findOne({ where: { id: reportId } });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const feedback = this.feedbackRepository.create({
            report,
            user,
            type: dto.type,
            content: dto.content,
        });
        return this.feedbackRepository.save(feedback);
    }
    async deleteFeedback(feedbackId, userId) {
        const feedback = await this.feedbackRepository.findOne({ where: { id: feedbackId }, relations: ['user'] });
        if (!feedback)
            throw new common_1.NotFoundException('Feedback not found');
        await this.feedbackRepository.remove(feedback);
        return { deleted: true };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_report_entity_1.SessionReportEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(report_feedback_entity_1.ReportFeedbackEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(committee_session_entity_1.CommitteeSessionEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map