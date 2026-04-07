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
import { CommitteeResponseDto, CreateCommitteeDto, UpdateCommitteeDto } from './dto/committee.dto';
import { CommitteesService } from './committees.service';

@ApiTags('Committees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('committees')
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  @Get()
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: [CommitteeResponseDto] })
  @ApiOperation({ summary: 'List committees' })
  findAll() {
    return this.committeesService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: CommitteeResponseDto })
  @ApiOperation({ summary: 'Get committee by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.committeesService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: CreateCommitteeDto })
  @ApiCreatedResponse({ type: CommitteeResponseDto })
  @ApiOperation({ summary: 'Create committee' })
  create(@Body() dto: CreateCommitteeDto) {
    return this.committeesService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: UpdateCommitteeDto })
  @ApiOkResponse({ type: CommitteeResponseDto })
  @ApiOperation({ summary: 'Update committee' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommitteeDto) {
    return this.committeesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_COMITE')
  @ApiNoContentResponse({ description: 'Committee deleted' })
  @ApiOperation({ summary: 'Delete committee' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.committeesService.remove(id);
  }
}
