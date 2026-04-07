import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { RoleEntity } from '../database/entities/role.entity';
import { FonctionEntity } from '../database/entities/fonction.entity';
import { CreateFonctionDto, UpdateFonctionDto } from './dto/fonction.dto';

@Injectable()
export class FonctionsService extends BaseCrudService<FonctionEntity> {
  constructor(
    @InjectRepository(FonctionEntity)
    repository: Repository<FonctionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({ relations: { roles: true }, order: { id: 'ASC' } });
  }

  override async findOne(id: number) {
    const fonction = await this.repository.findOne({
      where: { id },
      relations: { roles: true, employeFonctions: true },
    });
    if (!fonction) {
      throw new NotFoundException(`Fonction #${id} not found`);
    }
    return fonction;
  }

  async create(dto: CreateFonctionDto) {
    const roles = dto.roleIds?.length
      ? await this.roleRepository.findBy({ id: In(dto.roleIds) })
      : [];
    if (dto.roleIds?.length && roles.length !== dto.roleIds.length) {
      throw new NotFoundException('One or more roles were not found');
    }
    return this.repository.save(
      this.repository.create({
        name: dto.name,
        labelAr: dto.label_ar,
        roles,
      }),
    );
  }

  async update(id: number, dto: UpdateFonctionDto) {
    const fonction = await this.findOne(id);
    if (dto.name !== undefined) fonction.name = dto.name;
    if (dto.label_ar !== undefined) fonction.labelAr = dto.label_ar;
    if (dto.roleIds) {
      const roles = dto.roleIds.length
        ? await this.roleRepository.findBy({ id: In(dto.roleIds) })
        : [];
      if (dto.roleIds.length && roles.length !== dto.roleIds.length) {
        throw new NotFoundException('One or more roles were not found');
      }
      fonction.roles = roles;
    }
    return this.repository.save(fonction);
  }

  async setRoles(fonctionId: number, roleIds: number[]) {
    const fonction = await this.findOne(fonctionId);
    const roles = roleIds.length
      ? await this.roleRepository.findBy({ id: In(roleIds) })
      : [];
    if (roleIds.length && roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles were not found');
    }
    fonction.roles = roles;
    return this.repository.save(fonction);
  }
}
