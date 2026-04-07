import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { RoleEntity } from '../database/entities/role.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService extends BaseCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(repository);
  }

  private sanitizeUser(user: UserEntity) {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  private async getRawUser(id: number) {
    const user = await this.repository.findOne({
      where: { id },
      relations: { roles: true, employe: true },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  override findAll(): Promise<any[]> {
    return this.repository
      .find({
        relations: { roles: true, employe: true },
        order: { id: 'ASC' },
      })
      .then((users) => users.map((user) => this.sanitizeUser(user)));
  }

  override async findOne(id: number): Promise<any> {
    const user = await this.repository.findOne({
      where: { id },
      relations: {
        roles: { permissions: true },
        employe: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: {
        roles: { permissions: true },
        employe: { memberComites: { roleComite: true } },
      },
    });
  }

  async findByEmailForAuth(email: string) {
    return this.findByEmail(email);
  }

  override async create(dto: CreateUserDto): Promise<any> {
    const password = await bcrypt.hash(dto.password, 12);
    const roles = dto.roleIds?.length
      ? await this.roleRepository.findBy({ id: In(dto.roleIds) })
      : [];
    if (dto.roleIds?.length && roles.length !== dto.roleIds.length) {
      throw new NotFoundException('One or more roles were not found');
    }

    const user = this.repository.create({
      email: dto.email,
      password,
      telephone: dto.telephone ?? null,
      enabled: dto.enabled ?? true,
      roles,
    });

    return this.repository.save(user).then((saved) => this.sanitizeUser(saved));
  }

  override async update(id: number, dto: UpdateUserDto): Promise<any> {
    const user = await this.getRawUser(id);
    if (dto.email !== undefined) {
      user.email = dto.email;
    }
    if (dto.password !== undefined) {
      user.password = await bcrypt.hash(dto.password, 12);
    }
    if (dto.telephone !== undefined) {
      user.telephone = dto.telephone ?? null;
    }
    if (dto.enabled !== undefined) {
      user.enabled = dto.enabled;
    }
    if (dto.roleIds) {
      const roles = dto.roleIds.length
        ? await this.roleRepository.findBy({ id: In(dto.roleIds) })
        : [];
      if (dto.roleIds.length && roles.length !== dto.roleIds.length) {
        throw new NotFoundException('One or more roles were not found');
      }
      user.roles = roles;
    }
    const saved = await this.repository.save(user);
    return this.sanitizeUser(saved);
  }

  async setRoles(userId: number, roleIds: number[]) {
    const user = await this.getRawUser(userId);
    const roles = roleIds.length
      ? await this.roleRepository.findBy({ id: In(roleIds) })
      : [];
    if (roleIds.length && roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles were not found');
    }
    user.roles = roles;
    const saved = await this.repository.save(user);
    return this.sanitizeUser(saved);
  }
}
