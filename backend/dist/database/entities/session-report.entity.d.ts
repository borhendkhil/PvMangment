import { CommitteeSessionEntity } from './committee-session.entity';
import { ReportFeedbackEntity } from './report-feedback.entity';
export declare class SessionReportEntity {
    id: number;
    session: CommitteeSessionEntity;
    topic: string | null;
    context: string | null;
    discussion: string | null;
    rowsJson: string | null;
    statut: string;
    dateCreation: Date;
    feedbacks: ReportFeedbackEntity[];
}
