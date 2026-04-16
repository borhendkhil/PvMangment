import { CreateRoleComiteDto, UpdateRoleComiteDto } from './dto/role-comite.dto';
import { RoleComiteService } from './role-comite.service';
export declare class RoleComiteController {
    private readonly roleComiteService;
    constructor(roleComiteService: RoleComiteService);
    findAll(): Promise<import("../database/entities/role-comite.entity").RoleComiteEntity[]>;
    findOne(id: number): Promise<import("../database/entities/role-comite.entity").RoleComiteEntity>;
    create(dto: CreateRoleComiteDto): Promise<import("../database/entities/role-comite.entity").RoleComiteEntity>;
    update(id: number, dto: UpdateRoleComiteDto): Promise<import("../database/entities/role-comite.entity").RoleComiteEntity>;
    remove(id: number): Promise<void>;
}
