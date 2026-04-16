import { SessionReportEntity } from './session-report.entity';
import { UserEntity } from './user.entity';
export declare class ReportFeedbackEntity {
    id: number;
    report: SessionReportEntity;
    user: UserEntity | null;
    type: string;
    content: string;
    dateCreation: Date;
}
