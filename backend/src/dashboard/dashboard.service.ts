import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { DecisionEntity } from '../database/entities/decision.entity';
import { MemberComiteEntity } from '../database/entities/member-comite.entity';
import { SubjectDecisionEntity } from '../database/entities/subject-decision.entity';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { RoleComiteEntity } from '../database/entities/role-comite.entity';
import { DirectionEntity } from '../database/entities/direction.entity';
import { SessionReportEntity } from '../database/entities/session-report.entity';

@Injectable()
export class DashboardService {
  private hasCabinetWarningColumnCache: boolean | null = null;

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EmployeEntity)
    private readonly employeRepository: Repository<EmployeEntity>,
    @InjectRepository(CommitteeSessionEntity)
    private readonly sessionRepository: Repository<CommitteeSessionEntity>,
    @InjectRepository(DecisionEntity)
    private readonly decisionRepository: Repository<DecisionEntity>,
    @InjectRepository(MemberComiteEntity)
    private readonly memberRepository: Repository<MemberComiteEntity>,
    @InjectRepository(SubjectDecisionEntity)
    private readonly subjectRepository: Repository<SubjectDecisionEntity>,
    @InjectRepository(CommitteeEntity)
    private readonly committeeRepository: Repository<CommitteeEntity>,
    @InjectRepository(SessionReportEntity)
    private readonly sessionReportRepository: Repository<SessionReportEntity>,
  ) {}

  private async hasCabinetWarningColumn(): Promise<boolean> {
    if (this.hasCabinetWarningColumnCache !== null) {
      return this.hasCabinetWarningColumnCache;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      this.hasCabinetWarningColumnCache = await queryRunner.hasColumn('comite_session', 'cabinet_warning');
      return this.hasCabinetWarningColumnCache;
    } catch {
      this.hasCabinetWarningColumnCache = false;
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async getDirectorStats(userId: number) {
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

    // 1. Employee Count
    const employeeCountByDirection = await this.employeRepository.count({
      where: { direction: { id: directionId } },
    });

    // 2. Minutes Per Month
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

    // 3. Delayed Minutes
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

    // 4. Decisions By Direction
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

    // 5. Most Active Committee Member
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

    // 6. Top Rapporteur
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

    // 7 & 8. Rapporteur Stats (Sessions count and separation)
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
    let rapporteurStatsData: any[] = [];

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

      const grouped: Record<number, Date[]> = {};
      rapporteurSessionsRaw.forEach(row => {
        if (!grouped[row.employeId]) grouped[row.employeId] = [];
        grouped[row.employeId].push(new Date(row.date));
      });

      rapporteurStatsRaw.forEach(r => {
        const dates = grouped[r.employeId] || [];
        const sessionCount = dates.length;
        let avgDays = 0;
        if (dates.length > 1) {
          let totalDiff = 0;
          for(let i=1; i<dates.length; i++) {
            totalDiff += (dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24);
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

    // 1. Decisions per direction per month
    const decisionsDirectionMonthRaw = await this.decisionRepository.createQueryBuilder('decision')
      .select('MONTH(decision.date_creation)', 'month')
      .addSelect('direction.lib', 'directionName')
      .addSelect('COUNT(DISTINCT decision.id)', 'count')
      .leftJoin('decision.comite', 'comite')
      .leftJoin('decision.session', 'session')
      .leftJoin('session.comite', 'sessionComite')
      .innerJoin(MemberComiteEntity, 'member', 'member.comite_id = comite.id OR member.comite_id = sessionComite.id')
      .innerJoin(RoleComiteEntity, 'roleComite', 'roleComite.id = member.role_comite_id')
      .innerJoin(EmployeEntity, 'employe', 'employe.id = member.employe_id')
      .innerJoin(DirectionEntity, 'direction', 'direction.id = employe.direction_id')
      .where('(roleComite.name = :roleName OR roleComite.labelAr LIKE :labelAr)', { roleName: 'rapporteur', labelAr: '%مقرر%' })
      .groupBy('MONTH(decision.date_creation)')
      .addGroupBy('direction.lib')
      .getRawMany();

    const decisionsPerDirectionMonth = decisionsDirectionMonthRaw.map(row => ({
      month: parseInt(row.month),
      direction: row.directionName,
      count: parseInt(row.count)
    }));

    // 2. Decisions per subject
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

    // 3. Committees per subject
    // A subject is handled by committees making decisions about it
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

    // 4. Minutes per Direction (Rapporteur)
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

    // 5 & 8. Delayed minutes list (> 48h) + Employee names
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

    const delayedMinutesList: any[] = [];
    const employeDelays: Record<number, number> = {};

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

  async getUserStats(userId: number) {
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
      .innerJoin(
        MemberComiteEntity,
        'member',
        '(member.comite_id = comite.id OR member.comite_id = sessionComite.id) AND member.employe_id = :employeId',
        { employeId },
      )
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
    } catch (error) {
      console.error('Dashboard user stats failed, returning defaults', error);
      return defaultResponse;
    }
  }

  async updateCabinetNotes(sessionId: number, body: { warning?: string }) {
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
        throw new BadRequestException(
          'Database column comite_session.cabinet_warning is missing. Apply db/migration_cabinet_warning.sql first.',
        );
      }

      await this.sessionRepository
        .createQueryBuilder()
        .update(CommitteeSessionEntity)
        .set({ cabinetWarning: body.warning })
        .where('id = :id', { id: sessionId })
        .execute();
    }

    return {
      id: sessionId,
      cabinetWarning: body.warning ?? null,
    };
  }
}
