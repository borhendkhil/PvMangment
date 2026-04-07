import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  CreateSubjectDecisionDto,
  SubjectDecisionResponseDto,
  UpdateSubjectDecisionDto,
} from './dto/subject-decision.dto';
import { SubjectsService } from './subjects.service';

@ApiTags('Decision Subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('decision-subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @Permissions('MANAGE_DECISION')
  @ApiOkResponse({ type: [SubjectDecisionResponseDto] })
  @ApiOperation({ summary: 'List decision subjects' })
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_DECISION')
  @ApiOkResponse({ type: SubjectDecisionResponseDto })
  @ApiOperation({ summary: 'Get decision subject by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_DECISION')
  @ApiBody({ type: CreateSubjectDecisionDto })
  @ApiCreatedResponse({ type: SubjectDecisionResponseDto })
  @ApiOperation({ summary: 'Create decision subject' })
  create(@Body() dto: CreateSubjectDecisionDto) {
    return this.subjectsService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_DECISION')
  @ApiBody({ type: UpdateSubjectDecisionDto })
  @ApiOkResponse({ type: SubjectDecisionResponseDto })
  @ApiOperation({ summary: 'Update decision subject' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubjectDecisionDto) {
    return this.subjectsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_DECISION')
  @ApiNoContentResponse({ description: 'Decision subject deleted' })
  @ApiOperation({ summary: 'Delete decision subject' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.remove(id);
  }
}
