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
import { CreateDirectionDto, DirectionResponseDto, UpdateDirectionDto } from './dto/direction.dto';
import { DirectionsService } from './directions.service';

@ApiTags('Directions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Get()
  @Permissions('MANAGE_DIRECTIONS')
  @ApiOkResponse({ type: [DirectionResponseDto] })
  @ApiOperation({ summary: 'List directions' })
  findAll() {
    return this.directionsService.findAll();
  }

  @Get(':id')
  @Permissions('MANAGE_DIRECTIONS')
  @ApiOkResponse({ type: DirectionResponseDto })
  @ApiOperation({ summary: 'Get direction by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.directionsService.findOne(id);
  }

  @Post()
  @Permissions('MANAGE_DIRECTIONS')
  @ApiBody({ type: CreateDirectionDto })
  @ApiCreatedResponse({ type: DirectionResponseDto })
  @ApiOperation({ summary: 'Create direction' })
  create(@Body() dto: CreateDirectionDto) {
    return this.directionsService.create(dto);
  }

  @Patch(':id')
  @Permissions('MANAGE_DIRECTIONS')
  @ApiBody({ type: UpdateDirectionDto })
  @ApiOkResponse({ type: DirectionResponseDto })
  @ApiOperation({ summary: 'Update direction' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDirectionDto) {
    return this.directionsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('MANAGE_DIRECTIONS')
  @ApiNoContentResponse({ description: 'Direction deleted' })
  @ApiOperation({ summary: 'Delete direction' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.directionsService.remove(id);
  }
}
