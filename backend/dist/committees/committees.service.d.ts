import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { CreateCommitteeDto, UpdateCommitteeDto } from './dto/committee.dto';
export declare class CommitteesService extends BaseCrudService<CommitteeEntity> {
    constructor(repository: Repository<CommitteeEntity>);
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
    private decorateCommittee;
}
