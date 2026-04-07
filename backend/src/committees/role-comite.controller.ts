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
import { CreateRoleComiteDto, RoleComiteResponseDto, UpdateRoleComiteDto } from './dto/role-comite.dto';
import { RoleComiteService } from './role-comite.service';

@ApiTags('Committee Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('committee-roles')
export class RoleComiteController {
  constructor(private readonly roleComiteService: RoleComiteService) {}

  @Get()
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: [RoleComiteResponseDto] })
  @ApiOperation({ summary: 'List committee roles' })
  findAll() {
    return this.roleComiteService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_COMITE')
  @ApiOkResponse({ type: RoleComiteResponseDto })
  @ApiOperation({ summary: 'Get committee role by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleComiteService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: CreateRoleComiteDto })
  @ApiCreatedResponse({ type: RoleComiteResponseDto })
  @ApiOperation({ summary: 'Create committee role' })
  create(@Body() dto: CreateRoleComiteDto) {
    return this.roleComiteService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_COMITE')
  @ApiBody({ type: UpdateRoleComiteDto })
  @ApiOkResponse({ type: RoleComiteResponseDto })
  @ApiOperation({ summary: 'Update committee role' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleComiteDto) {
    return this.roleComiteService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_COMITE')
  @ApiNoContentResponse({ description: 'Committee role deleted' })
  @ApiOperation({ summary: 'Delete committee role' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleComiteService.remove(id);
  }
}
