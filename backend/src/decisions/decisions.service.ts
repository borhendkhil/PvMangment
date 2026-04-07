import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { basename } from 'path';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { DecisionEntity } from '../database/entities/decision.entity';
import { DecisionPdfEntity } from '../database/entities/decision-pdf.entity';
import { SubjectDecisionEntity } from '../database/entities/subject-decision.entity';
import { CreateDecisionDto, UpdateDecisionDto } from './dto/decision.dto';
import { CreateDecisionPdfDto, UpdateDecisionPdfDto } from './dto/decision-pdf.dto';

import { CommitteeEntity } from '../database/entities/comite.entity';

@Injectable()
export class DecisionsService extends BaseCrudService<DecisionEntity> {
  constructor(
    @InjectRepository(DecisionEntity)
    repository: Repository<DecisionEntity>,
    @InjectRepository(SubjectDecisionEntity)
    private readonly subjectRepository: Repository<SubjectDecisionEntity>,
    @InjectRepository(CommitteeSessionEntity)
    private readonly sessionRepository: Repository<CommitteeSessionEntity>,
    @InjectRepository(DecisionPdfEntity)
    private readonly decisionPdfRepository: Repository<DecisionPdfEntity>,
    @InjectRepository(CommitteeEntity)
    private readonly comiteRepository: Repository<CommitteeEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({
      relations: { subject: true, session: { comite: true }, decisionPdfs: true, comite: true },
      order: { id: 'DESC' },
    });
  }

  override async findOne(id: number) {
    const decision = await this.repository.findOne({
      where: { id },
      relations: {
        subject: true,
        session: { comite: true },
        decisionPdfs: true,
        comite: true,
      },
    });
    if (!decision) {
      throw new NotFoundException(`Decision #${id} not found`);
    }
    return decision;
  }

  async findCurrentDecision(sessionId: number) {
    return this.repository.findOne({
      where: {
        session: { id: sessionId } as any,
        current: true,
      },
      relations: { subject: true, session: { comite: true }, decisionPdfs: true, comite: true },
    });
  }

  async create(dto: CreateDecisionDto) {
    const subject = dto.sujetId
      ? await this.subjectRepository.findOne({ where: { id: dto.sujetId } })
      : null;
    const session = dto.sessionId
      ? await this.sessionRepository.findOne({ where: { id: dto.sessionId } })
      : null;
    const comite = dto.comiteId
      ? await this.comiteRepository.findOne({ where: { id: dto.comiteId } })
      : null;
    if (dto.sujetId && !subject) {
      throw new NotFoundException(`Subject decision #${dto.sujetId} not found`);
    }
    if (dto.sessionId && !session) {
      throw new NotFoundException(`Committee session #${dto.sessionId} not found`);
    }
    if (dto.comiteId && !comite) {
      throw new NotFoundException(`Committee #${dto.comiteId} not found`);
    }

    const saved = await this.repository.save(
      this.repository.create({
        subject,
        session,
        comite,
        numAdmin: dto.numAdmin ?? null,
        titre: dto.titre ?? null,
        description: dto.description ?? null,
        fichierPath: dto.fichierPath ?? null,
        fichierName: dto.fichierName ?? null,
        statut: dto.statut ?? null,
        current: dto.current ?? false,
        dateUpload: dto.dateUpload ? new Date(dto.dateUpload) : null,
      }),
    );

    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateDecisionDto) {
    const decision = await this.findOne(id);
    if (dto.sujetId !== undefined) {
      if (dto.sujetId) {
        const subject = await this.subjectRepository.findOne({ where: { id: dto.sujetId } });
        if (!subject) {
          throw new NotFoundException(`Subject decision #${dto.sujetId} not found`);
        }
        decision.subject = subject;
      } else {
        decision.subject = null;
      }
    }
    if (dto.sessionId !== undefined) {
      if (dto.sessionId) {
        const session = await this.sessionRepository.findOne({ where: { id: dto.sessionId } });
        if (!session) {
          throw new NotFoundException(`Committee session #${dto.sessionId} not found`);
        }
        decision.session = session;
      } else {
        decision.session = null;
      }
    }
    if (dto.comiteId !== undefined) {
      if (dto.comiteId) {
        const comite = await this.comiteRepository.findOne({ where: { id: dto.comiteId } });
        if (!comite) {
          throw new NotFoundException(`Committee #${dto.comiteId} not found`);
        }
        decision.comite = comite;
      } else {
        decision.comite = null;
      }
    }
    if (dto.numAdmin !== undefined) decision.numAdmin = dto.numAdmin ?? null;
    if (dto.titre !== undefined) decision.titre = dto.titre ?? null;
    if (dto.description !== undefined) decision.description = dto.description ?? null;
    if (dto.fichierPath !== undefined) decision.fichierPath = dto.fichierPath ?? null;
    if (dto.fichierName !== undefined) decision.fichierName = dto.fichierName ?? null;
    if (dto.statut !== undefined) decision.statut = dto.statut ?? null;
    if (dto.current !== undefined) decision.current = dto.current;
    if (dto.dateUpload !== undefined) {
      decision.dateUpload = dto.dateUpload ? new Date(dto.dateUpload) : null;
    }
    const saved = await this.repository.save(decision);
    return this.findOne(saved.id);
  }

