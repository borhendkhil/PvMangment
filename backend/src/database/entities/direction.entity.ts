import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeEntity } from './employe.entity';

@Entity({ name: 'direction' })
export class DirectionEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'code', type: 'varchar', length: 10, nullable: true })
  code: string | null;

  @Column({ name: 'lib', type: 'varchar', length: 255 })
  lib: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @OneToMany(() => EmployeEntity, (employe) => employe.direction)
  employes: EmployeEntity[];
}
