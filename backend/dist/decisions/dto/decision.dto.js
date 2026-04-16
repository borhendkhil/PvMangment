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
exports.UpdateDecisionAssignedReportDto = exports.DecisionResponseDto = exports.UpdateDecisionDto = exports.CreateDecisionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDecisionDto {
}
exports.CreateDecisionDto = CreateDecisionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "sujetId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "comiteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ADM-2026-001', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "numAdmin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Title', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Decision description', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'التوصية المعتمدة للجلسة', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "recommendationText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'الإدارة العامة ...', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "executionStructure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'نهاية شهر أفريل 2026', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "deadlineText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/files/decision.pdf', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "fichierPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'decision.pdf', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "fichierName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'approved', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDecisionDto.prototype, "current", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-04-06T12:00:00Z', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateDecisionDto.prototype, "dateUpload", void 0);
class UpdateDecisionDto extends (0, swagger_1.PartialType)(CreateDecisionDto) {
}
exports.UpdateDecisionDto = UpdateDecisionDto;
class DecisionResponseDto {
}
exports.DecisionResponseDto = DecisionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DecisionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 1 }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "sujetId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        nullable: true,
        example: { id: 1, sujet: 'Sécurité informatique' },
    }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 1 }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 1 }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "comiteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'ADM-2026-001' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "numAdmin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'Title' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'Decision description' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'التوصية المعتمدة للجلسة' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "recommendationText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'الإدارة العامة ...' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "executionStructure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'نهاية شهر أفريل 2026' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "deadlineText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: false }),
    __metadata("design:type", Boolean)
], DecisionResponseDto.prototype, "current", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '/uploads/decision.pdf' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "fichierPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'decision.pdf' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "fichierName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '2026-04-07T00:00:00.000Z' }),
    __metadata("design:type", Object)
], DecisionResponseDto.prototype, "dateUpload", void 0);
class UpdateDecisionAssignedReportDto {
}
exports.UpdateDecisionAssignedReportDto = UpdateDecisionAssignedReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'التوصية المعتمدة للجلسة', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdateDecisionAssignedReportDto.prototype, "recommendationText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'الإدارة العامة ...', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], UpdateDecisionAssignedReportDto.prototype, "executionStructure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'نهاية شهر أفريل 2026', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], UpdateDecisionAssignedReportDto.prototype, "deadlineText", void 0);
//# sourceMappingURL=decision.dto.js.map