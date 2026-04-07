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
import { CreatePermissionDto, PermissionResponseDto, UpdatePermissionDto } from './dto/permission.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('MANAGE_ROLES')
  @ApiOkResponse({ type: [PermissionResponseDto] })
  @ApiOperation({ summary: 'List permissions' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_ROLES')
  @ApiOkResponse({ type: PermissionResponseDto })
  @ApiOperation({ summary: 'Get permission by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_ROLES')
  @ApiBody({ type: CreatePermissionDto })
  @ApiCreatedResponse({ type: PermissionResponseDto })
  @ApiOperation({ summary: 'Create permission' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_ROLES')
  @ApiBody({ type: UpdatePermissionDto })
  @ApiOkResponse({ type: PermissionResponseDto })
  @ApiOperation({ summary: 'Update permission' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_ROLES')
  @ApiNoContentResponse({ description: 'Permission deleted' })
  @ApiOperation({ summary: 'Delete permission' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(id);
  }
}
