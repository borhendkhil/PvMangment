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
exports.EmployeFonctionResponseDto = exports.UpdateEmployeFonctionDto = exports.CreateEmployeFonctionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEmployeFonctionDto {
}
exports.CreateEmployeFonctionDto = CreateEmployeFonctionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateEmployeFonctionDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateEmployeFonctionDto.prototype, "fonctionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEmployeFonctionDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateEmployeFonctionDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEmployeFonctionDto.prototype, "isActive", void 0);
class UpdateEmployeFonctionDto extends (0, swagger_1.PartialType)(CreateEmployeFonctionDto) {
}
exports.UpdateEmployeFonctionDto = UpdateEmployeFonctionDto;
class EmployeFonctionResponseDto {
}
exports.EmployeFonctionResponseDto = EmployeFonctionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EmployeFonctionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], EmployeFonctionResponseDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], EmployeFonctionResponseDto.prototype, "fonctionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-01' }),
    __metadata("design:type", String)
], EmployeFonctionResponseDto.prototype, "dateDebut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31', nullable: true }),
    __metadata("design:type", Object)
], EmployeFonctionResponseDto.prototype, "dateFin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], EmployeFonctionResponseDto.prototype, "isActive", void 0);
//# sourceMappingURL=employe-fonction.dto.js.map