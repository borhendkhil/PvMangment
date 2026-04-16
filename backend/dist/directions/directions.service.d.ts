import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { DirectionEntity } from '../database/entities/direction.entity';
import { CreateDirectionDto, UpdateDirectionDto } from './dto/direction.dto';
export declare class DirectionsService extends BaseCrudService<DirectionEntity> {
    constructor(repository: Repository<DirectionEntity>);
    findAll(): Promise<DirectionEntity[]>;
    create(dto: CreateDirectionDto): Promise<DirectionEntity>;
    update(id: number, dto: UpdateDirectionDto): Promise<DirectionEntity>;
}
