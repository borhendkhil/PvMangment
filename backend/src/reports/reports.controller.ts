import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request as Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { SaveSessionReportDto, FeedbackDto } from './dto/report.dto';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':sessionId/report')
  async getReport(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.reportsService.getSessionReport(sessionId);
  }

  @Patch(':sessionId/report')
  async saveReport(
    @Req() req: any,
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() dto: SaveSessionReportDto,
  ) {
    return this.reportsService.saveReport(sessionId, req.user.id, dto);
  }

  @Get('reports/:reportId/feedbacks')
  async getFeedbacks(@Param('reportId', ParseIntPipe) reportId: number) {
    return this.reportsService.getReportFeedbacks(reportId);
  }

  @Post('reports/:reportId/feedbacks')
  async createFeedback(
    @Req() req: any,
    @Param('reportId', ParseIntPipe) reportId: number,
    @Body() dto: FeedbackDto,
  ) {
    return this.reportsService.initializeFeedback(reportId, req.user.id, dto);
  }

  @Delete('feedbacks/:feedbackId')
  async deleteFeedback(@Req() req: any, @Param('feedbackId', ParseIntPipe) feedbackId: number) {
    return this.reportsService.deleteFeedback(feedbackId, req.user.id);
  }
}

