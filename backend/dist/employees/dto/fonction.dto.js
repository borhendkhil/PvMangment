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
exports.FonctionResponseDto = exports.UpdateFonctionDto = exports.CreateFonctionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateFonctionDto {
}
exports.CreateFonctionDto = CreateFonctionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'directeur' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateFonctionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'مدير' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateFonctionDto.prototype, "label_ar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Number], example: [1, 4] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    __metadata("design:type", Array)
], CreateFonctionDto.prototype, "roleIds", void 0);
class UpdateFonctionDto extends (0, swagger_1.PartialType)(CreateFonctionDto) {
}
exports.UpdateFonctionDto = UpdateFonctionDto;
class FonctionResponseDto {
}
exports.FonctionResponseDto = FonctionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], FonctionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'directeur' }),
    __metadata("design:type", String)
], FonctionResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'مدير' }),
    __metadata("design:type", String)
], FonctionResponseDto.prototype, "label_ar", void 0);
//# sourceMappingURL=fonction.dto.js.map