import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('director/stats')
  @ApiOperation({ summary: 'Get director dashboard statistics' })
  @ApiOkResponse({ description: 'Returns dashboard stats specific to the director department' })
  getDirectorStats(@Req() req: any) {
    return this.dashboardService.getDirectorStats(req.user.id);
  }
}
