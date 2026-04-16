import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { RoleEntity } from '../database/entities/role.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService extends BaseCrudService<UserEntity> {
    private readonly roleRepository;
    constructor(repository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>);
    private sanitizeUser;
    private getRawUser;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByEmailForAuth(email: string): Promise<UserEntity | null>;
    create(dto: CreateUserDto): Promise<any>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
    setRoles(userId: number, roleIds: number[]): Promise<{
        id: number;
        email: string;
        telephone: string | null;
        enabled: boolean;
        createdAt: Date;
        roles: RoleEntity[];
        employe: import("../database/entities/employe.entity").EmployeEntity | null;
    }>;
}
