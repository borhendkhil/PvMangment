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
exports.SubjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const subject_decision_dto_1 = require("./dto/subject-decision.dto");
const subjects_service_1 = require("./subjects.service");
let SubjectsController = class SubjectsController {
    constructor(subjectsService) {
        this.subjectsService = subjectsService;
    }
    findAll() {
        return this.subjectsService.findAll();
    }
    findOne(id) {
        return this.subjectsService.findOne(id);
    }
    create(dto) {
        return this.subjectsService.create(dto);
    }
    update(id, dto) {
        return this.subjectsService.update(id, dto);
    }
    remove(id) {
        return this.subjectsService.remove(id);
    }
};
exports.SubjectsController = SubjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiOkResponse)({ type: [subject_decision_dto_1.SubjectDecisionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List decision subjects' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiOkResponse)({ type: subject_decision_dto_1.SubjectDecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get decision subject by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiBody)({ type: subject_decision_dto_1.CreateSubjectDecisionDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: subject_decision_dto_1.SubjectDecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create decision subject' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subject_decision_dto_1.CreateSubjectDecisionDto]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiBody)({ type: subject_decision_dto_1.UpdateSubjectDecisionDto }),
    (0, swagger_1.ApiOkResponse)({ type: subject_decision_dto_1.SubjectDecisionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update decision subject' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, subject_decision_dto_1.UpdateSubjectDecisionDto]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Decision subject deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete decision subject' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubjectsController.prototype, "remove", null);
exports.SubjectsController = SubjectsController = __decorate([
    (0, swagger_1.ApiTags)('Decision Subjects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('decision-subjects'),
    __metadata("design:paramtypes", [subjects_service_1.SubjectsService])
], SubjectsController);
//# sourceMappingURL=subjects.controller.js.map