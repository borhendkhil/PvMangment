"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitteesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comite_entity_1 = require("../database/entities/comite.entity");
const committee_session_entity_1 = require("../database/entities/committee-session.entity");
const employe_entity_1 = require("../database/entities/employe.entity");
const member_comite_entity_1 = require("../database/entities/member-comite.entity");
const role_comite_entity_1 = require("../database/entities/role-comite.entity");
const user_entity_1 = require("../database/entities/user.entity");
const committees_controller_1 = require("./committees.controller");
const committees_service_1 = require("./committees.service");
const committee_sessions_controller_1 = require("./committee-sessions.controller");
const committee_sessions_service_1 = require("./committee-sessions.service");
const member_comites_controller_1 = require("./member-comites.controller");
const member_comites_service_1 = require("./member-comites.service");
const role_comite_controller_1 = require("./role-comite.controller");
const role_comite_service_1 = require("./role-comite.service");
let CommitteesModule = class CommitteesModule {
};
exports.CommitteesModule = CommitteesModule;
exports.CommitteesModule = CommitteesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                comite_entity_1.CommitteeEntity,
                committee_session_entity_1.CommitteeSessionEntity,
                member_comite_entity_1.MemberComiteEntity,
                role_comite_entity_1.RoleComiteEntity,
                employe_entity_1.EmployeEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        controllers: [
            committees_controller_1.CommitteesController,
            committee_sessions_controller_1.CommitteeSessionsController,
            member_comites_controller_1.MemberComitesController,
            role_comite_controller_1.RoleComiteController,
        ],
        providers: [
            committees_service_1.CommitteesService,
            committee_sessions_service_1.CommitteeSessionsService,
            member_comites_service_1.MemberComitesService,
            role_comite_service_1.RoleComiteService,
        ],
        exports: [committees_service_1.CommitteesService, committee_sessions_service_1.CommitteeSessionsService, member_comites_service_1.MemberComitesService, role_comite_service_1.RoleComiteService],
    })
], CommitteesModule);
//# sourceMappingURL=committees.module.js.map