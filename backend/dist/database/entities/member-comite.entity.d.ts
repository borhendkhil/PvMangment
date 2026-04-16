import { CommitteeEntity } from './comite.entity';
import { EmployeEntity } from './employe.entity';
import { RoleComiteEntity } from './role-comite.entity';
export declare class MemberComiteEntity {
    comiteId: number;
    employeId: number;
    comite: CommitteeEntity;
    employe: EmployeEntity;
    roleComite: RoleComiteEntity | null;
}
