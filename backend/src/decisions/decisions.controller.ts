import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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
import { CreateDecisionDto, DecisionResponseDto, UpdateDecisionDto } from './dto/decision.dto';
import { DecisionsService } from './decisions.service';

@ApiTags('Decisions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('decisions')
export class DecisionsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  @Get()
  @Permissions('MANAGE_DECISION')
  @ApiOkResponse({ type: [DecisionResponseDto] })
  @ApiOperation({ summary: 'List decisions' })
  findAll() {
    return this.decisionsService.findAll();
  }

  @Get('current/session/:sessionId')
  @Permissions('MANAGE_DECISION')
  @ApiParam({ name: 'sessionId', type: Number, example: 1 })
  @ApiOkResponse({ type: DecisionResponseDto })
  @ApiOperation({ summary: 'Get current decision for a session' })
  findCurrentDecision(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.decisionsService.findCurrentDecision(sessionId);
  }

  @Get(':id')
  @Permissions('MANAGE_DECISION')
  @ApiOkResponse({ type: DecisionResponseDto })
  @ApiOperation({ summary: 'Get decision by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.decisionsService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_DECISION')
  @ApiBody({ type: CreateDecisionDto })
  @ApiCreatedResponse({ type: DecisionResponseDto })
  @ApiOperation({ summary: 'Create decision' })
  create(@Body() dto: CreateDecisionDto) {
    return this.decisionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_DECISION')
  @ApiBody({ type: UpdateDecisionDto })
  @ApiOkResponse({ type: DecisionResponseDto })
  @ApiOperation({ summary: 'Update decision' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDecisionDto) {
    return this.decisionsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_DECISION')
  @ApiNoContentResponse({ description: 'Decision deleted' })
  @ApiOperation({ summary: 'Delete decision' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.decisionsService.remove(id);
  }
}
