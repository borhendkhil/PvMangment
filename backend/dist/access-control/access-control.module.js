"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const permission_entity_1 = require("../database/entities/permission.entity");
const role_entity_1 = require("../database/entities/role.entity");
const permissions_controller_1 = require("./permissions.controller");
const roles_controller_1 = require("./roles.controller");
const permissions_service_1 = require("./permissions.service");
const roles_service_1 = require("./roles.service");
let AccessControlModule = class AccessControlModule {
};
exports.AccessControlModule = AccessControlModule;
exports.AccessControlModule = AccessControlModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([role_entity_1.RoleEntity, permission_entity_1.PermissionEntity])],
        controllers: [permissions_controller_1.PermissionsController, roles_controller_1.RolesController],
        providers: [permissions_service_1.PermissionsService, roles_service_1.RolesService],
        exports: [permissions_service_1.PermissionsService, roles_service_1.RolesService],
    })
], AccessControlModule);
//# sourceMappingURL=access-control.module.js.map