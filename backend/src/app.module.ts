import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from './access-control/access-control.module';
import { CommitteesModule } from './committees/committees.module';
import { DecisionsModule } from './decisions/decisions.module';
import { DirectionsModule } from './directions/directions.module';
import { EmployeesModule } from './employees/employees.module';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ActivityLogInterceptor } from './common/interceptors/activity-log.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'pv_management'),
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
        timezone: '+00:00',
        charset: 'utf8mb4',
      }),
    }),
    LogsModule,
    AuthModule,
    AccessControlModule,
    UsersModule,
    DirectionsModule,
    EmployeesModule,
    CommitteesModule,
    DecisionsModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
  ],
})
export class AppModule {}
