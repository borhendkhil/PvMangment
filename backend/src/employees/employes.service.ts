import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { DirectionEntity } from '../database/entities/direction.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateEmployeDto, UpdateEmployeDto } from './dto/employe.dto';

@Injectable()
export class EmployesService extends BaseCrudService<EmployeEntity> {
  constructor(
    @InjectRepository(EmployeEntity)
    repository: Repository<EmployeEntity>,
    @InjectRepository(DirectionEntity)
    private readonly directionRepository: Repository<DirectionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  private sanitizeEmploye(employe: EmployeEntity) {
    if (employe.user && (employe.user as any).password) {
      const { password, ...publicUser } = employe.user as any;
      return {
        ...employe,
        user: publicUser,
      };
    }
    return employe;
  }

  override findAll() {
    return this.repository
      .find({
        relations: { direction: true, user: true, employeFonctions: { fonction: true } },
        order: { id: 'ASC' },
      })
      .then((rows) => rows.map((row) => this.sanitizeEmploye(row)));
  }

  override async findOne(id: number) {
    const employe = await this.repository.findOne({
      where: { id },
      relations: {
        direction: true,
        user: true,
        employeFonctions: { fonction: true },
        memberComites: { comite: true, roleComite: true },
      },
    });
    if (!employe) {
      throw new NotFoundException(`Employe #${id} not found`);
    }
    return this.sanitizeEmploye(employe);
  }

  async create(dto: CreateEmployeDto) {
    const direction = dto.directionId
      ? await this.directionRepository.findOne({ where: { id: dto.directionId } })
      : null;
    const user = dto.userId
      ? await this.userRepository.findOne({ where: { id: dto.userId } })
      : null;
    if (dto.directionId && !direction) {
      throw new NotFoundException(`Direction #${dto.directionId} not found`);
    }
    if (dto.userId && !user) {
      throw new NotFoundException(`User #${dto.userId} not found`);
    }

    return this.repository.save(
      this.repository.create({
        matricule: dto.matricule ?? null,
        nom: dto.nom,
        prenom: dto.prenom,
        telephone: dto.telephone ?? null,
        address: dto.address ?? null,
        direction,
        user,
      }),
    );
  }

  async update(id: number, dto: UpdateEmployeDto) {
    const employe = await this.findOne(id);
    if (dto.matricule !== undefined) employe.matricule = dto.matricule ?? null;
    if (dto.nom !== undefined) employe.nom = dto.nom;
    if (dto.prenom !== undefined) employe.prenom = dto.prenom;
    if (dto.telephone !== undefined) employe.telephone = dto.telephone ?? null;
    if (dto.address !== undefined) employe.address = dto.address ?? null;
    if (dto.directionId !== undefined) {
      if (dto.directionId) {
        const direction = await this.directionRepository.findOne({ where: { id: dto.directionId } });
        if (!direction) {
          throw new NotFoundException(`Direction #${dto.directionId} not found`);
        }
        employe.direction = direction;
      } else {
        employe.direction = null;
      }
    }
    if (dto.userId !== undefined) {
      if (dto.userId) {
        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
          throw new NotFoundException(`User #${dto.userId} not found`);
        }
        employe.user = user;
      } else {
        employe.user = null;
      }
    }
    return this.repository.save(employe);
  }
}