  async createDecisionPdf(dto: CreateDecisionPdfDto) {
    const decision = await this.findOne(dto.decisionId);
    const pdf = await this.decisionPdfRepository.save(
      this.decisionPdfRepository.create({
        decision,
        pdfPath: dto.pdfPath,
        pdfName: dto.pdfName ?? null,
      }),
    );

    await this.repository.update(decision.id, {
      fichierPath: pdf.pdfPath,
      fichierName: pdf.pdfName ?? decision.fichierName,
      dateUpload: pdf.dateUpload,
    });

    return pdf;
  }

  async addDecisionPdfs(decisionId: number, files: Array<{ path?: string; filename?: string; originalname?: string }>) {
    const decision = await this.findOne(decisionId);
    const rows = files.map((file) =>
      this.decisionPdfRepository.create({
        decision,
        pdfPath: this.normalizeDecisionPdfPath(file),
        pdfName: file.originalname ?? file.filename ?? null,
      }),
    );
    const savedRows = await this.decisionPdfRepository.save(rows);

    const lastPdf = savedRows[savedRows.length - 1];
    if (lastPdf) {
      await this.repository.update(decision.id, {
        fichierPath: lastPdf.pdfPath,
        fichierName: lastPdf.pdfName ?? decision.fichierName,
        dateUpload: lastPdf.dateUpload,
      });
    }

    return savedRows;
  }

  private normalizeDecisionPdfPath(file: { path?: string; filename?: string; originalname?: string }) {
    if (file.path) {
      return `/uploads/decision-pdfs/${basename(file.path)}`;
    }
    if (file.filename) {
      return `/uploads/decision-pdfs/${file.filename}`;
    }
    if (file.originalname) {
      return `/uploads/decision-pdfs/${file.originalname}`;
    }
    return '';
  }

  findAllDecisionPdfs() {
    return this.decisionPdfRepository.find({ relations: { decision: true }, order: { id: 'ASC' } });
  }

  async findDecisionPdf(id: number) {
    const row = await this.decisionPdfRepository.findOne({
      where: { id },
      relations: { decision: true },
    });
    if (!row) {
      throw new NotFoundException(`Decision PDF #${id} not found`);
    }
    return row;
  }

  async updateDecisionPdf(id: number, dto: UpdateDecisionPdfDto) {
    const row = await this.findDecisionPdf(id);
    if (dto.decisionId !== undefined) {
      if (dto.decisionId) {
        const decision = await this.repository.findOne({ where: { id: dto.decisionId } });
        if (!decision) {
          throw new NotFoundException(`Decision #${dto.decisionId} not found`);
        }
        row.decision = decision;
      }
    }
    if (dto.pdfPath !== undefined) row.pdfPath = dto.pdfPath;
    if (dto.pdfName !== undefined) row.pdfName = dto.pdfName ?? null;
    return this.decisionPdfRepository.save(row);
  }

  async removeDecisionPdf(id: number) {
    const row = await this.findDecisionPdf(id);
    await this.decisionPdfRepository.remove(row);
  }
}
