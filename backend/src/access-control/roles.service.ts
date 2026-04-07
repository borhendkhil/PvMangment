import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { PermissionEntity } from '../database/entities/permission.entity';
import { RoleEntity } from '../database/entities/role.entity';
import {
  AssignPermissionsDto,
  CreateRoleDto,
  UpdateRoleDto,
} from './dto/role.dto';

@Injectable()
export class RolesService extends BaseCrudService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    repository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {
    super(repository);
  }

  private sanitizeRole(role: RoleEntity) {
    if (!role.users) {
      return role;
    }
    return {
      ...role,
      users: role.users.map((user) => {
        const { password, ...publicUser } = user as any;
        return publicUser;
      }),
    };
  }

  override findAll() {
    return this.repository.find({
      relations: { permissions: true },
      order: { id: 'ASC' },
    });
  }

  override async findOne(id: number) {
    const role = await this.repository.findOne({
      where: { id },
      relations: { permissions: true, users: true, fonctions: true },
    });
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return this.sanitizeRole(role);
  }

  async create(dto: CreateRoleDto) {
    const permissions = dto.permissionIds?.length
      ? await this.permissionRepository.findBy({ id: In(dto.permissionIds) })
      : [];
    if (dto.permissionIds?.length && permissions.length !== dto.permissionIds.length) {
      throw new NotFoundException('One or more permissions were not found');
    }
    return this.repository.save(
      this.repository.create({
        name: dto.name,
        labelAr: dto.label_ar,
        permissions,
      }),
    );
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (dto.permissionIds) {
      const permissions = dto.permissionIds.length
        ? await this.permissionRepository.findBy({ id: In(dto.permissionIds) })
        : [];
      if (dto.permissionIds.length && permissions.length !== dto.permissionIds.length) {
        throw new NotFoundException('One or more permissions were not found');
      }
      role.permissions = permissions;
    }
    if (dto.name !== undefined) {
      role.name = dto.name;
    }
    if (dto.label_ar !== undefined) {
      role.labelAr = dto.label_ar;
    }
    return this.repository.save(role);
  }

  async setPermissions(roleId: number, dto: AssignPermissionsDto) {
    const role = await this.findOne(roleId);
    const permissions = dto.permissionIds.length
      ? await this.permissionRepository.findBy({ id: In(dto.permissionIds) })
      : [];
    if (dto.permissionIds.length && permissions.length !== dto.permissionIds.length) {
      throw new NotFoundException('One or more permissions were not found');
    }
    role.permissions = permissions;
    return this.repository.save(role);
  }
}
