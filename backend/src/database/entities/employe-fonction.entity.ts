import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeEntity } from './employe.entity';
import { FonctionEntity } from './fonction.entity';

@Entity({ name: 'employe_fonction' })
export class EmployeFonctionEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => EmployeEntity, (employe) => employe.employeFonctions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employe_id' })
  employe: EmployeEntity | null;

  @ManyToOne(() => FonctionEntity, (fonction) => fonction.employeFonctions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'fonction_id' })
  fonction: FonctionEntity | null;

  @Column({ name: 'date_debut', type: 'date' })
  dateDebut: string;

  @Column({ name: 'date_fin', type: 'date', nullable: true })
  dateFin: string | null;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: true })
  isActive: boolean;
}
