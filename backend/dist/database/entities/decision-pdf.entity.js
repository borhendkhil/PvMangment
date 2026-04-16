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
exports.DecisionPdfEntity = void 0;
const typeorm_1 = require("typeorm");
const decision_entity_1 = require("./decision.entity");
let DecisionPdfEntity = class DecisionPdfEntity {
};
exports.DecisionPdfEntity = DecisionPdfEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], DecisionPdfEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => decision_entity_1.DecisionEntity, (decision) => decision.decisionPdfs, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'decision_id' }),
    __metadata("design:type", decision_entity_1.DecisionEntity)
], DecisionPdfEntity.prototype, "decision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pdf_path', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DecisionPdfEntity.prototype, "pdfPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pdf_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DecisionPdfEntity.prototype, "pdfName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_upload', type: 'datetime' }),
    __metadata("design:type", Date)
], DecisionPdfEntity.prototype, "dateUpload", void 0);
exports.DecisionPdfEntity = DecisionPdfEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'decision_pdf' })
], DecisionPdfEntity);
//# sourceMappingURL=decision-pdf.entity.js.map