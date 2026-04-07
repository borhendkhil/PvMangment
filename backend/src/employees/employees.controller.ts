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
import { CreateEmployeDto, UpdateEmployeDto } from './dto/employe.dto';
import { EmployeResponseDto } from './dto/employe.dto';
import { EmployesService } from './employes.service';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employesService: EmployesService) {}

  @Get()
  @Permissions('MANAGE_USERS', 'MANAGE_COMITE')
  @ApiOkResponse({ type: [EmployeResponseDto] })
  @ApiOperation({ summary: 'List employees' })
  findAll() {
    return this.employesService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_USERS', 'MANAGE_COMITE')
  @ApiOkResponse({ type: EmployeResponseDto })
  @ApiOperation({ summary: 'Get employee by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employesService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_USERS')
  @ApiBody({ type: CreateEmployeDto })
  @ApiCreatedResponse({ type: EmployeResponseDto })
  @ApiOperation({ summary: 'Create employee' })
  create(@Body() dto: CreateEmployeDto) {
    return this.employesService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_USERS')
  @ApiBody({ type: UpdateEmployeDto })
  @ApiOkResponse({ type: EmployeResponseDto })
  @ApiOperation({ summary: 'Update employee' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeDto) {
    return this.employesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_USERS')
  @ApiNoContentResponse({ description: 'Employee deleted' })
  @ApiOperation({ summary: 'Delete employee' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employesService.remove(id);
  }
}
