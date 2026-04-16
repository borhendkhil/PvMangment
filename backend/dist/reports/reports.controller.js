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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const reports_service_1 = require("./reports.service");
const report_dto_1 = require("./dto/report.dto");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getReport(sessionId) {
        return this.reportsService.getSessionReport(sessionId);
    }
    async saveReport(req, sessionId, dto) {
        return this.reportsService.saveReport(sessionId, req.user.id, dto);
    }
    async getFeedbacks(reportId) {
        return this.reportsService.getReportFeedbacks(reportId);
    }
    async createFeedback(req, reportId, dto) {
        return this.reportsService.initializeFeedback(reportId, req.user.id, dto);
    }
    async deleteFeedback(req, feedbackId) {
        return this.reportsService.deleteFeedback(feedbackId, req.user.id);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)(':sessionId/report'),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReport", null);
__decorate([
    (0, common_1.Patch)(':sessionId/report'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('sessionId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, report_dto_1.SaveSessionReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "saveReport", null);
__decorate([
    (0, common_1.Get)('reports/:reportId/feedbacks'),
    __param(0, (0, common_1.Param)('reportId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Post)('reports/:reportId/feedbacks'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reportId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, report_dto_1.FeedbackDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Delete)('feedbacks/:feedbackId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('feedbackId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteFeedback", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('sessions'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map