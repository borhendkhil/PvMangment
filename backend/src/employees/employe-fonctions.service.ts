import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { EmployeEntity } from '../database/entities/employe.entity';
import { EmployeFonctionEntity } from '../database/entities/employe-fonction.entity';
import { FonctionEntity } from '../database/entities/fonction.entity';
import { CreateEmployeFonctionDto, UpdateEmployeFonctionDto } from './dto/employe-fonction.dto';

@Injectable()
export class EmployeFonctionsService extends BaseCrudService<EmployeFonctionEntity> {
  constructor(
    @InjectRepository(EmployeFonctionEntity)
    repository: Repository<EmployeFonctionEntity>,
    @InjectRepository(EmployeEntity)
    private readonly employeRepository: Repository<EmployeEntity>,
    @InjectRepository(FonctionEntity)
    private readonly fonctionRepository: Repository<FonctionEntity>,
  ) {
    super(repository);
  }

  override findAll() {
    return this.repository.find({
      relations: { employe: true, fonction: true },
      order: { id: 'ASC' },
    });
  }

  override async findOne(id: number) {
    const row = await this.repository.findOne({
      where: { id },
      relations: { employe: true, fonction: true },
    });
    if (!row) {
      throw new NotFoundException(`Employe fonction #${id} not found`);
    }
    return row;
  }

  async getCurrentFunction(employeId: number) {
    return this.repository.findOne({
      where: {
        employe: { id: employeId } as any,
        isActive: true,
      },
      relations: { employe: true, fonction: true },
    });
  }

  async create(dto: CreateEmployeFonctionDto) {
    const employe = dto.employeId
      ? await this.employeRepository.findOne({ where: { id: dto.employeId } })
      : null;
    const fonction = dto.fonctionId
      ? await this.fonctionRepository.findOne({ where: { id: dto.fonctionId } })
      : null;

    if (dto.isActive ?? true) {
      await this.repository
        .createQueryBuilder()
        .update(EmployeFonctionEntity)
        .set({ isActive: false })
        .where('employe_id = :employeId', { employeId: dto.employeId })
        .andWhere('is_active = 1')
        .execute();
    }

    return this.repository.save(
      this.repository.create({
        employe,
        fonction,
        dateDebut: dto.dateDebut,
        dateFin: dto.dateFin ?? null,
        isActive: dto.isActive ?? true,
      }),
    );
  }

  async update(id: number, dto: UpdateEmployeFonctionDto) {
    const row = await this.findOne(id);
    if (dto.employeId !== undefined) {
      row.employe = dto.employeId
        ? await this.employeRepository.findOne({ where: { id: dto.employeId } })
        : null;
    }
    if (dto.fonctionId !== undefined) {
      row.fonction = dto.fonctionId
        ? await this.fonctionRepository.findOne({ where: { id: dto.fonctionId } })
        : null;
    }
    if (dto.dateDebut !== undefined) row.dateDebut = dto.dateDebut;
    if (dto.dateFin !== undefined) row.dateFin = dto.dateFin ?? null;
    if (dto.isActive !== undefined) {
      if (dto.isActive && row.employe?.id) {
        await this.repository
          .createQueryBuilder()
          .update(EmployeFonctionEntity)
          .set({ isActive: false })
          .where('employe_id = :employeId', { employeId: row.employe.id })
          .andWhere('id != :id', { id })
          .andWhere('is_active = 1')
          .execute();
      }
      row.isActive = dto.isActive;
    }
    return this.repository.save(row);
  }
}
