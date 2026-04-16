import { CreateUserDto, SetUserRolesDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    create(dto: CreateUserDto): Promise<any>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
    setRoles(id: number, dto: SetUserRolesDto): Promise<{
        id: number;
        email: string;
        telephone: string | null;
        enabled: boolean;
        createdAt: Date;
        roles: import("../database/entities/role.entity").RoleEntity[];
        employe: import("../database/entities/employe.entity").EmployeEntity | null;
    }>;
    remove(id: number): Promise<void>;
}
