import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { RoleComiteEntity } from '../database/entities/role-comite.entity';
import { CreateRoleComiteDto, UpdateRoleComiteDto } from './dto/role-comite.dto';
export declare class RoleComiteService extends BaseCrudService<RoleComiteEntity> {
    constructor(repository: Repository<RoleComiteEntity>);
    findAll(): Promise<RoleComiteEntity[]>;
    create(dto: CreateRoleComiteDto): Promise<RoleComiteEntity>;
    update(id: number, dto: UpdateRoleComiteDto): Promise<RoleComiteEntity>;
}
