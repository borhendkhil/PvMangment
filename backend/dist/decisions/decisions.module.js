"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const committee_session_entity_1 = require("../database/entities/committee-session.entity");
const comite_entity_1 = require("../database/entities/comite.entity");
const decision_entity_1 = require("../database/entities/decision.entity");
const decision_pdf_entity_1 = require("../database/entities/decision-pdf.entity");
const subject_decision_entity_1 = require("../database/entities/subject-decision.entity");
const user_entity_1 = require("../database/entities/user.entity");
const decisions_controller_1 = require("./decisions.controller");
const decision_pdfs_controller_1 = require("./decision-pdfs.controller");
const decisions_service_1 = require("./decisions.service");
const subjects_controller_1 = require("./subjects.controller");
const subjects_service_1 = require("./subjects.service");
let DecisionsModule = class DecisionsModule {
};
exports.DecisionsModule = DecisionsModule;
exports.DecisionsModule = DecisionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                decision_entity_1.DecisionEntity,
                decision_pdf_entity_1.DecisionPdfEntity,
                subject_decision_entity_1.SubjectDecisionEntity,
                committee_session_entity_1.CommitteeSessionEntity,
                comite_entity_1.CommitteeEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        controllers: [decisions_controller_1.DecisionsController, decision_pdfs_controller_1.DecisionPdfsController, subjects_controller_1.SubjectsController],
        providers: [decisions_service_1.DecisionsService, subjects_service_1.SubjectsService],
        exports: [decisions_service_1.DecisionsService, subjects_service_1.SubjectsService],
    })
], DecisionsModule);
//# sourceMappingURL=decisions.module.js.map