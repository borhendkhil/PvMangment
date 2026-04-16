import { RoleEntity } from './role.entity';
export declare class PermissionEntity {
    id: number;
    name: string;
    roles: RoleEntity[];
}
