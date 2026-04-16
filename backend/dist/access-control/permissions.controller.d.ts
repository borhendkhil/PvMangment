import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(): Promise<import("../database/entities/permission.entity").PermissionEntity[]>;
    findOne(id: number): Promise<import("../database/entities/permission.entity").PermissionEntity>;
    create(dto: CreatePermissionDto): Promise<import("../database/entities/permission.entity").PermissionEntity>;
    update(id: number, dto: UpdatePermissionDto): Promise<import("../database/entities/permission.entity").PermissionEntity>;
    remove(id: number): Promise<void>;
}
