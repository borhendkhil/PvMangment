import { PermissionEntity } from './permission.entity';
import { UserEntity } from './user.entity';
import { FonctionEntity } from './fonction.entity';
export declare class RoleEntity {
    id: number;
    name: string;
    labelAr: string;
    permissions: PermissionEntity[];
    users: UserEntity[];
    fonctions: FonctionEntity[];
}
