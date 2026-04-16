"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const access_control_module_1 = require("./access-control/access-control.module");
const committees_module_1 = require("./committees/committees.module");
const decisions_module_1 = require("./decisions/decisions.module");
const directions_module_1 = require("./directions/directions.module");
const employees_module_1 = require("./employees/employees.module");
const logs_module_1 = require("./logs/logs.module");
const users_module_1 = require("./users/users.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const reports_module_1 = require("./reports/reports.module");
const activity_log_interceptor_1 = require("./common/interceptors/activity-log.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 3306),
                    username: configService.get('DB_USERNAME', 'root'),
                    password: configService.get('DB_PASSWORD', ''),
                    database: configService.get('DB_DATABASE', 'pv_management'),
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: configService.get('DB_LOGGING', 'false') === 'true',
                    timezone: '+00:00',
                    charset: 'utf8mb4',
                }),
            }),
            logs_module_1.LogsModule,
            auth_module_1.AuthModule,
            access_control_module_1.AccessControlModule,
            users_module_1.UsersModule,
            directions_module_1.DirectionsModule,
            employees_module_1.EmployeesModule,
            committees_module_1.CommitteesModule,
            decisions_module_1.DecisionsModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: activity_log_interceptor_1.ActivityLogInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map