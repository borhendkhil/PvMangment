import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { PermissionEntity } from '../database/entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionsService extends BaseCrudService<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    repository: Repository<PermissionEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  create(dto: CreatePermissionDto) {
    return super.create(dto);
  }

  update(id: number, dto: UpdatePermissionDto) {
    return super.update(id, dto);
  }
}
