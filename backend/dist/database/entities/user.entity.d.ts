import { EmployeEntity } from './employe.entity';
import { RoleEntity } from './role.entity';
export declare class UserEntity {
    id: number;
    email: string;
    password: string;
    telephone: string | null;
    enabled: boolean;
    createdAt: Date;
    roles: RoleEntity[];
    employe: EmployeEntity | null;
}
