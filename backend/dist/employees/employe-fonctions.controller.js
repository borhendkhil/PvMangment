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
exports.EmployeFonctionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const employe_fonction_dto_1 = require("./dto/employe-fonction.dto");
const employe_fonction_dto_2 = require("./dto/employe-fonction.dto");
const employe_fonctions_service_1 = require("./employe-fonctions.service");
let EmployeFonctionsController = class EmployeFonctionsController {
    constructor(employeFonctionsService) {
        this.employeFonctionsService = employeFonctionsService;
    }
    getCurrentFunction(employeId) {
        return this.employeFonctionsService.getCurrentFunction(employeId);
    }
    findAll() {
        return this.employeFonctionsService.findAll();
    }
    findOne(id) {
        return this.employeFonctionsService.findOne(id);
    }
    create(dto) {
        return this.employeFonctionsService.create(dto);
    }
    update(id, dto) {
        return this.employeFonctionsService.update(id, dto);
    }
    remove(id) {
        return this.employeFonctionsService.remove(id);
    }
};
exports.EmployeFonctionsController = EmployeFonctionsController;
__decorate([
    (0, common_1.Get)('current/:employeId'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiOkResponse)({ type: employe_fonction_dto_2.EmployeFonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get current function of employee' }),
    __param(0, (0, common_1.Param)('employeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmployeFonctionsController.prototype, "getCurrentFunction", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiOkResponse)({ type: [employe_fonction_dto_2.EmployeFonctionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List employee function assignments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeFonctionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiOkResponse)({ type: employe_fonction_dto_2.EmployeFonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee function assignment by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmployeFonctionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiBody)({ type: employe_fonction_dto_1.CreateEmployeFonctionDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: employe_fonction_dto_2.EmployeFonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create employee function assignment' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employe_fonction_dto_1.CreateEmployeFonctionDto]),
    __metadata("design:returntype", void 0)
], EmployeFonctionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiBody)({ type: employe_fonction_dto_1.UpdateEmployeFonctionDto }),
    (0, swagger_1.ApiOkResponse)({ type: employe_fonction_dto_2.EmployeFonctionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update employee function assignment' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, employe_fonction_dto_1.UpdateEmployeFonctionDto]),
    __metadata("design:returntype", void 0)
], EmployeFonctionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Assignment deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete employee function assignment' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmployeFonctionsController.prototype, "remove", null);
exports.EmployeFonctionsController = EmployeFonctionsController = __decorate([
    (0, swagger_1.ApiTags)('Employee Functions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('employee-functions'),
    __metadata("design:paramtypes", [employe_fonctions_service_1.EmployeFonctionsService])
], EmployeFonctionsController);
//# sourceMappingURL=employe-fonctions.controller.js.map