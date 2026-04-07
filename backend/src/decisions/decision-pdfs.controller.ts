import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { join } from 'path';
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
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CreateDecisionPdfDto, UpdateDecisionPdfDto } from './dto/decision-pdf.dto';
import { DecisionPdfResponseDto } from './dto/decision-pdf.dto';
import { DecisionsService } from './decisions.service';

const decisionPdfUploadDir = join(process.cwd(), 'uploads', 'decision-pdfs');
mkdirSync(decisionPdfUploadDir, { recursive: true });

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
  @ApiOperation({ summary: 'Upload multiple PDFs for a decision' })
  @UseInterceptors(FilesInterceptor('files', 10, { dest: decisionPdfUploadDir }))
  uploadFiles(
    @Param('decisionId', ParseIntPipe) decisionId: number,
    @UploadedFiles() files: any[],
  ) {
    return this.decisionsService.addDecisionPdfs(decisionId, files ?? []);
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
