import { DecisionEntity } from './decision.entity';
export declare class DecisionPdfEntity {
    id: number;
    decision: DecisionEntity;
    pdfPath: string;
    pdfName: string | null;
    dateUpload: Date;
}
