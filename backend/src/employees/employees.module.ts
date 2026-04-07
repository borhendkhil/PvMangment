import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionEntity } from '../database/entities/direction.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { EmployeFonctionEntity } from '../database/entities/employe-fonction.entity';
import { FonctionEntity } from '../database/entities/fonction.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { UserEntity } from '../database/entities/user.entity';
import { EmployeFonctionsController } from './employe-fonctions.controller';
import { EmployeFonctionsService } from './employe-fonctions.service';
import { EmployeesController } from './employees.controller';
import { EmployesService } from './employes.service';
import { FonctionsController } from './fonctions.controller';
import { FonctionsService } from './fonctions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeEntity,
      DirectionEntity,
      UserEntity,
      FonctionEntity,
      RoleEntity,
      EmployeFonctionEntity,
    ]),
  ],
  controllers: [EmployeesController, FonctionsController, EmployeFonctionsController],
  providers: [EmployesService, FonctionsService, EmployeFonctionsService],
  exports: [EmployesService, FonctionsService, EmployeFonctionsService],
})
export class EmployeesModule {}
