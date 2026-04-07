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
import { CreateEmployeFonctionDto, UpdateEmployeFonctionDto } from './dto/employe-fonction.dto';
import { EmployeFonctionResponseDto } from './dto/employe-fonction.dto';
import { EmployeFonctionsService } from './employe-fonctions.service';

@ApiTags('Employee Functions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employee-functions')
export class EmployeFonctionsController {
  constructor(private readonly employeFonctionsService: EmployeFonctionsService) {}

  @Get('current/:employeId')
  @Permissions('MANAGE_USERS')
  @ApiOkResponse({ type: EmployeFonctionResponseDto })
  @ApiOperation({ summary: 'Get current function of employee' })
  getCurrentFunction(@Param('employeId', ParseIntPipe) employeId: number) {
    return this.employeFonctionsService.getCurrentFunction(employeId);
  }

  @Get()
  @Permissions('MANAGE_USERS')
  @ApiOkResponse({ type: [EmployeFonctionResponseDto] })
  @ApiOperation({ summary: 'List employee function assignments' })
  findAll() {
    return this.employeFonctionsService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_USERS')
  @ApiOkResponse({ type: EmployeFonctionResponseDto })
  @ApiOperation({ summary: 'Get employee function assignment by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeFonctionsService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_USERS')
  @ApiBody({ type: CreateEmployeFonctionDto })
  @ApiCreatedResponse({ type: EmployeFonctionResponseDto })
  @ApiOperation({ summary: 'Create employee function assignment' })
  create(@Body() dto: CreateEmployeFonctionDto) {
    return this.employeFonctionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_USERS')
  @ApiBody({ type: UpdateEmployeFonctionDto })
  @ApiOkResponse({ type: EmployeFonctionResponseDto })
  @ApiOperation({ summary: 'Update employee function assignment' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeFonctionDto) {
    return this.employeFonctionsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_USERS')
  @ApiNoContentResponse({ description: 'Assignment deleted' })
  @ApiOperation({ summary: 'Delete employee function assignment' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeFonctionsService.remove(id);
  }
}
