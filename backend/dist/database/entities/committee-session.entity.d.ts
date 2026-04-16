import { CommitteeEntity } from './comite.entity';
import { DecisionEntity } from './decision.entity';
import { SessionReportEntity } from './session-report.entity';
export declare class CommitteeSessionEntity {
    id: number;
    comite: CommitteeEntity;
    dateSession: Date | null;
    lieu: string | null;
    statut: string | null;
    cabinetWarning: string | null;
    report: SessionReportEntity;
    decisions: DecisionEntity[];
}
