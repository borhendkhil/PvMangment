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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const employe_dto_1 = require("./dto/employe.dto");
const employe_dto_2 = require("./dto/employe.dto");
const employes_service_1 = require("./employes.service");
let EmployeesController = class EmployeesController {
    constructor(employesService) {
        this.employesService = employesService;
    }
    findAll() {
        return this.employesService.findAll();
    }
    findOne(id) {
        return this.employesService.findOne(id);
    }
    create(dto) {
        return this.employesService.create(dto);
    }
    update(id, dto) {
        return this.employesService.update(id, dto);
    }
    remove(id) {
        return this.employesService.remove(id);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS', 'MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: [employe_dto_2.EmployeResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List employees' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS', 'MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: employe_dto_2.EmployeResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiBody)({ type: employe_dto_1.CreateEmployeDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: employe_dto_2.EmployeResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create employee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employe_dto_1.CreateEmployeDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiBody)({ type: employe_dto_1.UpdateEmployeDto }),
    (0, swagger_1.ApiOkResponse)({ type: employe_dto_2.EmployeResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update employee' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, employe_dto_1.UpdateEmployeDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_USERS'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Employee deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete employee' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "remove", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employes_service_1.EmployesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map