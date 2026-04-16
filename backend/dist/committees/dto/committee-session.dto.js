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
exports.CommitteeSessionResponseDto = exports.UpdateCommitteeSessionDto = exports.CreateCommitteeSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCommitteeSessionDto {
}
exports.CreateCommitteeSessionDto = CreateCommitteeSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateCommitteeSessionDto.prototype, "comiteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-04-10T09:00:00Z', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateCommitteeSessionDto.prototype, "dateSession", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Board room', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateCommitteeSessionDto.prototype, "lieu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'planned', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateCommitteeSessionDto.prototype, "statut", void 0);
class UpdateCommitteeSessionDto extends (0, swagger_1.PartialType)(CreateCommitteeSessionDto) {
}
exports.UpdateCommitteeSessionDto = UpdateCommitteeSessionDto;
class CommitteeSessionResponseDto {
}
exports.CommitteeSessionResponseDto = CommitteeSessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CommitteeSessionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CommitteeSessionResponseDto.prototype, "comiteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '2026-04-10T09:00:00Z' }),
    __metadata("design:type", Object)
], CommitteeSessionResponseDto.prototype, "dateSession", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'Board room' }),
    __metadata("design:type", Object)
], CommitteeSessionResponseDto.prototype, "lieu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'planned' }),
    __metadata("design:type", Object)
], CommitteeSessionResponseDto.prototype, "statut", void 0);
//# sourceMappingURL=committee-session.dto.js.map