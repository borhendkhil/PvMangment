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
exports.EmployeResponseDto = exports.UpdateEmployeDto = exports.CreateEmployeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEmployeDto {
}
exports.CreateEmployeDto = CreateEmployeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A123', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateEmployeDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dupont' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateEmployeDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nadia' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateEmployeDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12345678', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", Object)
], CreateEmployeDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tunis', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateEmployeDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateEmployeDto.prototype, "directionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateEmployeDto.prototype, "userId", void 0);
class UpdateEmployeDto extends (0, swagger_1.PartialType)(CreateEmployeDto) {
}
exports.UpdateEmployeDto = UpdateEmployeDto;
class EmployeResponseDto {
}
exports.EmployeResponseDto = EmployeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], EmployeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'A123' }),
    __metadata("design:type", Object)
], EmployeResponseDto.prototype, "matricule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dupont' }),
    __metadata("design:type", String)
], EmployeResponseDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nadia' }),
    __metadata("design:type", String)
], EmployeResponseDto.prototype, "prenom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '12345678' }),
    __metadata("design:type", Object)
], EmployeResponseDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'Tunis' }),
    __metadata("design:type", Object)
], EmployeResponseDto.prototype, "address", void 0);
//# sourceMappingURL=employe.dto.js.map