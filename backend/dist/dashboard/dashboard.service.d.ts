import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { DecisionEntity } from '../database/entities/decision.entity';
import { MemberComiteEntity } from '../database/entities/member-comite.entity';
import { SubjectDecisionEntity } from '../database/entities/subject-decision.entity';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { SessionReportEntity } from '../database/entities/session-report.entity';
export declare class DashboardService {
    private readonly dataSource;
    private readonly userRepository;
    private readonly employeRepository;
    private readonly sessionRepository;
    private readonly decisionRepository;
    private readonly memberRepository;
    private readonly subjectRepository;
    private readonly committeeRepository;
    private readonly sessionReportRepository;
    private hasCabinetWarningColumnCache;
    constructor(dataSource: DataSource, userRepository: Repository<UserEntity>, employeRepository: Repository<EmployeEntity>, sessionRepository: Repository<CommitteeSessionEntity>, decisionRepository: Repository<DecisionEntity>, memberRepository: Repository<MemberComiteEntity>, subjectRepository: Repository<SubjectDecisionEntity>, committeeRepository: Repository<CommitteeEntity>, sessionReportRepository: Repository<SessionReportEntity>);
    private hasCabinetWarningColumn;
    getDirectorStats(userId: number): Promise<{
        employeeCountByDirection: number;
        minutesPerMonth: {
            month: number;
            monthName: string;
            count: number;
        }[];
        delayedMinutes: number;
        decisionsByDirection: number;
        mostActiveCommitteeMember: {
            name: string;
            count: number;
        } | null;
        topRapporteur: {
            name: string;
            count: number;
        } | null;
        rapporteurStatsData: any[];
    }>;
    getCabinetStats(): Promise<{
        decisionsPerDirectionMonth: {
            month: number;
            direction: any;
            count: number;
        }[];
        decisionsPerSubject: {
            name: any;
            count: number;
        }[];
        committeesPerSubject: {
            name: any;
            count: number;
        }[];
        minutesPerDirection: {
            name: any;
            count: number;
        }[];
        delayedMinutesList: any[];
        delayedCount: number;
        mostDelayedEmployee: {
            name: never;
            count: number;
        } | null;
    }>;
    getUserStats(userId: number): Promise<{
        memberCommitteesDecisionsCount: number;
        rapporteurSessionsCount: number;
        completedDelayedReportsCount: number;
        employeeWarningsCount: number;
    }>;
    updateCabinetNotes(sessionId: number, body: {
        warning?: string;
    }): Promise<{
        id: number;
        cabinetWarning: string | null;
    }>;
}
