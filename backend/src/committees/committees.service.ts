import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { CreateCommitteeDto, UpdateCommitteeDto } from './dto/committee.dto';

@Injectable()
export class CommitteesService extends BaseCrudService<CommitteeEntity> {
  constructor(
    @InjectRepository(CommitteeEntity)
    repository: Repository<CommitteeEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({
      relations: {
        sessions: { decisions: { subject: true } },
        members: { employe: true, roleComite: true },
        decisions: { subject: true },
      },
      order: { id: 'ASC' },
    }).then((committees) => committees.map((committee) => this.decorateCommittee(committee)));
  }

  override async findOne(id: number) {
    const committee = await this.repository.findOne({
      where: { id },
      relations: {
        sessions: { decisions: { subject: true } },
        members: { employe: true, roleComite: true },
        decisions: { subject: true },
      },
    });
    if (!committee) {
      throw new NotFoundException(`Committee #${id} not found`);
    }
    return this.decorateCommittee(committee);
  }

  async create(dto: CreateCommitteeDto) {
    const saved = await this.repository.save(
      this.repository.create({
        titre: dto.titre,
        description: dto.description ?? null,
      }),
    );

    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateCommitteeDto) {
    const committee = await this.repository.findOne({
      where: { id },
      relations: {
        sessions: { decisions: { subject: true } },
        members: { employe: true, roleComite: true },
        decisions: { subject: true },
      },
    });
    if (!committee) {
      throw new NotFoundException(`Committee #${id} not found`);
    }

    if (dto.titre !== undefined) committee.titre = dto.titre;
    if (dto.description !== undefined) committee.description = dto.description ?? null;

    const saved = await this.repository.save(committee);
    return this.findOne(saved.id);
  }

  private decorateCommittee(committee: CommitteeEntity) {
    const sessions = committee.sessions ?? [];
    const directDecisions = committee.decisions ?? [];
    const sessionDecisions = sessions.flatMap((session) =>
      (session.decisions ?? []).map((decision) => ({
        ...decision,
        sessionId: session.id,
      })),
    );

    const allDecisions = [...directDecisions, ...sessionDecisions];

    return {
      ...committee,
      totalSessions: sessions.length,
      totalMembres: committee.members?.length ?? 0,
      totalDecisions: allDecisions.length,
      decisions: allDecisions,
    };
  }
}
