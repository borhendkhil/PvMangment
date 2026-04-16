import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { RoleEntity } from '../database/entities/role.entity';
import { FonctionEntity } from '../database/entities/fonction.entity';
import { CreateFonctionDto, UpdateFonctionDto } from './dto/fonction.dto';
export declare class FonctionsService extends BaseCrudService<FonctionEntity> {
    private readonly roleRepository;
    constructor(repository: Repository<FonctionEntity>, roleRepository: Repository<RoleEntity>);
    findAll(): Promise<FonctionEntity[]>;
    findOne(id: number): Promise<FonctionEntity>;
    create(dto: CreateFonctionDto): Promise<FonctionEntity>;
    update(id: number, dto: UpdateFonctionDto): Promise<FonctionEntity>;
    setRoles(fonctionId: number, roleIds: number[]): Promise<FonctionEntity>;
}
