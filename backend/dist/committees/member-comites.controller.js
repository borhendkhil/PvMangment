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
exports.MemberComitesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const member_comite_dto_1 = require("./dto/member-comite.dto");
const member_comites_service_1 = require("./member-comites.service");
let MemberComitesController = class MemberComitesController {
    constructor(memberComitesService) {
        this.memberComitesService = memberComitesService;
    }
    findAll() {
        return this.memberComitesService.findAll();
    }
    findOne(comiteId, employeId) {
        return this.memberComitesService.findOne(comiteId, employeId);
    }
    create(dto) {
        return this.memberComitesService.create(dto);
    }
    update(comiteId, employeId, dto) {
        return this.memberComitesService.update(comiteId, employeId, dto);
    }
    remove(comiteId, employeId) {
        return this.memberComitesService.remove(comiteId, employeId);
    }
};
exports.MemberComitesController = MemberComitesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: [member_comite_dto_1.MemberComiteResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List committee members' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MemberComitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':comiteId/:employeId'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: member_comite_dto_1.MemberComiteResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get committee member by composite key' }),
    __param(0, (0, common_1.Param)('comiteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('employeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], MemberComitesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiBody)({ type: member_comite_dto_1.CreateMemberComiteDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: member_comite_dto_1.MemberComiteResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Add member to committee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [member_comite_dto_1.CreateMemberComiteDto]),
    __metadata("design:returntype", void 0)
], MemberComitesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':comiteId/:employeId'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiBody)({ type: member_comite_dto_1.UpdateMemberComiteDto }),
    (0, swagger_1.ApiOkResponse)({ type: member_comite_dto_1.MemberComiteResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update committee member role' }),
    __param(0, (0, common_1.Param)('comiteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('employeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, member_comite_dto_1.UpdateMemberComiteDto]),
    __metadata("design:returntype", void 0)
], MemberComitesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':comiteId/:employeId'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Committee member removed' }),
    (0, swagger_1.ApiOperation)({ summary: 'Remove committee member' }),
    __param(0, (0, common_1.Param)('comiteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('employeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], MemberComitesController.prototype, "remove", null);
exports.MemberComitesController = MemberComitesController = __decorate([
    (0, swagger_1.ApiTags)('Committee Members'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('committee-members'),
    __metadata("design:paramtypes", [member_comites_service_1.MemberComitesService])
], MemberComitesController);
//# sourceMappingURL=member-comites.controller.js.map