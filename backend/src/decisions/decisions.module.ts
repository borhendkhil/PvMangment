import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { DecisionEntity } from '../database/entities/decision.entity';
import { DecisionPdfEntity } from '../database/entities/decision-pdf.entity';
import { SubjectDecisionEntity } from '../database/entities/subject-decision.entity';
import { DecisionsController } from './decisions.controller';
import { DecisionPdfsController } from './decision-pdfs.controller';
import { DecisionsService } from './decisions.service';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DecisionEntity,
      DecisionPdfEntity,
      SubjectDecisionEntity,
      CommitteeSessionEntity,
      CommitteeEntity,
    ]),
  ],
  controllers: [DecisionsController, DecisionPdfsController, SubjectsController],
  providers: [DecisionsService, SubjectsService],
  exports: [DecisionsService, SubjectsService],
})
export class DecisionsModule {}
