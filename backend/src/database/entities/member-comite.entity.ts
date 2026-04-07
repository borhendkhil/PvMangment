import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CommitteeEntity } from './comite.entity';
import { EmployeEntity } from './employe.entity';
import { RoleComiteEntity } from './role-comite.entity';

@Entity({ name: 'membre_comite' })
export class MemberComiteEntity {
  @PrimaryColumn({ name: 'comite_id', type: 'int' })
  comiteId: number;

  @PrimaryColumn({ name: 'employe_id', type: 'int' })
  employeId: number;

  @ManyToOne(() => CommitteeEntity, (comite) => comite.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comite_id' })
  comite: CommitteeEntity;

  @ManyToOne(() => EmployeEntity, (employe) => employe.memberComites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employe_id' })
  employe: EmployeEntity;

  @ManyToOne(() => RoleComiteEntity, (roleComite) => roleComite.memberComites, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_comite_id' })
  roleComite: RoleComiteEntity | null;
}
