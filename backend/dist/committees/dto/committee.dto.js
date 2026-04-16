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
exports.CommitteeResponseDto = exports.UpdateCommitteeDto = exports.CreateCommitteeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decision_dto_1 = require("../../decisions/dto/decision.dto");
class CreateCommitteeDto {
}
exports.CreateCommitteeDto = CreateCommitteeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PV Committee' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateCommitteeDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Direction committee', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateCommitteeDto.prototype, "description", void 0);
class UpdateCommitteeDto extends (0, swagger_1.PartialType)(CreateCommitteeDto) {
}
exports.UpdateCommitteeDto = UpdateCommitteeDto;
class CommitteeResponseDto {
}
exports.CommitteeResponseDto = CommitteeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CommitteeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PV Committee' }),
    __metadata("design:type", String)
], CommitteeResponseDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'Direction committee' }),
    __metadata("design:type", Object)
], CommitteeResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    __metadata("design:type", Number)
], CommitteeResponseDto.prototype, "totalSessions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    __metadata("design:type", Number)
], CommitteeResponseDto.prototype, "totalMembres", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    __metadata("design:type", Number)
], CommitteeResponseDto.prototype, "totalDecisions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [decision_dto_1.DecisionResponseDto] }),
    __metadata("design:type", Array)
], CommitteeResponseDto.prototype, "decisions", void 0);
//# sourceMappingURL=committee.dto.js.map