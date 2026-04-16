import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionReportEntity } from './session-report.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'report_feedback' })
export class ReportFeedbackEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => SessionReportEntity, (report) => report.feedbacks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'report_id' })
  report: SessionReportEntity;

  @ManyToOne(() => UserEntity, undefined, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @Column({ name: 'type', type: 'varchar', length: 50 })
  type: string; // 'RECLAMATION' or 'REMARQUE'

  @Column({ name: 'content', type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'date_creation', type: 'datetime' })
  dateCreation: Date;
}
