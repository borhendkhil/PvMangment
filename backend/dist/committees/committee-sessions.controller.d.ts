import { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateCommitteeSessionDto, UpdateCommitteeSessionDto } from './dto/committee-session.dto';
import { CommitteeSessionsService } from './committee-sessions.service';
export declare class CommitteeSessionsController {
    private readonly committeeSessionsService;
    constructor(committeeSessionsService: CommitteeSessionsService);
    findAll(): Promise<import("../database/entities/committee-session.entity").CommitteeSessionEntity[]>;
    findAssignedSessions(request: {
        user: RequestUser;
    }): Promise<import("../database/entities/committee-session.entity").CommitteeSessionEntity[]>;
    updateAssignedReport(id: number, request: {
        user: RequestUser;
    }, dto: UpdateCommitteeSessionDto): Promise<import("../database/entities/committee-session.entity").CommitteeSessionEntity>;
    findOne(id: number): Promise<import("../database/entities/committee-session.entity").CommitteeSessionEntity>;
    create(dto: CreateCommitteeSessionDto): Promise<import("../database/entities/committee-session.entity").CommitteeSessionEntity>;
    update(id: number, dto: UpdateCommitteeSessionDto): Promise<import("../database/entities/committee-session.entity").CommitteeSessionEntity>;
    remove(id: number): Promise<void>;
}
