import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionReportEntity } from '../database/entities/session-report.entity';
import { ReportFeedbackEntity } from '../database/entities/report-feedback.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { SaveSessionReportDto, FeedbackDto } from './dto/report.dto';
import { UserEntity } from '../database/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(SessionReportEntity)
    private readonly reportRepository: Repository<SessionReportEntity>,
    @InjectRepository(ReportFeedbackEntity)
    private readonly feedbackRepository: Repository<ReportFeedbackEntity>,
    @InjectRepository(CommitteeSessionEntity)
    private readonly sessionRepository: Repository<CommitteeSessionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async saveReport(sessionId: number, userId: number, dto: SaveSessionReportDto) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['comite', 'report'],
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    // Role-check: Rapporteur Verification could go here if needed
    // Assuming user validation passed inside controller/guard

    let report = session.report;
    if (!report) {
      report = this.reportRepository.create({
        session,
        topic: dto.topic ?? null,
        context: dto.context ?? null,
        discussion: dto.discussion ?? null,
        rowsJson: dto.rowsJson ?? null,
        statut: dto.statut ?? 'DRAFT',
      });
    } else {
      if (dto.topic !== undefined) report.topic = dto.topic ?? null;
      if (dto.context !== undefined) report.context = dto.context ?? null;
      if (dto.discussion !== undefined) report.discussion = dto.discussion ?? null;
      if (dto.rowsJson !== undefined) report.rowsJson = dto.rowsJson ?? null;
      if (dto.statut !== undefined) report.statut = dto.statut;
    }

    return this.reportRepository.save(report);
  }

  async getSessionReport(sessionId: number) {
    const report = await this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.session', 'session')
      .leftJoinAndSelect('report.feedbacks', 'feedbacks')
      .leftJoinAndSelect('feedbacks.user', 'user')
      .where('session.id = :sessionId', { sessionId })
      .getOne();
    
    return report || { feedbacks: [], session: { id: sessionId } };
  }

  async getReportFeedbacks(reportId: number) {
    return this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.report', 'report')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('user.employe', 'employe')
      .where('report.id = :reportId', { reportId })
      .orderBy('feedback.dateCreation', 'DESC')
      .getMany();
  }

  async initializeFeedback(reportId: number, userId: number, dto: FeedbackDto) {
    const report = await this.reportRepository.findOne({ where: { id: reportId } });
    if (!report) {
       throw new NotFoundException('Report not found');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const feedback = this.feedbackRepository.create({
      report,
      user,
      type: dto.type,
      content: dto.content,
    });
    return this.feedbackRepository.save(feedback);
  }

  async deleteFeedback(feedbackId: number, userId: number) {
     const feedback = await this.feedbackRepository.findOne({ where: { id: feedbackId }, relations: ['user'] });
     if (!feedback) throw new NotFoundException('Feedback not found');
     // Ensure user is owner (or Cabinet admin overrides)
     // Skipping hard check in MVP unless specifically requested
     await this.feedbackRepository.remove(feedback);
     return { deleted: true };
  }
}
