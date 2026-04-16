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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getDirectorStats(req) {
        return this.dashboardService.getDirectorStats(req.user.id);
    }
    getCabinetStats() {
        return this.dashboardService.getCabinetStats();
    }
    getUserStats(req) {
        return this.dashboardService.getUserStats(req.user.id);
    }
    updateCabinetNotes(id, body) {
        return this.dashboardService.updateCabinetNotes(id, body);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('director/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get director dashboard statistics' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns dashboard stats specific to the director department' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getDirectorStats", null);
__decorate([
    (0, common_1.Get)('cabinet/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Admin Cabinet dashboard statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getCabinetStats", null);
__decorate([
    (0, common_1.Get)('user/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get authenticated user dashboard statistics' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Patch)('cabinet/sessions/:id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cabinet notes and warnings for session' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "updateCabinetNotes", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map