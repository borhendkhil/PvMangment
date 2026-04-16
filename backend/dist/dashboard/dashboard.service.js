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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entities/user.entity");
const employe_entity_1 = require("../database/entities/employe.entity");
const committee_session_entity_1 = require("../database/entities/committee-session.entity");
const decision_entity_1 = require("../database/entities/decision.entity");
const member_comite_entity_1 = require("../database/entities/member-comite.entity");
const subject_decision_entity_1 = require("../database/entities/subject-decision.entity");
const comite_entity_1 = require("../database/entities/comite.entity");
const role_comite_entity_1 = require("../database/entities/role-comite.entity");
const direction_entity_1 = require("../database/entities/direction.entity");
const session_report_entity_1 = require("../database/entities/session-report.entity");
let DashboardService = class DashboardService {
    constructor(dataSource, userRepository, employeRepository, sessionRepository, decisionRepository, memberRepository, subjectRepository, committeeRepository, sessionReportRepository) {
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.employeRepository = employeRepository;
        this.sessionRepository = sessionRepository;
        this.decisionRepository = decisionRepository;
        this.memberRepository = memberRepository;
        this.subjectRepository = subjectRepository;
        this.committeeRepository = committeeRepository;
        this.sessionReportRepository = sessionReportRepository;
        this.hasCabinetWarningColumnCache = null;
    }
    async hasCabinetWarningColumn() {
        if (this.hasCabinetWarningColumnCache !== null) {
            return this.hasCabinetWarningColumnCache;
        }
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            this.hasCabinetWarningColumnCache = await queryRunner.hasColumn('comite_session', 'cabinet_warning');
            return this.hasCabinetWarningColumnCache;
        }
        catch {
            this.hasCabinetWarningColumnCache = false;
            return false;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getDirectorStats(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['employe', 'employe.direction'],
        });
        const defaultResponse = {
            employeeCountByDirection: 0,
            minutesPerMonth: [],
            delayedMinutes: 0,
            decisionsByDirection: 0,
            mostActiveCommitteeMember: null,
            topRapporteur: null,
            rapporteurStatsData: [],
        };
        if (!user || !user.employe || !user.employe.direction) {
            return defaultResponse;
        }
        const directionId = user.employe.direction.id;
        const employeeCountByDirection = await this.employeRepository.count({
            where: { direction: { id: directionId } },
        });
        const minutesPerMonthRaw = await this.sessionRepository.createQueryBuilder('session')
            .select('MONTH(session.date_session)', 'month')
            .addSelect('COUNT(DISTINCT session.id)', 'count')
            .innerJoin('session.comite', 'comite')
            .innerJoin('comite.members', 'member')
            .innerJoin('member.employe', 'employe')
            .where('employe.direction_id = :directionId', { directionId })
            .andWhere('session.date_session IS NOT NULL')
            .groupBy('MONTH(session.date_session)')
            .getRawMany();
        const minutesPerMonth = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            monthName: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][i],
            count: 0
        }));
        minutesPerMonthRaw.forEach(row => {
            const monthIdx = parseInt(row.month) - 1;
            if (monthIdx >= 0 && monthIdx < 12) {
                minutesPerMonth[monthIdx].count = parseInt(row.count);
            }
        });
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const delayedMinutesRaw = await this.sessionRepository.createQueryBuilder('session')
            .select('COUNT(DISTINCT session.id)', 'count')
            .innerJoin('session.comite', 'comite')
            .innerJoin('comite.members', 'member')
            .innerJoin('member.employe', 'employe')
            .where('employe.direction_id = :directionId', { directionId })
            .andWhere('session.date_session < :date', { date: fortyEightHoursAgo })
            .andWhere('(session.statut IS NULL OR session.statut != :st)', { st: 'completed' })
            .getRawOne();
        const delayedMinutes = parseInt(delayedMinutesRaw?.count || '0');
        const decisionsByDirectionRaw = await this.decisionRepository.createQueryBuilder('decision')
            .select('COUNT(DISTINCT decision.id)', 'count')
            .leftJoin('decision.comite', 'comite')
            .leftJoin('decision.session', 'session')
            .leftJoin('session.comite', 'sessionComite')
            .innerJoin('membre_comite', 'member', 'member.comite_id = comite.id OR member.comite_id = sessionComite.id')
            .innerJoin('employe', 'employe', 'employe.id = member.employe_id')
            .where('employe.direction_id = :directionId', { directionId })
            .getRawOne();
        const decisionsByDirection = parseInt(decisionsByDirectionRaw?.count || '0');
        const activeMemberRaw = await this.memberRepository.createQueryBuilder('member')
            .select('member.employe_id', 'employeId')
            .addSelect('employe.nom', 'nom')
            .addSelect('employe.prenom', 'prenom')
            .addSelect('COUNT(member.comite_id)', 'count')
            .innerJoin('member.employe', 'employe')
            .where('employe.direction_id = :directionId', { directionId })
            .groupBy('member.employe_id')
            .addGroupBy('employe.nom')
            .addGroupBy('employe.prenom')
            .orderBy('count', 'DESC')
            .limit(1)
            .getRawOne();
        const mostActiveCommitteeMember = activeMemberRaw ? {
            name: `${activeMemberRaw.prenom} ${activeMemberRaw.nom}`,
            count: parseInt(activeMemberRaw.count)
        } : null;
        const topRapporteurRaw = await this.memberRepository.createQueryBuilder('member')
            .select('member.employe_id', 'employeId')
            .addSelect('employe.nom', 'nom')
            .addSelect('employe.prenom', 'prenom')
            .addSelect('COUNT(member.comite_id)', 'count')
            .innerJoin('member.employe', 'employe')
            .innerJoin('member.roleComite', 'roleComite')
            .where('employe.direction_id = :directionId', { directionId })
            .andWhere('(roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', { roleName: 'rapporteur', labelAr: '%مقرر%' })
            .groupBy('member.employe_id')
            .addGroupBy('employe.nom')
            .addGroupBy('employe.prenom')
            .orderBy('count', 'DESC')
            .limit(1)
            .getRawOne();
        const topRapporteur = topRapporteurRaw ? {
            name: `${topRapporteurRaw.prenom} ${topRapporteurRaw.nom}`,
            count: parseInt(topRapporteurRaw.count)
        } : null;
        const rapporteurStatsRaw = await this.memberRepository.createQueryBuilder('member')
            .select('member.employe_id', 'employeId')
            .addSelect('employe.nom', 'nom')
            .addSelect('employe.prenom', 'prenom')
            .innerJoin('member.employe', 'employe')
            .innerJoin('member.roleComite', 'roleComite')
            .where('employe.direction_id = :directionId', { directionId })
            .andWhere('(roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', { roleName: 'rapporteur', labelAr: '%مقرر%' })
            .groupBy('member.employe_id')
            .addGroupBy('employe.nom')
            .addGroupBy('employe.prenom')
            .getRawMany();
        const rapporteurIds = rapporteurStatsRaw.map(r => r.employeId);
        let rapporteurStatsData = [];
        if (rapporteurIds.length > 0) {
            const rapporteurSessionsRaw = await this.sessionRepository.createQueryBuilder('session')
                .select('session.date_session', 'date')
                .addSelect('member.employe_id', 'employeId')
                .innerJoin('session.comite', 'comite')
                .innerJoin('comite.members', 'member')
                .where('member.employe_id IN (:...ids)', { ids: rapporteurIds })
                .andWhere('session.date_session IS NOT NULL')
                .orderBy('session.date_session', 'ASC')
                .getRawMany();
            const grouped = {};
            rapporteurSessionsRaw.forEach(row => {
                if (!grouped[row.employeId])
                    grouped[row.employeId] = [];
                grouped[row.employeId].push(new Date(row.date));
            });
            rapporteurStatsRaw.forEach(r => {
                const dates = grouped[r.employeId] || [];
                const sessionCount = dates.length;
                let avgDays = 0;
                if (dates.length > 1) {
                    let totalDiff = 0;
                    for (let i = 1; i < dates.length; i++) {
                        totalDiff += (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
                    }
                    avgDays = Math.round(totalDiff / (dates.length - 1));
                }
                rapporteurStatsData.push({
                    name: `${r.prenom} ${r.nom}`,
                    sessionCount: sessionCount,
                    averageDaysSpacing: avgDays
                });
            });
        }
        return {
            employeeCountByDirection,
            minutesPerMonth,
            delayedMinutes,
            decisionsByDirection,
            mostActiveCommitteeMember,
            topRapporteur,
            rapporteurStatsData,
        };
    }
    async getCabinetStats() {
        const hasCabinetWarningColumn = await this.hasCabinetWarningColumn();
        const decisionsDirectionMonthRaw = await this.decisionRepository.createQueryBuilder('decision')
            .select('MONTH(decision.date_creation)', 'month')
            .addSelect('direction.lib', 'directionName')
            .addSelect('COUNT(DISTINCT decision.id)', 'count')
            .leftJoin('decision.comite', 'comite')
            .leftJoin('decision.session', 'session')
            .leftJoin('session.comite', 'sessionComite')
            .innerJoin(member_comite_entity_1.MemberComiteEntity, 'member', 'member.comite_id = comite.id OR member.comite_id = sessionComite.id')
            .innerJoin(role_comite_entity_1.RoleComiteEntity, 'roleComite', 'roleComite.id = member.role_comite_id')
            .innerJoin(employe_entity_1.EmployeEntity, 'employe', 'employe.id = member.employe_id')
            .innerJoin(direction_entity_1.DirectionEntity, 'direction', 'direction.id = employe.direction_id')
            .where('(roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', { roleName: 'rapporteur', labelAr: '%مقرر%' })
            .groupBy('MONTH(decision.date_creation)')
            .addGroupBy('direction.lib')
            .getRawMany();
        const decisionsPerDirectionMonth = decisionsDirectionMonthRaw.map(row => ({
            month: parseInt(row.month),
            direction: row.directionName,
            count: parseInt(row.count)
        }));
        const decisionsPerSubjectRaw = await this.decisionRepository.createQueryBuilder('decision')
            .select('subject.sujet', 'subjectName')
            .addSelect('COUNT(decision.id)', 'count')
            .innerJoin('decision.subject', 'subject')
            .groupBy('subject.id')
            .addGroupBy('subject.sujet')
            .getRawMany();
        const decisionsPerSubject = decisionsPerSubjectRaw.map(row => ({
            name: row.subjectName,
            count: parseInt(row.count)
        }));
        const committeesPerSubjectRaw = await this.decisionRepository.createQueryBuilder('decision')
            .select('subject.sujet', 'subjectName')
            .addSelect('COUNT(DISTINCT COALESCE(decision.comite_id, session.comite_id))', 'count')
            .leftJoin('decision.session', 'session')
            .innerJoin('decision.subject', 'subject')
            .groupBy('subject.id')
            .addGroupBy('subject.sujet')
            .getRawMany();
        const committeesPerSubject = committeesPerSubjectRaw.map(row => ({
            name: row.subjectName,
            count: parseInt(row.count)
        }));
        const minutesPerDirectionRaw = await this.sessionRepository.createQueryBuilder('session')
            .select('direction.lib', 'directionName')
            .addSelect('COUNT(DISTINCT session.id)', 'count')
            .innerJoin('session.comite', 'comite')
            .innerJoin('comite.members', 'member')
            .innerJoin('member.roleComite', 'roleComite')
            .innerJoin('member.employe', 'employe')
            .innerJoin('employe.direction', 'direction')
            .where('(roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', { roleName: 'rapporteur', labelAr: '%مقرر%' })
            .groupBy('direction.id')
            .addGroupBy('direction.lib')
            .getRawMany();
        const minutesPerDirection = minutesPerDirectionRaw.map(row => ({
            name: row.directionName,
            count: parseInt(row.count)
        }));
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const delayedMinutesRaw = await this.sessionRepository.createQueryBuilder('session')
            .select('session.id', 'sessionId')
            .addSelect('session.date_session', 'sessionDate')
            .addSelect('session.lieu', 'lieu')
            .addSelect(hasCabinetWarningColumn ? 'session.cabinet_warning' : 'NULL', 'cabinetWarning')
            .addSelect('comite.titre', 'comiteName')
            .addSelect('employe.nom', 'nom')
            .addSelect('employe.prenom', 'prenom')
            .addSelect('employe.id', 'employeId')
            .innerJoin('session.comite', 'comite')
            .leftJoin('comite.members', 'member')
            .leftJoin('member.roleComite', 'roleComite')
            .leftJoin('member.employe', 'employe')
            .where('session.date_session < :date', { date: fortyEightHoursAgo })
            .andWhere('(session.statut IS NULL OR session.statut != :st)', { st: 'completed' })
            .andWhere('(roleComite.id IS NULL OR roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', { roleName: 'rapporteur', labelAr: '%مقرر%' })
            .getRawMany();
        const delayedMinutesList = [];
        const employeDelays = {};
        let mostDelayedEmployeeCount = 0;
        let mostDelayedEmployeeName = null;
        delayedMinutesRaw.forEach(row => {
            const isRapporteur = !!row.nom;
            const employeeName = isRapporteur ? `${row.prenom} ${row.nom}` : 'غير محدد';
            const employeId = row.employeId;
            const diffMs = Date.now() - new Date(row.sessionDate).getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            delayedMinutesList.push({
                id: row.sessionId,
                comiteName: row.comiteName,
                sessionDate: row.sessionDate,
                delayedHours: diffHours,
                rapporteurName: employeeName,
                cabinetWarning: row.cabinetWarning ?? null,
            });
            if (isRapporteur && employeId) {
                employeDelays[employeId] = (employeDelays[employeId] || 0) + 1;
                if (employeDelays[employeId] > mostDelayedEmployeeCount) {
                    mostDelayedEmployeeCount = employeDelays[employeId];
                    mostDelayedEmployeeName = employeeName;
                }
            }
        });
        const mostDelayedEmployee = mostDelayedEmployeeName ? {
            name: mostDelayedEmployeeName,
            count: mostDelayedEmployeeCount
        } : null;
        return {
            decisionsPerDirectionMonth,
            decisionsPerSubject,
            committeesPerSubject,
            minutesPerDirection,
            delayedMinutesList,
            delayedCount: delayedMinutesList.length,
            mostDelayedEmployee,
        };
    }
    async getUserStats(userId) {
        const defaultResponse = {
            memberCommitteesDecisionsCount: 0,
            rapporteurSessionsCount: 0,
            completedDelayedReportsCount: 0,
            employeeWarningsCount: 0,
        };
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['employe'],
        });
        const employeId = user?.employe?.id;
        if (!employeId) {
            return defaultResponse;
        }
        try {
            const memberCommitteesDecisionsRaw = await this.decisionRepository
                .createQueryBuilder('decision')
                .select('COUNT(DISTINCT decision.id)', 'count')
                .leftJoin('decision.comite', 'comite')
                .leftJoin('decision.session', 'session')
                .leftJoin('session.comite', 'sessionComite')
                .innerJoin(member_comite_entity_1.MemberComiteEntity, 'member', '(member.comite_id = comite.id OR member.comite_id = sessionComite.id) AND member.employe_id = :employeId', { employeId })
                .getRawOne();
            const rapporteurSessionsRaw = await this.sessionRepository
                .createQueryBuilder('session')
                .select('COUNT(DISTINCT session.id)', 'count')
                .innerJoin('session.comite', 'comite')
                .innerJoin('comite.members', 'member')
                .innerJoin('member.roleComite', 'roleComite')
                .where('member.employe_id = :employeId', { employeId })
                .andWhere('(roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', {
                roleName: 'rapporteur',
                labelAr: '%مقرر%',
            })
                .getRawOne();
            const completedDelayedReportsRaw = await this.sessionReportRepository
                .createQueryBuilder('report')
                .select('COUNT(DISTINCT report.id)', 'count')
                .innerJoin('report.session', 'session')
                .innerJoin('session.comite', 'comite')
                .innerJoin('comite.members', 'member')
                .innerJoin('member.roleComite', 'roleComite')
                .where('member.employe_id = :employeId', { employeId })
                .andWhere('(roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', {
                roleName: 'rapporteur',
                labelAr: '%مقرر%',
            })
                .andWhere('session.date_session IS NOT NULL')
                .andWhere('report.date_creation IS NOT NULL')
                .andWhere('report.date_creation > DATE_ADD(session.date_session, INTERVAL 48 HOUR)')
                .getRawOne();
            const hasCabinetWarningColumn = await this.hasCabinetWarningColumn();
            let employeeWarningsCount = 0;
            if (hasCabinetWarningColumn) {
                const employeeWarningsRaw = await this.sessionRepository
                    .createQueryBuilder('session')
                    .select('COUNT(DISTINCT session.id)', 'count')
                    .innerJoin('session.comite', 'comite')
                    .innerJoin('comite.members', 'member')
                    .where('member.employe_id = :employeId', { employeId })
                    .andWhere('session.cabinet_warning IS NOT NULL')
                    .andWhere("TRIM(session.cabinet_warning) != ''")
                    .getRawOne();
                employeeWarningsCount = parseInt(employeeWarningsRaw?.count || '0');
            }
            return {
                memberCommitteesDecisionsCount: parseInt(memberCommitteesDecisionsRaw?.count || '0'),
                rapporteurSessionsCount: parseInt(rapporteurSessionsRaw?.count || '0'),
                completedDelayedReportsCount: parseInt(completedDelayedReportsRaw?.count || '0'),
                employeeWarningsCount,
            };
        }
        catch (error) {
            console.error('Dashboard user stats failed, returning defaults', error);
            return defaultResponse;
        }
    }
    async updateCabinetNotes(sessionId, body) {
        const session = await this.sessionRepository
            .createQueryBuilder('session')
            .select('session.id', 'id')
            .where('session.id = :id', { id: sessionId })
            .getRawOne();
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }
        if (body.warning !== undefined) {
            const hasCabinetWarningColumn = await this.hasCabinetWarningColumn();
            if (!hasCabinetWarningColumn) {
                throw new common_1.BadRequestException('Database column comite_session.cabinet_warning is missing. Apply db/migration_cabinet_warning.sql first.');
            }
            await this.sessionRepository
                .createQueryBuilder()
                .update(committee_session_entity_1.CommitteeSessionEntity)
                .set({ cabinetWarning: body.warning })
                .where('id = :id', { id: sessionId })
                .execute();
        }
        return {
            id: sessionId,
            cabinetWarning: body.warning ?? null,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(employe_entity_1.EmployeEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(committee_session_entity_1.CommitteeSessionEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(decision_entity_1.DecisionEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(member_comite_entity_1.MemberComiteEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(subject_decision_entity_1.SubjectDecisionEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(comite_entity_1.CommitteeEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(session_report_entity_1.SessionReportEntity)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map