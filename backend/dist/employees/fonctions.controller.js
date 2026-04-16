"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonctionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const fonction_dto_1 = require("./dto/fonction.dto");
const fonction_dto_2 = require("./dto/fonction.dto");
const fonctions_service_1 = require("./fonctions.service");
const users_role_mapping_dto_1 = require("./users-role-mapping.dto");
let FonctionsController = class FonctionsController {
    constructor(fonctionsService) {
        this.fonctionsService = fonctionsService;
    }
    findAll() {
        return this.fonctionsService.findAll();
    }
    findOne(id) {
        return this.fonctionsService.findOne(id);
    }
    create(dto) {
        return this.fonctionsService.create(dto);
    }
    update(id, dto) {
        return this.fonctionsService.update(id, dto);
    }
    setRoles(id, dto) {
        return this.fonctionsService.setRoles(id, dto.roleIds);
    }
    remove(id) {
        return this.fonctionsService.remove(id);
    }
};
exports.FonctionsController = FonctionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiOkResponse)({ type: [fonction_dto_2.FonctionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List functions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FonctionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiOkResponse)({ type: fonction_dto_2.FonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get function by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FonctionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiBody)({ type: fonction_dto_1.CreateFonctionDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: fonction_dto_2.FonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create function' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fonction_dto_1.CreateFonctionDto]),
    __metadata("design:returntype", void 0)
], FonctionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiBody)({ type: fonction_dto_1.UpdateFonctionDto }),
    (0, swagger_1.ApiOkResponse)({ type: fonction_dto_2.FonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update function' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, fonction_dto_1.UpdateFonctionDto]),
    __metadata("design:returntype", void 0)
], FonctionsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/roles'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiBody)({ type: users_role_mapping_dto_1.SetRoleIdsDto }),
    (0, swagger_1.ApiOkResponse)({ type: fonction_dto_2.FonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Replace function roles' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, users_role_mapping_dto_1.SetRoleIdsDto]),
    __metadata("design:returntype", void 0)
], FonctionsController.prototype, "setRoles", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Function deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete function' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FonctionsController.prototype, "remove", null);
exports.FonctionsController = FonctionsController = __decorate([
    (0, swagger_1.ApiTags)('Fonctions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('fonctions'),
    __metadata("design:paramtypes", [fonctions_service_1.FonctionsService])
], FonctionsController);
//# sourceMappingURL=fonctions.controller.js.map