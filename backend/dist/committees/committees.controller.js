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
exports.CommitteesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const committee_dto_1 = require("./dto/committee.dto");
const committees_service_1 = require("./committees.service");
let CommitteesController = class CommitteesController {
    constructor(committeesService) {
        this.committeesService = committeesService;
    }
    findAll() {
        return this.committeesService.findAll();
    }
    findOne(id) {
        return this.committeesService.findOne(id);
    }
    create(dto) {
        return this.committeesService.create(dto);
    }
    update(id, dto) {
        return this.committeesService.update(id, dto);
    }
    remove(id) {
        return this.committeesService.remove(id);
    }
};
exports.CommitteesController = CommitteesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: [committee_dto_1.CommitteeResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List committees' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiOkResponse)({ type: committee_dto_1.CommitteeResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get committee by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiBody)({ type: committee_dto_1.CreateCommitteeDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: committee_dto_1.CommitteeResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create committee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [committee_dto_1.CreateCommitteeDto]),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiBody)({ type: committee_dto_1.UpdateCommitteeDto }),
    (0, swagger_1.ApiOkResponse)({ type: committee_dto_1.CommitteeResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update committee' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, committee_dto_1.UpdateCommitteeDto]),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_COMITE'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Committee deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete committee' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "remove", null);
exports.CommitteesController = CommitteesController = __decorate([
    (0, swagger_1.ApiTags)('Committees'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('committees'),
    __metadata("design:paramtypes", [committees_service_1.CommitteesService])
], CommitteesController);
//# sourceMappingURL=committees.controller.js.map