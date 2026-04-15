import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { DecisionEntity } from '../database/entities/decision.entity';
import { MemberComiteEntity } from '../database/entities/member-comite.entity';

@Injectable()
export class DashboardService {
  constructor(
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
  ) {}

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
}
