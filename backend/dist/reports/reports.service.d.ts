import { Repository } from 'typeorm';
import { SessionReportEntity } from '../database/entities/session-report.entity';
import { ReportFeedbackEntity } from '../database/entities/report-feedback.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { SaveSessionReportDto, FeedbackDto } from './dto/report.dto';
import { UserEntity } from '../database/entities/user.entity';
export declare class ReportsService {
    private readonly reportRepository;
    private readonly feedbackRepository;
    private readonly sessionRepository;
    private readonly userRepository;
    constructor(reportRepository: Repository<SessionReportEntity>, feedbackRepository: Repository<ReportFeedbackEntity>, sessionRepository: Repository<CommitteeSessionEntity>, userRepository: Repository<UserEntity>);
    saveReport(sessionId: number, userId: number, dto: SaveSessionReportDto): Promise<SessionReportEntity>;
    getSessionReport(sessionId: number): Promise<SessionReportEntity | {
        feedbacks: never[];
        session: {
            id: number;
        };
    }>;
    getReportFeedbacks(reportId: number): Promise<ReportFeedbackEntity[]>;
    initializeFeedback(reportId: number, userId: number, dto: FeedbackDto): Promise<ReportFeedbackEntity>;
    deleteFeedback(feedbackId: number, userId: number): Promise<{
        deleted: boolean;
    }>;
}
