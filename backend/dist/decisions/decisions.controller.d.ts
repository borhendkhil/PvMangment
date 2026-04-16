import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateDecisionDto, UpdateDecisionAssignedReportDto, UpdateDecisionDto } from './dto/decision.dto';
import { DecisionsService } from './decisions.service';
export declare class DecisionsController {
    private readonly decisionsService;
    constructor(decisionsService: DecisionsService);
    findAll(): Promise<import("../database/entities/decision.entity").DecisionEntity[]>;
    findMyAssignedDecisions(request: {
        user: RequestUser;
    }): Promise<import("../database/entities/decision.entity").DecisionEntity[]>;
    updateAssignedDecisionReport(id: number, request: {
        user: RequestUser;
    }, dto: UpdateDecisionAssignedReportDto): Promise<import("../database/entities/decision.entity").DecisionEntity>;
    findCurrentDecision(sessionId: number): Promise<import("../database/entities/decision.entity").DecisionEntity | null>;
    findOne(id: number): Promise<import("../database/entities/decision.entity").DecisionEntity>;
    create(dto: CreateDecisionDto): Promise<import("../database/entities/decision.entity").DecisionEntity>;
    update(id: number, dto: UpdateDecisionDto): Promise<import("../database/entities/decision.entity").DecisionEntity>;
    remove(id: number): Promise<void>;
}
