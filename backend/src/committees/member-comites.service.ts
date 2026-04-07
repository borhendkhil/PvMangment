import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { MemberComiteEntity } from '../database/entities/member-comite.entity';
import { RoleComiteEntity } from '../database/entities/role-comite.entity';
import { CreateMemberComiteDto, UpdateMemberComiteDto } from './dto/member-comite.dto';

@Injectable()
export class MemberComitesService {
  constructor(
    @InjectRepository(MemberComiteEntity)
    private readonly repository: Repository<MemberComiteEntity>,
    @InjectRepository(CommitteeEntity)
    private readonly committeeRepository: Repository<CommitteeEntity>,
    @InjectRepository(EmployeEntity)
    private readonly employeRepository: Repository<EmployeEntity>,
    @InjectRepository(RoleComiteEntity)
    private readonly roleComiteRepository: Repository<RoleComiteEntity>,
  ) {}

  findAll() {
    return this.repository.find({
      relations: { comite: true, employe: true, roleComite: true },
    });
  }

  async findOne(comiteId: number, employeId: number) {
    const row = await this.repository.findOne({
      where: { comiteId, employeId },
      relations: { comite: true, employe: true, roleComite: true },
    });
    if (!row) {
      throw new NotFoundException(`Member #${comiteId}/${employeId} not found`);
    }
    return row;
  }

  async create(dto: CreateMemberComiteDto) {
    const comite = await this.committeeRepository.findOne({ where: { id: dto.comiteId } });
    const employe = await this.employeRepository.findOne({ where: { id: dto.employeId } });
    const roleComite = dto.roleComiteId
      ? await this.roleComiteRepository.findOne({ where: { id: dto.roleComiteId } })
      : null;
    if (!comite) {
      throw new NotFoundException(`Committee #${dto.comiteId} not found`);
    }
    if (!employe) {
      throw new NotFoundException(`Employee #${dto.employeId} not found`);
    }
    if (dto.roleComiteId && !roleComite) {
      throw new NotFoundException(`Committee role #${dto.roleComiteId} not found`);
    }
    return this.repository.save(
      this.repository.create({
        comiteId: dto.comiteId,
        employeId: dto.employeId,
        comite,
        employe,
        roleComite,
      }),
    );
  }

  async update(comiteId: number, employeId: number, dto: UpdateMemberComiteDto) {
    const row = await this.findOne(comiteId, employeId);
    if (dto.roleComiteId !== undefined) {
      if (dto.roleComiteId) {
        const roleComite = await this.roleComiteRepository.findOne({
          where: { id: dto.roleComiteId },
        });
        if (!roleComite) {
          throw new NotFoundException(`Committee role #${dto.roleComiteId} not found`);
        }
        row.roleComite = roleComite;
      } else {
        row.roleComite = null;
      }
    }
    return this.repository.save(row);
  }

  async remove(comiteId: number, employeId: number) {
    const row = await this.findOne(comiteId, employeId);
    await this.repository.remove(row);
  }
}
