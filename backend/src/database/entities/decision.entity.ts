import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommitteeSessionEntity } from './committee-session.entity';
import { DecisionPdfEntity } from './decision-pdf.entity';
import { SubjectDecisionEntity } from './subject-decision.entity';
import { CommitteeEntity } from './comite.entity';

@Entity({ name: 'decision' })
export class DecisionEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => SubjectDecisionEntity, (subject) => subject.decisions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sujet_id' })
  subject: SubjectDecisionEntity | null;

  @ManyToOne(() => CommitteeSessionEntity, (session) => session.decisions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'session_id' })
  session: CommitteeSessionEntity | null;

  @Column({ name: 'num_admin', type: 'varchar', length: 50, nullable: true, unique: true })
  numAdmin: string | null;

  @Column({ name: 'titre', type: 'varchar', length: 255, nullable: true })
  titre: string | null;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'fichier_path', type: 'varchar', length: 255, nullable: true })
  fichierPath: string | null;

  @Column({ name: 'fichier_name', type: 'varchar', length: 255, nullable: true })
  fichierName: string | null;

  @Column({ name: 'statut', type: 'varchar', length: 50, nullable: true })
  statut: string | null;

  @Column({ name: 'current', type: 'tinyint', width: 1, default: false })
  current: boolean;

  @CreateDateColumn({ name: 'date_creation', type: 'datetime' })
  dateCreation: Date;

  @Column({ name: 'date_upload', type: 'datetime', nullable: true })
  dateUpload: Date | null;

  @OneToMany(() => DecisionPdfEntity, (pdf) => pdf.decision)
  decisionPdfs: DecisionPdfEntity[];

  @ManyToOne(() => CommitteeEntity, (comite) => comite.decisions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'comite_id' })
  comite: CommitteeEntity | null;
}
