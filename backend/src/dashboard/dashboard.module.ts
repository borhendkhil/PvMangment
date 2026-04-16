import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserEntity } from '../database/entities/user.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { DecisionEntity } from '../database/entities/decision.entity';
import { MemberComiteEntity } from '../database/entities/member-comite.entity';
import { SubjectDecisionEntity } from '../database/entities/subject-decision.entity';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { SessionReportEntity } from '../database/entities/session-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EmployeEntity,
      CommitteeSessionEntity,
      DecisionEntity,
      MemberComiteEntity,
      SubjectDecisionEntity,
      CommitteeEntity,
      SessionReportEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
