import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { SubjectDecisionEntity } from '../database/entities/subject-decision.entity';
import { CreateSubjectDecisionDto, UpdateSubjectDecisionDto } from './dto/subject-decision.dto';

@Injectable()
export class SubjectsService extends BaseCrudService<SubjectDecisionEntity> {
  constructor(
    @InjectRepository(SubjectDecisionEntity)
    repository: Repository<SubjectDecisionEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  override async findOne(id: number) {
    const subject = await this.repository.findOne({
      where: { id },
      relations: { decisions: true },
    });
    if (!subject) {
      throw new NotFoundException(`Subject decision #${id} not found`);
    }
    return subject;
  }

  create(dto: CreateSubjectDecisionDto) {
    return this.repository.save(
      this.repository.create({
        sujet: dto.sujet,
        description: dto.description ?? null,
      }),
    );
  }

  update(id: number, dto: UpdateSubjectDecisionDto) {
    return super.update(id, dto as any);
  }
}
