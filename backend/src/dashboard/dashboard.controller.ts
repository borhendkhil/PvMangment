import { Controller, Get, Req, UseGuards, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
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

  @Get('cabinet/stats')
  @ApiOperation({ summary: 'Get Admin Cabinet dashboard statistics' })
  getCabinetStats() {
    return this.dashboardService.getCabinetStats();
  }

  @Get('user/stats')
  @ApiOperation({ summary: 'Get authenticated user dashboard statistics' })
  getUserStats(@Req() req: any) {
    return this.dashboardService.getUserStats(req.user.id);
  }

  @Patch('cabinet/sessions/:id/notes')
  @ApiOperation({ summary: 'Update cabinet notes and warnings for session' })
  updateCabinetNotes(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string; warning?: string },
  ) {
    return this.dashboardService.updateCabinetNotes(id, body);
  }
}
