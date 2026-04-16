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
exports.DirectionResponseDto = exports.UpdateDirectionDto = exports.CreateDirectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDirectionDto {
}
exports.CreateDirectionDto = CreateDirectionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '07', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", Object)
], CreateDirectionDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Direction centrale' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateDirectionDto.prototype, "lib", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tunis', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateDirectionDto.prototype, "address", void 0);
class UpdateDirectionDto extends (0, swagger_1.PartialType)(CreateDirectionDto) {
}
exports.UpdateDirectionDto = UpdateDirectionDto;
class DirectionResponseDto {
}
exports.DirectionResponseDto = DirectionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DirectionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '07' }),
    __metadata("design:type", Object)
], DirectionResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Direction centrale' }),
    __metadata("design:type", String)
], DirectionResponseDto.prototype, "lib", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'Tunis' }),
    __metadata("design:type", Object)
], DirectionResponseDto.prototype, "address", void 0);
//# sourceMappingURL=direction.dto.js.map