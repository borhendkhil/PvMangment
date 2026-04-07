import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../database/entities/permission.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { PermissionsController } from './permissions.controller';
import { RolesController } from './roles.controller';
import { PermissionsService } from './permissions.service';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
  controllers: [PermissionsController, RolesController],
  providers: [PermissionsService, RolesService],
  exports: [PermissionsService, RolesService],
})
export class AccessControlModule {}
