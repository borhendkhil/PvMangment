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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogActivityResponseDto = exports.UpdateLogActivityDto = exports.CreateLogActivityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLogActivityDto {
}
exports.CreateLogActivityDto = CreateLogActivityDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateLogActivityDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'POST /users' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateLogActivityDto.prototype, "action", void 0);
class UpdateLogActivityDto extends (0, swagger_1.PartialType)(CreateLogActivityDto) {
}
exports.UpdateLogActivityDto = UpdateLogActivityDto;
class LogActivityResponseDto {
}
exports.LogActivityResponseDto = LogActivityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], LogActivityResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], LogActivityResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'POST /users', nullable: true }),
    __metadata("design:type", Object)
], LogActivityResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-06T12:00:00.000Z' }),
    __metadata("design:type", Date)
], LogActivityResponseDto.prototype, "dateAction", void 0);
//# sourceMappingURL=log-activity.dto.js.map