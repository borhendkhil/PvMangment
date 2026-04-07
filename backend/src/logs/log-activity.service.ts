import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { UserEntity } from '../database/entities/user.entity';
import { LogActivityEntity } from '../database/entities/log-activity.entity';
import { CreateLogActivityDto, UpdateLogActivityDto } from './dto/log-activity.dto';

@Injectable()
export class LogActivityService extends BaseCrudService<LogActivityEntity> {
  constructor(
    @InjectRepository(LogActivityEntity)
    repository: Repository<LogActivityEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  private sanitizeLog(log: LogActivityEntity) {
    if (log.user && (log.user as any).password) {
      const { password, ...publicUser } = log.user as any;
      return { ...log, user: publicUser };
    }
    return log;
  }

  override findAll() {
    return this.repository
      .find({
        relations: { user: true },
        order: { id: 'DESC' },
      })
      .then((rows) => rows.map((row) => this.sanitizeLog(row)));
  }

  override async findOne(id: number) {
    const log = await this.repository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!log) {
      throw new NotFoundException(`Log activity #${id} not found`);
    }
    return this.sanitizeLog(log);
  }

  async create(dto: CreateLogActivityDto) {
    const user = dto.userId ? await this.userRepository.findOne({ where: { id: dto.userId } }) : null;
    if (dto.userId && !user) {
      throw new NotFoundException(`User #${dto.userId} not found`);
    }
    return this.repository.save(
      this.repository.create({
        user,
        action: dto.action,
      }),
    ).then((saved) => this.sanitizeLog(saved));
  }

  async update(id: number, dto: UpdateLogActivityDto) {
    const log = await this.findOne(id);
    if (dto.userId !== undefined) {
      log.user = dto.userId
        ? await this.userRepository.findOne({ where: { id: dto.userId } })
        : null;
    }
    if (dto.action !== undefined) {
      log.action = dto.action;
    }
    return this.repository.save(log).then((saved) => this.sanitizeLog(saved));
  }
}
