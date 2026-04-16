import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { SubjectDecisionEntity } from '../database/entities/subject-decision.entity';
import { CreateSubjectDecisionDto, UpdateSubjectDecisionDto } from './dto/subject-decision.dto';
export declare class SubjectsService extends BaseCrudService<SubjectDecisionEntity> {
    constructor(repository: Repository<SubjectDecisionEntity>);
    findAll(): Promise<SubjectDecisionEntity[]>;
    findOne(id: number): Promise<SubjectDecisionEntity>;
    create(dto: CreateSubjectDecisionDto): Promise<SubjectDecisionEntity>;
    update(id: number, dto: UpdateSubjectDecisionDto): Promise<SubjectDecisionEntity>;
}
