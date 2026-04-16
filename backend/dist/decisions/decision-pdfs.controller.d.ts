import { Response } from 'express';
import { DecisionsService } from './decisions.service';
import { CreateDecisionPdfDto, UpdateDecisionPdfDto } from './dto/decision-pdf.dto';
export declare class DecisionPdfsController {
    private readonly decisionsService;
    constructor(decisionsService: DecisionsService);
    findAll(): Promise<import("../database/entities/decision-pdf.entity").DecisionPdfEntity[]>;
    findOne(id: number): Promise<import("../database/entities/decision-pdf.entity").DecisionPdfEntity>;
    create(dto: CreateDecisionPdfDto): Promise<import("../database/entities/decision-pdf.entity").DecisionPdfEntity>;
    uploadFiles(decisionId: number, files: Array<{
        path: string;
        originalname: string;
    }>): Promise<import("../database/entities/decision-pdf.entity").DecisionPdfEntity[]>;
    servePdf(safeName: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    update(id: number, dto: UpdateDecisionPdfDto): Promise<import("../database/entities/decision-pdf.entity").DecisionPdfEntity>;
    remove(id: number): Promise<void>;
}
