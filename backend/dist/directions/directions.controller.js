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
exports.DirectionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const direction_dto_1 = require("./dto/direction.dto");
const directions_service_1 = require("./directions.service");
let DirectionsController = class DirectionsController {
    constructor(directionsService) {
        this.directionsService = directionsService;
    }
    findAll() {
        return this.directionsService.findAll();
    }
    findOne(id) {
        return this.directionsService.findOne(id);
    }
    create(dto) {
        return this.directionsService.create(dto);
    }
    update(id, dto) {
        return this.directionsService.update(id, dto);
    }
    remove(id) {
        return this.directionsService.remove(id);
    }
};
exports.DirectionsController = DirectionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DIRECTIONS'),
    (0, swagger_1.ApiOkResponse)({ type: [direction_dto_1.DirectionResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List directions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DirectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DIRECTIONS'),
    (0, swagger_1.ApiOkResponse)({ type: direction_dto_1.DirectionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get direction by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DirectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DIRECTIONS'),
    (0, swagger_1.ApiBody)({ type: direction_dto_1.CreateDirectionDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: direction_dto_1.DirectionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create direction' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [direction_dto_1.CreateDirectionDto]),
    __metadata("design:returntype", void 0)
], DirectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DIRECTIONS'),
    (0, swagger_1.ApiBody)({ type: direction_dto_1.UpdateDirectionDto }),
    (0, swagger_1.ApiOkResponse)({ type: direction_dto_1.DirectionResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update direction' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, direction_dto_1.UpdateDirectionDto]),
    __metadata("design:returntype", void 0)
], DirectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DIRECTIONS'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Direction deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete direction' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DirectionsController.prototype, "remove", null);
exports.DirectionsController = DirectionsController = __decorate([
    (0, swagger_1.ApiTags)('Directions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('directions'),
    __metadata("design:paramtypes", [directions_service_1.DirectionsService])
], DirectionsController);
//# sourceMappingURL=directions.controller.js.map