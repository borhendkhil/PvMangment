import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { LogActivityEntity } from '../database/entities/log-activity.entity';
import { LogsController } from './logs.controller';
import { LogActivityService } from './log-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogActivityEntity, UserEntity])],
  controllers: [LogsController],
  providers: [LogActivityService],
  exports: [LogActivityService],
})
export class LogsModule {}
