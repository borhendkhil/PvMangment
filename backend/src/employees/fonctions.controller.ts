import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
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
import { CreateFonctionDto, UpdateFonctionDto } from './dto/fonction.dto';
import { FonctionResponseDto } from './dto/fonction.dto';
import { FonctionsService } from './fonctions.service';
import { SetRoleIdsDto } from './users-role-mapping.dto';

@ApiTags('Fonctions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('fonctions')
export class FonctionsController {
  constructor(private readonly fonctionsService: FonctionsService) {}

  @Get()
  @Permissions('MANAGE_USERS')
  @ApiOkResponse({ type: [FonctionResponseDto] })
  @ApiOperation({ summary: 'List functions' })
  findAll() {
    return this.fonctionsService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_USERS')
  @ApiOkResponse({ type: FonctionResponseDto })
  @ApiOperation({ summary: 'Get function by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fonctionsService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_USERS')
  @ApiBody({ type: CreateFonctionDto })
  @ApiCreatedResponse({ type: FonctionResponseDto })
  @ApiOperation({ summary: 'Create function' })
  create(@Body() dto: CreateFonctionDto) {
    return this.fonctionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_USERS')
  @ApiBody({ type: UpdateFonctionDto })
  @ApiOkResponse({ type: FonctionResponseDto })
  @ApiOperation({ summary: 'Update function' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFonctionDto) {
    return this.fonctionsService.update(id, dto);
  }

  @Put(':id/roles')
  @Permissions('MANAGE_USERS')
  @ApiBody({ type: SetRoleIdsDto })
  @ApiOkResponse({ type: FonctionResponseDto })
  @ApiOperation({ summary: 'Replace function roles' })
  setRoles(@Param('id', ParseIntPipe) id: number, @Body() dto: SetRoleIdsDto) {
    return this.fonctionsService.setRoles(id, dto.roleIds);
  }

  @Delete(':id')
  @Permissions('MANAGE_USERS')
  @ApiNoContentResponse({ description: 'Function deleted' })
  @ApiOperation({ summary: 'Delete function' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fonctionsService.remove(id);
  }
}
