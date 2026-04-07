import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { MemberComiteEntity } from '../database/entities/member-comite.entity';
import { RoleComiteEntity } from '../database/entities/role-comite.entity';
import { CommitteesController } from './committees.controller';
import { CommitteesService } from './committees.service';
import { CommitteeSessionsController } from './committee-sessions.controller';
import { CommitteeSessionsService } from './committee-sessions.service';
import { MemberComitesController } from './member-comites.controller';
import { MemberComitesService } from './member-comites.service';
import { RoleComiteController } from './role-comite.controller';
import { RoleComiteService } from './role-comite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommitteeEntity,
      CommitteeSessionEntity,
      MemberComiteEntity,
      RoleComiteEntity,
      EmployeEntity,
    ]),
  ],
  controllers: [
    CommitteesController,
    CommitteeSessionsController,
    MemberComitesController,
    RoleComiteController,
  ],
  providers: [
    CommitteesService,
    CommitteeSessionsService,
    MemberComitesService,
    RoleComiteService,
  ],
  exports: [CommitteesService, CommitteeSessionsService, MemberComitesService, RoleComiteService],
})
export class CommitteesModule {}
