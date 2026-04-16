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
exports.CommitteeSessionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const committee_session_dto_1 = require("./dto/committee-session.dto");
const committee_sessions_service_1 = require("./committee-sessions.service");
let CommitteeSessionsController = class CommitteeSessionsController {
    constructor(committeeSessionsService) {
        this.committeeSessionsService = committeeSessionsService;
    }
    findAll() {
        return this.committeeSessionsService.findAll();
    }
    findAssignedSessions(request) {
        return this.committeeSessionsService.findAssignedToUser(request.user.id);
    }
    updateAssignedReport(id, request, dto) {
        return this.committeeSessionsService.updateAssignedReport(request.user.id, id, dto);
    }
    findOne(id) {
        return this.committeeSessionsService.findOne(id);
    }
    create(dto) {
        return this.committeeSessionsService.create(dto);
    }
    update(id, dto) {
        return this.committeeSessionsService.update(id, dto);
    }
    remove(id) {
        return this.committeeSessionsService.remove(id);
    }
};
exports.CommitteeSessionsController = CommitteeSessionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: [committee_session_dto_1.CommitteeSessionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List committee sessions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommitteeSessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('assigned/me'),
    (0, swagger_1.ApiOkResponse)({ type: [committee_session_dto_1.CommitteeSessionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List committee sessions assigned to authenticated member' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommitteeSessionsController.prototype, "findAssignedSessions", null);
__decorate([
    (0, common_1.Patch)('assigned/:id/report'),
    (0, swagger_1.ApiBody)({ type: committee_session_dto_1.UpdateCommitteeSessionDto }),
    (0, swagger_1.ApiOkResponse)({ type: committee_session_dto_1.CommitteeSessionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update report fields for assigned session (rapporteur only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, committee_session_dto_1.UpdateCommitteeSessionDto]),
    __metadata("design:returntype", void 0)
], CommitteeSessionsController.prototype, "updateAssignedReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: committee_session_dto_1.CommitteeSessionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get committee session by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommitteeSessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiBody)({ type: committee_session_dto_1.CreateCommitteeSessionDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: committee_session_dto_1.CommitteeSessionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create committee session' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [committee_session_dto_1.CreateCommitteeSessionDto]),
    __metadata("design:returntype", void 0)
], CommitteeSessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiBody)({ type: committee_session_dto_1.UpdateCommitteeSessionDto }),
    (0, swagger_1.ApiOkResponse)({ type: committee_session_dto_1.CommitteeSessionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update committee session' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, committee_session_dto_1.UpdateCommitteeSessionDto]),
    __metadata("design:returntype", void 0)
], CommitteeSessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Committee session deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete committee session' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommitteeSessionsController.prototype, "remove", null);
exports.CommitteeSessionsController = CommitteeSessionsController = __decorate([
    (0, swagger_1.ApiTags)('Committee Sessions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('committee-sessions'),
    __metadata("design:paramtypes", [committee_sessions_service_1.CommitteeSessionsService])
], CommitteeSessionsController);
//# sourceMappingURL=committee-sessions.controller.js.map