import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDirectorStats(req: any): Promise<{
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
    getUserStats(req: any): Promise<{
        memberCommitteesDecisionsCount: number;
        rapporteurSessionsCount: number;
        completedDelayedReportsCount: number;
        employeeWarningsCount: number;
    }>;
    updateCabinetNotes(id: number, body: {
        notes?: string;
        warning?: string;
    }): Promise<{
        id: number;
        cabinetWarning: string | null;
    }>;
}
