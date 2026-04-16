"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const direction_entity_1 = require("../database/entities/direction.entity");
const employe_entity_1 = require("../database/entities/employe.entity");
const employe_fonction_entity_1 = require("../database/entities/employe-fonction.entity");
const fonction_entity_1 = require("../database/entities/fonction.entity");
const role_entity_1 = require("../database/entities/role.entity");
const user_entity_1 = require("../database/entities/user.entity");
const employe_fonctions_controller_1 = require("./employe-fonctions.controller");
const employe_fonctions_service_1 = require("./employe-fonctions.service");
const employees_controller_1 = require("./employees.controller");
const employes_service_1 = require("./employes.service");
const fonctions_controller_1 = require("./fonctions.controller");
const fonctions_service_1 = require("./fonctions.service");
let EmployeesModule = class EmployeesModule {
};
exports.EmployeesModule = EmployeesModule;
exports.EmployeesModule = EmployeesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                employe_entity_1.EmployeEntity,
                direction_entity_1.DirectionEntity,
                user_entity_1.UserEntity,
                fonction_entity_1.FonctionEntity,
                role_entity_1.RoleEntity,
                employe_fonction_entity_1.EmployeFonctionEntity,
            ]),
        ],
        controllers: [employees_controller_1.EmployeesController, fonctions_controller_1.FonctionsController, employe_fonctions_controller_1.EmployeFonctionsController],
        providers: [employes_service_1.EmployesService, fonctions_service_1.FonctionsService, employe_fonctions_service_1.EmployeFonctionsService],
        exports: [employes_service_1.EmployesService, fonctions_service_1.FonctionsService, employe_fonctions_service_1.EmployeFonctionsService],
    })
], EmployeesModule);
//# sourceMappingURL=employees.module.js.map