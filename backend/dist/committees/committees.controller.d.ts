import { CreateCommitteeDto, UpdateCommitteeDto } from './dto/committee.dto';
import { CommitteesService } from './committees.service';
export declare class CommitteesController {
    private readonly committeesService;
    constructor(committeesService: CommitteesService);
    findAll(): Promise<{
        totalSessions: number;
        totalMembres: number;
        totalDecisions: number;
        decisions: import("../database/entities/decision.entity").DecisionEntity[];
        id: number;
        titre: string;
        description: string | null;
        dateCreation: Date;
        sessions: import("../database/entities/committee-session.entity").CommitteeSessionEntity[];
        members: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    }[]>;
    findOne(id: number): Promise<{
        totalSessions: number;
        totalMembres: number;
        totalDecisions: number;
        decisions: import("../database/entities/decision.entity").DecisionEntity[];
        id: number;
        titre: string;
        description: string | null;
        dateCreation: Date;
        sessions: import("../database/entities/committee-session.entity").CommitteeSessionEntity[];
        members: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    }>;
    create(dto: CreateCommitteeDto): Promise<{
        totalSessions: number;
        totalMembres: number;
        totalDecisions: number;
        decisions: import("../database/entities/decision.entity").DecisionEntity[];
        id: number;
        titre: string;
        description: string | null;
        dateCreation: Date;
        sessions: import("../database/entities/committee-session.entity").CommitteeSessionEntity[];
        members: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    }>;
    update(id: number, dto: UpdateCommitteeDto): Promise<{
        totalSessions: number;
        totalMembres: number;
        totalDecisions: number;
        decisions: import("../database/entities/decision.entity").DecisionEntity[];
        id: number;
        titre: string;
        description: string | null;
        dateCreation: Date;
        sessions: import("../database/entities/committee-session.entity").CommitteeSessionEntity[];
        members: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    }>;
    remove(id: number): Promise<void>;
}
