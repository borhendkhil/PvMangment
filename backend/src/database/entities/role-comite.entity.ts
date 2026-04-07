import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MemberComiteEntity } from './member-comite.entity';

@Entity({ name: 'role_comite' })
export class RoleComiteEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ name: 'label_ar', type: 'varchar', length: 255 })
  labelAr: string;

  @OneToMany(() => MemberComiteEntity, (member) => member.roleComite)
  memberComites: MemberComiteEntity[];
}
