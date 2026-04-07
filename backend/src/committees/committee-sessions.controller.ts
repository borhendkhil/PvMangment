import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
import { RequestUser } from '../common/interfaces/request-user.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  CommitteeSessionResponseDto,
  CreateCommitteeSessionDto,
  UpdateCommitteeSessionDto,
} from './dto/committee-session.dto';
import { CommitteeSessionsService } from './committee-sessions.service';

@ApiTags('Committee Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('committee-sessions')
export class CommitteeSessionsController {
  constructor(private readonly committeeSessionsService: CommitteeSessionsService) {}

  @Get()
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: [CommitteeSessionResponseDto] })
  @ApiOperation({ summary: 'List committee sessions' })
  findAll() {
    return this.committeeSessionsService.findAll();
  }

  @Get('assigned/me')
  @ApiOkResponse({ type: [CommitteeSessionResponseDto] })
  @ApiOperation({ summary: 'List committee sessions assigned to authenticated member' })
  findAssignedSessions(@Req() request: { user: RequestUser }) {
    return this.committeeSessionsService.findAssignedToUser(request.user.id);
  }

  @Patch('assigned/:id/report')
  @ApiBody({ type: UpdateCommitteeSessionDto })
  @ApiOkResponse({ type: CommitteeSessionResponseDto })
  @ApiOperation({ summary: 'Update report fields for assigned session (rapporteur only)' })
  updateAssignedReport(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: { user: RequestUser },
    @Body() dto: UpdateCommitteeSessionDto,
  ) {
    return this.committeeSessionsService.updateAssignedReport(request.user.id, id, dto);
  }

  @Get(':id')
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: CommitteeSessionResponseDto })
  @ApiOperation({ summary: 'Get committee session by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.committeeSessionsService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: CreateCommitteeSessionDto })
  @ApiCreatedResponse({ type: CommitteeSessionResponseDto })
  @ApiOperation({ summary: 'Create committee session' })
  create(@Body() dto: CreateCommitteeSessionDto) {
    return this.committeeSessionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: UpdateCommitteeSessionDto })
  @ApiOkResponse({ type: CommitteeSessionResponseDto })
  @ApiOperation({ summary: 'Update committee session' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommitteeSessionDto) {
    return this.committeeSessionsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_COMITE')
  @ApiNoContentResponse({ description: 'Committee session deleted' })
  @ApiOperation({ summary: 'Delete committee session' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.committeeSessionsService.remove(id);
  }
}
