import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DirectionEntity } from './direction.entity';
import { EmployeFonctionEntity } from './employe-fonction.entity';
import { UserEntity } from './user.entity';
import { MemberComiteEntity } from './member-comite.entity';

@Entity({ name: 'employe' })
export class EmployeEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'matricule', type: 'varchar', length: 50, nullable: true, unique: true })
  matricule: string | null;

  @Column({ name: 'nom', type: 'varchar', length: 100 })
  nom: string;

  @Column({ name: 'prenom', type: 'varchar', length: 100 })
  prenom: string;

  @Column({ name: 'telephone', type: 'varchar', length: 20, nullable: true })
  telephone: string | null;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @ManyToOne(() => DirectionEntity, (direction) => direction.employes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'direction_id' })
  direction: DirectionEntity | null;

  @OneToOne(() => UserEntity, (user) => user.employe, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @OneToMany(() => EmployeFonctionEntity, (employeFonction) => employeFonction.employe)
  employeFonctions: EmployeFonctionEntity[];

  @OneToMany(() => MemberComiteEntity, (member) => member.employe)
  memberComites: MemberComiteEntity[];
}
