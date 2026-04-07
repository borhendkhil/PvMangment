import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommitteeEntity } from './comite.entity';
import { DecisionEntity } from './decision.entity';

@Entity({ name: 'comite_session' })
export class CommitteeSessionEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => CommitteeEntity, (comite) => comite.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comite_id' })
  comite: CommitteeEntity;

  @Column({ name: 'date_session', type: 'datetime', nullable: true })
  dateSession: Date | null;

  @Column({ name: 'lieu', type: 'varchar', length: 255, nullable: true })
  lieu: string | null;

  @Column({ name: 'statut', type: 'varchar', length: 50, nullable: true })
  statut: string | null;

  @OneToMany(() => DecisionEntity, (decision) => decision.session)
  decisions: DecisionEntity[];
}
