import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommitteeSessionEntity } from './committee-session.entity';
import { MemberComiteEntity } from './member-comite.entity';

import { DecisionEntity } from './decision.entity';

@Entity({ name: 'comite' })
export class CommitteeEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'titre', type: 'varchar', length: 255 })
  titre: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'date_creation', type: 'datetime' })
  dateCreation: Date;

  @OneToMany(() => CommitteeSessionEntity, (session) => session.comite)
  sessions: CommitteeSessionEntity[];

  @OneToMany(() => MemberComiteEntity, (member) => member.comite)
  members: MemberComiteEntity[];

  @OneToMany(() => DecisionEntity, (decision) => decision.comite)
  decisions: DecisionEntity[];
}
