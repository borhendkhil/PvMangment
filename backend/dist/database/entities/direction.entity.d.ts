import { EmployeEntity } from './employe.entity';
export declare class DirectionEntity {
    id: number;
    code: string | null;
    lib: string;
    address: string | null;
    employes: EmployeEntity[];
}
