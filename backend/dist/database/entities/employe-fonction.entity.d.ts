import { EmployeEntity } from './employe.entity';
import { FonctionEntity } from './fonction.entity';
export declare class EmployeFonctionEntity {
    id: number;
    employe: EmployeEntity | null;
    fonction: FonctionEntity | null;
    dateDebut: string;
    dateFin: string | null;
    isActive: boolean;
}
