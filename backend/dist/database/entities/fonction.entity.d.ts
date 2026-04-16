import { EmployeFonctionEntity } from './employe-fonction.entity';
import { RoleEntity } from './role.entity';
export declare class FonctionEntity {
    id: number;
    name: string;
    labelAr: string;
    employeFonctions: EmployeFonctionEntity[];
    roles: RoleEntity[];
}
