import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecisionEntity } from './decision.entity';

@Entity({ name: 'decision_pdf' })
export class DecisionPdfEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => DecisionEntity, (decision) => decision.decisionPdfs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'decision_id' })
  decision: DecisionEntity;

  @Column({ name: 'pdf_path', type: 'varchar', length: 255 })
  pdfPath: string;

  @Column({ name: 'pdf_name', type: 'varchar', length: 255, nullable: true })
  pdfName: string | null;

  @CreateDateColumn({ name: 'date_upload', type: 'datetime' })
  dateUpload: Date;
}
