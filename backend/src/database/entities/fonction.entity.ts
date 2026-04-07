import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeFonctionEntity } from './employe-fonction.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'fonction' })
export class FonctionEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ name: 'label_ar', type: 'varchar', length: 255 })
  labelAr: string;

  @OneToMany(() => EmployeFonctionEntity, (employeFonction) => employeFonction.fonction)
  employeFonctions: EmployeFonctionEntity[];

  @ManyToMany(() => RoleEntity, (role) => role.fonctions)
  @JoinTable({
    name: 'fonction_role_mapping',
    joinColumn: { name: 'fonction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];
}
