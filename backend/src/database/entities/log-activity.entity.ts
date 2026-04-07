import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'log_activity' })
export class LogActivityEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @Column({ name: 'action', type: 'varchar', length: 255, nullable: true })
  action: string | null;

  @CreateDateColumn({ name: 'date_action', type: 'datetime' })
  dateAction: Date;
}
