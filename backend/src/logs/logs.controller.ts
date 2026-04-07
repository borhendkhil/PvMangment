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
import { SkipActivityLog } from '../common/decorators/skip-activity-log.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CreateLogActivityDto, UpdateLogActivityDto } from './dto/log-activity.dto';
import { LogActivityResponseDto } from './dto/log-activity.dto';
import { LogActivityService } from './log-activity.service';

@ApiTags('Activity Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('activity-logs')
export class LogsController {
  constructor(private readonly logActivityService: LogActivityService) {}

  @Get()
  @Permissions('VIEW_SECURITY_LOGS')
  @ApiOkResponse({ type: [LogActivityResponseDto] })
  @ApiOperation({ summary: 'List activity logs' })
  findAll() {
    return this.logActivityService.findAll();
  }

  @Get(':id')
  @Permissions('VIEW_SECURITY_LOGS')
  @ApiOkResponse({ type: LogActivityResponseDto })
  @ApiOperation({ summary: 'Get activity log by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logActivityService.findOne(id);
  }

  @Post()
  @Permissions('VIEW_SECURITY_LOGS')
  @SkipActivityLog()
  @ApiBody({ type: CreateLogActivityDto })
  @ApiCreatedResponse({ type: LogActivityResponseDto })
  @ApiOperation({ summary: 'Create activity log' })
  create(@Body() dto: CreateLogActivityDto) {
    return this.logActivityService.create(dto);
  }

  @Patch(':id')
  @Permissions('VIEW_SECURITY_LOGS')
  @SkipActivityLog()
  @ApiBody({ type: UpdateLogActivityDto })
  @ApiOkResponse({ type: LogActivityResponseDto })
  @ApiOperation({ summary: 'Update activity log' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLogActivityDto) {
    return this.logActivityService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('VIEW_SECURITY_LOGS')
  @SkipActivityLog()
  @ApiNoContentResponse({ description: 'Activity log deleted' })
  @ApiOperation({ summary: 'Delete activity log' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logActivityService.remove(id);
  }
}
