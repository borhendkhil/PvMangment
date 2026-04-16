import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { SessionReportEntity } from '../database/entities/session-report.entity';
import { ReportFeedbackEntity } from '../database/entities/report-feedback.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { UserEntity } from '../database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionReportEntity, 
      ReportFeedbackEntity, 
      CommitteeSessionEntity, 
      UserEntity
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
