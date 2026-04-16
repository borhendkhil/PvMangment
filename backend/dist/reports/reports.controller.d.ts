import { ReportsService } from './reports.service';
import { SaveSessionReportDto, FeedbackDto } from './dto/report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getReport(sessionId: number): Promise<import("../database/entities/session-report.entity").SessionReportEntity | {
        feedbacks: never[];
        session: {
            id: number;
        };
    }>;
    saveReport(req: any, sessionId: number, dto: SaveSessionReportDto): Promise<import("../database/entities/session-report.entity").SessionReportEntity>;
    getFeedbacks(reportId: number): Promise<import("../database/entities/report-feedback.entity").ReportFeedbackEntity[]>;
    createFeedback(req: any, reportId: number, dto: FeedbackDto): Promise<import("../database/entities/report-feedback.entity").ReportFeedbackEntity>;
    deleteFeedback(req: any, feedbackId: number): Promise<{
        deleted: boolean;
    }>;
}
