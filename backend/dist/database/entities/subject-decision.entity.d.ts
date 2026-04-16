import { DecisionEntity } from './decision.entity';
export declare class SubjectDecisionEntity {
    id: number;
    sujet: string;
    description: string | null;
    dateCreation: Date;
    decisions: DecisionEntity[];
}
