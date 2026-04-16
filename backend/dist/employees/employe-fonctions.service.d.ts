import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { EmployeEntity } from '../database/entities/employe.entity';
import { EmployeFonctionEntity } from '../database/entities/employe-fonction.entity';
import { FonctionEntity } from '../database/entities/fonction.entity';
import { CreateEmployeFonctionDto, UpdateEmployeFonctionDto } from './dto/employe-fonction.dto';
export declare class EmployeFonctionsService extends BaseCrudService<EmployeFonctionEntity> {
    private readonly employeRepository;
    private readonly fonctionRepository;
    constructor(repository: Repository<EmployeFonctionEntity>, employeRepository: Repository<EmployeEntity>, fonctionRepository: Repository<FonctionEntity>);
    findAll(): Promise<EmployeFonctionEntity[]>;
    findOne(id: number): Promise<EmployeFonctionEntity>;
    getCurrentFunction(employeId: number): Promise<EmployeFonctionEntity | null>;
    create(dto: CreateEmployeFonctionDto): Promise<EmployeFonctionEntity>;
    update(id: number, dto: UpdateEmployeFonctionDto): Promise<EmployeFonctionEntity>;
}
