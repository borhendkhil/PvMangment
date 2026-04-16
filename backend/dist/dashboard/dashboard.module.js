"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
const user_entity_1 = require("../database/entities/user.entity");
const employe_entity_1 = require("../database/entities/employe.entity");
const committee_session_entity_1 = require("../database/entities/committee-session.entity");
const decision_entity_1 = require("../database/entities/decision.entity");
const member_comite_entity_1 = require("../database/entities/member-comite.entity");
const subject_decision_entity_1 = require("../database/entities/subject-decision.entity");
const comite_entity_1 = require("../database/entities/comite.entity");
const session_report_entity_1 = require("../database/entities/session-report.entity");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                employe_entity_1.EmployeEntity,
                committee_session_entity_1.CommitteeSessionEntity,
                decision_entity_1.DecisionEntity,
                member_comite_entity_1.MemberComiteEntity,
                subject_decision_entity_1.SubjectDecisionEntity,
                comite_entity_1.CommitteeEntity,
                session_report_entity_1.SessionReportEntity,
            ]),
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map