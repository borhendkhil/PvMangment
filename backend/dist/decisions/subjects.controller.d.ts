import { CreateSubjectDecisionDto, UpdateSubjectDecisionDto } from './dto/subject-decision.dto';
import { SubjectsService } from './subjects.service';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    findAll(): Promise<import("../database/entities/subject-decision.entity").SubjectDecisionEntity[]>;
    findOne(id: number): Promise<import("../database/entities/subject-decision.entity").SubjectDecisionEntity>;
    create(dto: CreateSubjectDecisionDto): Promise<import("../database/entities/subject-decision.entity").SubjectDecisionEntity>;
    update(id: number, dto: UpdateSubjectDecisionDto): Promise<import("../database/entities/subject-decision.entity").SubjectDecisionEntity>;
    remove(id: number): Promise<void>;
}
