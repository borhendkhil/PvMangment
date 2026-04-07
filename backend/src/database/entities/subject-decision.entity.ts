import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DecisionEntity } from './decision.entity';

@Entity({ name: 'sujet_decision' })
export class SubjectDecisionEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'sujet', type: 'varchar', length: 255 })
  sujet: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'date_creation', type: 'datetime' })
  dateCreation: Date;

  @OneToMany(() => DecisionEntity, (decision) => decision.subject)
  decisions: DecisionEntity[];
}
