import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<import("../database/entities/role.entity").RoleEntity[]>;
    findOne(id: number): Promise<{
        users: any[];
        id: number;
        name: string;
        labelAr: string;
        permissions: import("../database/entities/permission.entity").PermissionEntity[];
        fonctions: import("../database/entities/fonction.entity").FonctionEntity[];
    }>;
    create(dto: CreateRoleDto): Promise<import("../database/entities/role.entity").RoleEntity>;
    update(id: number, dto: UpdateRoleDto): Promise<{
        users: any[];
        id: number;
        name: string;
        labelAr: string;
        permissions: import("../database/entities/permission.entity").PermissionEntity[];
        fonctions: import("../database/entities/fonction.entity").FonctionEntity[];
    } & import("../database/entities/role.entity").RoleEntity>;
    setPermissions(id: number, dto: AssignPermissionsDto): Promise<{
        users: any[];
        id: number;
        name: string;
        labelAr: string;
        permissions: import("../database/entities/permission.entity").PermissionEntity[];
        fonctions: import("../database/entities/fonction.entity").FonctionEntity[];
    } & import("../database/entities/role.entity").RoleEntity>;
    remove(id: number): Promise<void>;
}
