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
exports.DecisionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const decision_dto_1 = require("./dto/decision.dto");
const decisions_service_1 = require("./decisions.service");
let DecisionsController = class DecisionsController {
    constructor(decisionsService) {
        this.decisionsService = decisionsService;
    }
    findAll() {
        return this.decisionsService.findAll();
    }
    findMyAssignedDecisions(request) {
        return this.decisionsService.findAssignedToUser(request.user.id);
    }
    updateAssignedDecisionReport(id, request, dto) {
        return this.decisionsService.updateAssignedReportRow(request.user.id, id, dto);
    }
    findCurrentDecision(sessionId) {
        return this.decisionsService.findCurrentDecision(sessionId);
    }
    findOne(id) {
        return this.decisionsService.findOne(id);
    }
    create(dto) {
        return this.decisionsService.create(dto);
    }
    update(id, dto) {
        return this.decisionsService.update(id, dto);
    }
    remove(id) {
        return this.decisionsService.remove(id);
    }
};
exports.DecisionsController = DecisionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiOkResponse)({ type: [decision_dto_1.DecisionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List decisions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('assigned/me'),
    (0, swagger_1.ApiOkResponse)({ type: [decision_dto_1.DecisionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List decisions assigned to the authenticated committee member' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "findMyAssignedDecisions", null);
__decorate([
    (0, common_1.Patch)('assigned/:id/report'),
    (0, swagger_1.ApiBody)({ type: decision_dto_1.UpdateDecisionAssignedReportDto }),
    (0, swagger_1.ApiOkResponse)({ type: decision_dto_1.DecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update assigned decision report row (rapporteur only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, decision_dto_1.UpdateDecisionAssignedReportDto]),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "updateAssignedDecisionReport", null);
__decorate([
    (0, common_1.Get)('current/session/:sessionId'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiParam)({ name: 'sessionId', type: Number, example: 1 }),
    (0, swagger_1.ApiOkResponse)({ type: decision_dto_1.DecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get current decision for a session' }),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "findCurrentDecision", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiOkResponse)({ type: decision_dto_1.DecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get decision by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiBody)({ type: decision_dto_1.CreateDecisionDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: decision_dto_1.DecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create decision' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [decision_dto_1.CreateDecisionDto]),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiBody)({ type: decision_dto_1.UpdateDecisionDto }),
    (0, swagger_1.ApiOkResponse)({ type: decision_dto_1.DecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update decision' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, decision_dto_1.UpdateDecisionDto]),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Decision deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete decision' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DecisionsController.prototype, "remove", null);
exports.DecisionsController = DecisionsController = __decorate([
    (0, swagger_1.ApiTags)('Decisions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('decisions'),
    __metadata("design:paramtypes", [decisions_service_1.DecisionsService])
], DecisionsController);
//# sourceMappingURL=decisions.controller.js.map