import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { RoleComiteEntity } from '../database/entities/role-comite.entity';
import { CreateRoleComiteDto, UpdateRoleComiteDto } from './dto/role-comite.dto';

@Injectable()
export class RoleComiteService extends BaseCrudService<RoleComiteEntity> {
  constructor(
    @InjectRepository(RoleComiteEntity)
    repository: Repository<RoleComiteEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  create(dto: CreateRoleComiteDto) {
    return super.create({ name: dto.name, labelAr: dto.label_ar } as any);
  }

  update(id: number, dto: UpdateRoleComiteDto) {
    return super.update(
      id,
      {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.label_ar !== undefined ? { labelAr: dto.label_ar } : {}),
      } as any,
    );
  }
}
