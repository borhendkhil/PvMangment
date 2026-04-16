import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommitteeSessionEntity } from './committee-session.entity';
import { ReportFeedbackEntity } from './report-feedback.entity';

@Entity({ name: 'session_report' })
export class SessionReportEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @OneToOne(() => CommitteeSessionEntity, (session) => session.report, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: CommitteeSessionEntity;

  @Column({ name: 'topic', type: 'varchar', length: 255, nullable: true })
  topic: string | null;

  @Column({ name: 'context', type: 'text', nullable: true })
  context: string | null;

  @Column({ name: 'discussion', type: 'text', nullable: true })
  discussion: string | null;

  @Column({ name: 'rows_json', type: 'longtext', nullable: true })
  rowsJson: string | null;

  @Column({ name: 'statut', type: 'varchar', length: 50, default: 'DRAFT' })
  statut: string;

  @CreateDateColumn({ name: 'date_creation', type: 'datetime' })
  dateCreation: Date;

  @OneToMany(() => ReportFeedbackEntity, (feedback) => feedback.report)
  feedbacks: ReportFeedbackEntity[];
}
