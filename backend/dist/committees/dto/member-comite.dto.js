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
exports.MemberComiteResponseDto = exports.UpdateMemberComiteDto = exports.CreateMemberComiteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMemberComiteDto {
}
exports.CreateMemberComiteDto = CreateMemberComiteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMemberComiteDto.prototype, "comiteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMemberComiteDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], CreateMemberComiteDto.prototype, "roleComiteId", void 0);
class UpdateMemberComiteDto extends (0, swagger_1.PartialType)(CreateMemberComiteDto) {
}
exports.UpdateMemberComiteDto = UpdateMemberComiteDto;
class MemberComiteResponseDto {
}
exports.MemberComiteResponseDto = MemberComiteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MemberComiteResponseDto.prototype, "comiteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MemberComiteResponseDto.prototype, "employeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], MemberComiteResponseDto.prototype, "roleComiteId", void 0);
//# sourceMappingURL=member-comite.dto.js.map