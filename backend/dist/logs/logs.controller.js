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
exports.LogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const skip_activity_log_decorator_1 = require("../common/decorators/skip-activity-log.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const log_activity_dto_1 = require("./dto/log-activity.dto");
const log_activity_dto_2 = require("./dto/log-activity.dto");
const log_activity_service_1 = require("./log-activity.service");
let LogsController = class LogsController {
    constructor(logActivityService) {
        this.logActivityService = logActivityService;
    }
    findAll() {
        return this.logActivityService.findAll();
    }
    findOne(id) {
        return this.logActivityService.findOne(id);
    }
    create(dto) {
        return this.logActivityService.create(dto);
    }
    update(id, dto) {
        return this.logActivityService.update(id, dto);
    }
    remove(id) {
        return this.logActivityService.remove(id);
    }
};
exports.LogsController = LogsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('VIEW_SECURITY_LOGS'),
    (0, swagger_1.ApiOkResponse)({ type: [log_activity_dto_2.LogActivityResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List activity logs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('VIEW_SECURITY_LOGS'),
    (0, swagger_1.ApiOkResponse)({ type: log_activity_dto_2.LogActivityResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity log by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('VIEW_SECURITY_LOGS'),
    (0, skip_activity_log_decorator_1.SkipActivityLog)(),
    (0, swagger_1.ApiBody)({ type: log_activity_dto_1.CreateLogActivityDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: log_activity_dto_2.LogActivityResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create activity log' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [log_activity_dto_1.CreateLogActivityDto]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('VIEW_SECURITY_LOGS'),
    (0, skip_activity_log_decorator_1.SkipActivityLog)(),
    (0, swagger_1.ApiBody)({ type: log_activity_dto_1.UpdateLogActivityDto }),
    (0, swagger_1.ApiOkResponse)({ type: log_activity_dto_2.LogActivityResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update activity log' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, log_activity_dto_1.UpdateLogActivityDto]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('VIEW_SECURITY_LOGS'),
    (0, skip_activity_log_decorator_1.SkipActivityLog)(),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Activity log deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete activity log' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "remove", null);
exports.LogsController = LogsController = __decorate([
    (0, swagger_1.ApiTags)('Activity Logs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('activity-logs'),
    __metadata("design:paramtypes", [log_activity_service_1.LogActivityService])
], LogsController);
//# sourceMappingURL=logs.controller.js.map