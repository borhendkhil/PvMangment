import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { CreateCommitteeSessionDto, UpdateCommitteeSessionDto } from './dto/committee-session.dto';

@Injectable()
export class CommitteeSessionsService extends BaseCrudService<CommitteeSessionEntity> {
  constructor(
    @InjectRepository(CommitteeSessionEntity)
    repository: Repository<CommitteeSessionEntity>,
    @InjectRepository(CommitteeEntity)
    private readonly committeeRepository: Repository<CommitteeEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({ relations: { comite: true, decisions: true }, order: { id: 'ASC' } });
  }

  override async findOne(id: number) {
    const session = await this.repository.findOne({
      where: { id },
      relations: { comite: true, decisions: true },
    });
    if (!session) {
      throw new NotFoundException(`Committee session #${id} not found`);
    }
    return session;
  }

  async create(dto: CreateCommitteeSessionDto) {
    const comite = await this.committeeRepository.findOne({ where: { id: dto.comiteId } });
    if (!comite) {
      throw new NotFoundException(`Committee #${dto.comiteId} not found`);
    }
    return this.repository.save(
      this.repository.create({
        comite,
        dateSession: dto.dateSession ? new Date(dto.dateSession) : null,
        lieu: dto.lieu ?? null,
        statut: dto.statut ?? null,
      }),
    );
  }

  async update(id: number, dto: UpdateCommitteeSessionDto) {
    const session = await this.findOne(id);
    if (dto.comiteId !== undefined) {
      const comite = dto.comiteId
        ? await this.committeeRepository.findOne({ where: { id: dto.comiteId } })
        : null;
      if (dto.comiteId && !comite) {
        throw new NotFoundException(`Committee #${dto.comiteId} not found`);
      }
      session.comite = comite as any;
    }
    if (dto.dateSession !== undefined) {
      session.dateSession = dto.dateSession ? new Date(dto.dateSession) : null;
    }
    if (dto.lieu !== undefined) session.lieu = dto.lieu ?? null;
    if (dto.statut !== undefined) session.statut = dto.statut ?? null;
    return this.repository.save(session);
  }
}
