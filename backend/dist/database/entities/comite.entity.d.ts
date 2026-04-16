import { CommitteeSessionEntity } from './committee-session.entity';
import { MemberComiteEntity } from './member-comite.entity';
import { DecisionEntity } from './decision.entity';
export declare class CommitteeEntity {
    id: number;
    titre: string;
    description: string | null;
    dateCreation: Date;
    sessions: CommitteeSessionEntity[];
    members: MemberComiteEntity[];
    decisions: DecisionEntity[];
}
