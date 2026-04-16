import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { PermissionEntity } from '../database/entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
export declare class PermissionsService extends BaseCrudService<PermissionEntity> {
    constructor(repository: Repository<PermissionEntity>);
    findAll(): Promise<PermissionEntity[]>;
    create(dto: CreatePermissionDto): Promise<PermissionEntity>;
    update(id: number, dto: UpdatePermissionDto): Promise<PermissionEntity>;
}
