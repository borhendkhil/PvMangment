import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { DirectionEntity } from '../database/entities/direction.entity';
import { CreateDirectionDto, UpdateDirectionDto } from './dto/direction.dto';

@Injectable()
export class DirectionsService extends BaseCrudService<DirectionEntity> {
  constructor(
    @InjectRepository(DirectionEntity)
    repository: Repository<DirectionEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  create(dto: CreateDirectionDto) {
    return super.create(dto);
  }

  update(id: number, dto: UpdateDirectionDto) {
    return super.update(id, dto);
  }
}
