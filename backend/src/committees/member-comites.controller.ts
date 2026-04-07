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
  CreateMemberComiteDto,
  MemberComiteResponseDto,
  UpdateMemberComiteDto,
} from './dto/member-comite.dto';
import { MemberComitesService } from './member-comites.service';

@ApiTags('Committee Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('committee-members')
export class MemberComitesController {
  constructor(private readonly memberComitesService: MemberComitesService) {}

  @Get()
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: [MemberComiteResponseDto] })
  @ApiOperation({ summary: 'List committee members' })
  findAll() {
    return this.memberComitesService.findAll();
  }

  @Get(':comiteId/:employeId')
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: MemberComiteResponseDto })
  @ApiOperation({ summary: 'Get committee member by composite key' })
  findOne(
    @Param('comiteId', ParseIntPipe) comiteId: number,
    @Param('employeId', ParseIntPipe) employeId: number,
  ) {
    return this.memberComitesService.findOne(comiteId, employeId);
  }

  @Post()
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: CreateMemberComiteDto })
  @ApiCreatedResponse({ type: MemberComiteResponseDto })
  @ApiOperation({ summary: 'Add member to committee' })
  create(@Body() dto: CreateMemberComiteDto) {
    return this.memberComitesService.create(dto);
  }

  @Patch(':comiteId/:employeId')
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: UpdateMemberComiteDto })
  @ApiOkResponse({ type: MemberComiteResponseDto })
  @ApiOperation({ summary: 'Update committee member role' })
  update(
    @Param('comiteId', ParseIntPipe) comiteId: number,
    @Param('employeId', ParseIntPipe) employeId: number,
    @Body() dto: UpdateMemberComiteDto,
  ) {
    return this.memberComitesService.update(comiteId, employeId, dto);
  }

  @Delete(':comiteId/:employeId')
  @Permissions('MANAGE_COMITE')
  @ApiNoContentResponse({ description: 'Committee member removed' })
  @ApiOperation({ summary: 'Remove committee member' })
  remove(
    @Param('comiteId', ParseIntPipe) comiteId: number,
    @Param('employeId', ParseIntPipe) employeId: number,
  ) {
    return this.memberComitesService.remove(comiteId, employeId);
  }
}
