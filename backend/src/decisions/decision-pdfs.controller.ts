import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { DecisionsService } from './decisions.service';
import { CreateDecisionPdfDto, DecisionPdfResponseDto, UpdateDecisionPdfDto } from './dto/decision-pdf.dto';

const decisionPdfUploadDir = join(process.cwd(), 'uploads', 'decision-pdfs');
mkdirSync(decisionPdfUploadDir, { recursive: true });

function decodeMulterFileName(fileName?: string | null) {
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
  } catch {
    return fileName;
  }
}

@ApiTags('Decision PDFs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('decision-pdfs')
export class DecisionPdfsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  @Get()
  @Permissions('MANAGE_DECISION')
  @ApiOkResponse({ type: [DecisionPdfResponseDto] })
  @ApiOperation({ summary: 'List decision PDFs' })
  findAll() {
    return this.decisionsService.findAllDecisionPdfs();
  }

  @Get(':id')
  @Permissions('MANAGE_DECISION')
  @ApiOkResponse({ type: DecisionPdfResponseDto })
  @ApiOperation({ summary: 'Get decision PDF by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.decisionsService.findDecisionPdf(id);
  }

  @Post()
  @Permissions('MANAGE_DECISION')
  @ApiBody({ type: CreateDecisionPdfDto })
  @ApiCreatedResponse({ type: DecisionPdfResponseDto })
  @ApiOperation({ summary: 'Create decision PDF record' })
  create(@Body() dto: CreateDecisionPdfDto) {
    return this.decisionsService.createDecisionPdf(dto);
  }

  @Post('upload/:decisionId')
  @Permissions('MANAGE_DECISION')
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'decisionId', type: Number, example: 1 })
  @ApiOperation({ summary: 'Upload multiple PDFs for a decision and preserve Arabic filenames' })
  @UseInterceptors(FilesInterceptor('files', 10, { dest: decisionPdfUploadDir }))
  async uploadFiles(
    @Param('decisionId', ParseIntPipe) decisionId: number,
    @UploadedFiles() files: Array<{ path: string; originalname: string }>,
  ) {
    const renamedFiles = (files ?? []).map((file) => {
      const originalname = decodeMulterFileName(file.originalname);
      const safeName = `${uuidv4()}${extname(originalname)}`;
      const newPath = join(decisionPdfUploadDir, safeName);

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

  @Get('file/:safeName')
  @ApiOperation({ summary: 'Serve a PDF with its original filename in the response headers' })
  async servePdf(@Param('safeName') safeName: string, @Res() res: Response) {
    const pdf = await this.decisionsService.findDecisionPdfBySafeName(safeName);
    if (!pdf) {
      return res.status(404).send('File not found');
    }

    const filePath = join(decisionPdfUploadDir, safeName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    res.setHeader(
      'Content-Disposition',
      `inline; filename*=UTF-8''${encodeURIComponent(pdf.pdfName || safeName)}`,
    );
    return res.sendFile(filePath);
  }

  @Patch(':id')
  @Permissions('MANAGE_DECISION')
  @ApiBody({ type: UpdateDecisionPdfDto })
  @ApiOkResponse({ type: DecisionPdfResponseDto })
  @ApiOperation({ summary: 'Update decision PDF record' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDecisionPdfDto) {
    return this.decisionsService.updateDecisionPdf(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_DECISION')
  @ApiNoContentResponse({ description: 'Decision PDF deleted' })
  @ApiOperation({ summary: 'Delete decision PDF record' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.decisionsService.removeDecisionPdf(id);
  }
}
