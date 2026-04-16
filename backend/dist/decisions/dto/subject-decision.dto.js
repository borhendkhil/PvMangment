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
exports.SubjectDecisionResponseDto = exports.UpdateSubjectDecisionDto = exports.CreateSubjectDecisionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSubjectDecisionDto {
}
exports.CreateSubjectDecisionDto = CreateSubjectDecisionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sécurité informatique' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateSubjectDecisionDto.prototype, "sujet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sujet détaillé', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateSubjectDecisionDto.prototype, "description", void 0);
class UpdateSubjectDecisionDto extends (0, swagger_1.PartialType)(CreateSubjectDecisionDto) {
}
exports.UpdateSubjectDecisionDto = UpdateSubjectDecisionDto;
class SubjectDecisionResponseDto {
}
exports.SubjectDecisionResponseDto = SubjectDecisionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], SubjectDecisionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sécurité informatique' }),
    __metadata("design:type", String)
], SubjectDecisionResponseDto.prototype, "sujet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'Sujet détaillé' }),
    __metadata("design:type", Object)
], SubjectDecisionResponseDto.prototype, "description", void 0);
//# sourceMappingURL=subject-decision.dto.js.map