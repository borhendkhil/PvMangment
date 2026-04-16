import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { PermissionEntity } from '../database/entities/permission.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
export declare class RolesService extends BaseCrudService<RoleEntity> {
    private readonly permissionRepository;
    constructor(repository: Repository<RoleEntity>, permissionRepository: Repository<PermissionEntity>);
    private sanitizeRole;
    findAll(): Promise<RoleEntity[]>;
    findOne(id: number): Promise<{
        users: any[];
        id: number;
        name: string;
        labelAr: string;
        permissions: PermissionEntity[];
        fonctions: import("../database/entities/fonction.entity").FonctionEntity[];
    }>;
    create(dto: CreateRoleDto): Promise<RoleEntity>;
    update(id: number, dto: UpdateRoleDto): Promise<{
        users: any[];
        id: number;
        name: string;
        labelAr: string;
        permissions: PermissionEntity[];
        fonctions: import("../database/entities/fonction.entity").FonctionEntity[];
    } & RoleEntity>;
    setPermissions(roleId: number, dto: AssignPermissionsDto): Promise<{
        users: any[];
        id: number;
        name: string;
        labelAr: string;
        permissions: PermissionEntity[];
        fonctions: import("../database/entities/fonction.entity").FonctionEntity[];
    } & RoleEntity>;
}
