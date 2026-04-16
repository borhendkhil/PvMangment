import { DirectionEntity } from './direction.entity';
import { EmployeFonctionEntity } from './employe-fonction.entity';
import { UserEntity } from './user.entity';
import { MemberComiteEntity } from './member-comite.entity';
export declare class EmployeEntity {
    id: number;
    matricule: string | null;
    nom: string;
    prenom: string;
    telephone: string | null;
    address: string | null;
    direction: DirectionEntity | null;
    user: UserEntity | null;
    employeFonctions: EmployeFonctionEntity[];
    memberComites: MemberComiteEntity[];
}
