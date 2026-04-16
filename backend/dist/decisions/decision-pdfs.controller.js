"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionPdfsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const decisions_service_1 = require("./decisions.service");
const decision_pdf_dto_1 = require("./dto/decision-pdf.dto");
const decisionPdfUploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'decision-pdfs');
(0, fs_1.mkdirSync)(decisionPdfUploadDir, { recursive: true });
function decodeMulterFileName(fileName) {
    if (!fileName) {
        return '';
    }
    const looksMisencoded = /(?:\u00C3|\u00D8|\u00D9|\u00D0|\u00D1|\uFFFD|[\u0080-\u009F])/.test(fileName);
    if (!looksMisencoded) {
        return fileName;
    }
    try {
        const decoded = Buffer.from(fileName, 'latin1').toString('utf8');
        return decoded && !decoded.includes('\uFFFD') ? decoded : fileName;
    }
    catch {
        return fileName;
    }
}
let DecisionPdfsController = class DecisionPdfsController {
    constructor(decisionsService) {
        this.decisionsService = decisionsService;
    }
    findAll() {
        return this.decisionsService.findAllDecisionPdfs();
    }
    findOne(id) {
        return this.decisionsService.findDecisionPdf(id);
    }
    create(dto) {
        return this.decisionsService.createDecisionPdf(dto);
    }
    async uploadFiles(decisionId, files) {
        const renamedFiles = (files ?? []).map((file) => {
            const originalname = decodeMulterFileName(file.originalname);
            const safeName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(originalname)}`;
            const newPath = (0, path_1.join)(decisionPdfUploadDir, safeName);
            fs.renameSync(file.path, newPath);
            return {
                ...file,
                path: newPath,
                filename: safeName,
                originalname,
            };
        });
        return this.decisionsService.addDecisionPdfs(decisionId, renamedFiles);
    }
    async servePdf(safeName, res) {
        const pdf = await this.decisionsService.findDecisionPdfBySafeName(safeName);
        if (!pdf) {
            return res.status(404).send('File not found');
        }
        const filePath = (0, path_1.join)(decisionPdfUploadDir, safeName);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }
        res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(pdf.pdfName || safeName)}`);
        return res.sendFile(filePath);
    }
    update(id, dto) {
        return this.decisionsService.updateDecisionPdf(id, dto);
    }
    remove(id) {
        return this.decisionsService.removeDecisionPdf(id);
    }
};
exports.DecisionPdfsController = DecisionPdfsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiOkResponse)({ type: [decision_pdf_dto_1.DecisionPdfResponseDto] }),
    (0, swagger_1.ApiOperation)({ summary: 'List decision PDFs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DecisionPdfsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiOkResponse)({ type: decision_pdf_dto_1.DecisionPdfResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Get decision PDF by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DecisionPdfsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiBody)({ type: decision_pdf_dto_1.CreateDecisionPdfDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: decision_pdf_dto_1.DecisionPdfResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Create decision PDF record' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [decision_pdf_dto_1.CreateDecisionPdfDto]),
    __metadata("design:returntype", void 0)
], DecisionPdfsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload/:decisionId'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'decisionId', type: Number, example: 1 }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple PDFs for a decision and preserve Arabic filenames' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, { dest: decisionPdfUploadDir })),
    __param(0, (0, common_1.Param)('decisionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], DecisionPdfsController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Get)('file/:safeName'),
    (0, swagger_1.ApiOperation)({ summary: 'Serve a PDF with its original filename in the response headers' }),
    __param(0, (0, common_1.Param)('safeName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DecisionPdfsController.prototype, "servePdf", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiBody)({ type: decision_pdf_dto_1.UpdateDecisionPdfDto }),
    (0, swagger_1.ApiOkResponse)({ type: decision_pdf_dto_1.DecisionPdfResponseDto }),
    (0, swagger_1.ApiOperation)({ summary: 'Update decision PDF record' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, decision_pdf_dto_1.UpdateDecisionPdfDto]),
    __metadata("design:returntype", void 0)
], DecisionPdfsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('MANAGE_DECISION'),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Decision PDF deleted' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete decision PDF record' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DecisionPdfsController.prototype, "remove", null);
exports.DecisionPdfsController = DecisionPdfsController = __decorate([
    (0, swagger_1.ApiTags)('Decision PDFs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('decision-pdfs'),
    __metadata("design:paramtypes", [decisions_service_1.DecisionsService])
], DecisionPdfsController);
//# sourceMappingURL=decision-pdfs.controller.js.map