import { CommitteeSessionEntity } from './committee-session.entity';
import { DecisionPdfEntity } from './decision-pdf.entity';
import { SubjectDecisionEntity } from './subject-decision.entity';
import { CommitteeEntity } from './comite.entity';
export declare class DecisionEntity {
    id: number;
    subject: SubjectDecisionEntity | null;
    session: CommitteeSessionEntity | null;
    numAdmin: string | null;
    titre: string | null;
    description: string | null;
    recommendationText: string | null;
    executionStructure: string | null;
    deadlineText: string | null;
    fichierPath: string | null;
    fichierName: string | null;
    statut: string | null;
    current: boolean;
    dateCreation: Date;
    dateUpload: Date | null;
    decisionPdfs: DecisionPdfEntity[];
    comite: CommitteeEntity | null;
}
