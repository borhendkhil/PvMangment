import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { UserEntity } from '../database/entities/user.entity';
import { LogActivityEntity } from '../database/entities/log-activity.entity';
import { CreateLogActivityDto, UpdateLogActivityDto } from './dto/log-activity.dto';
export declare class LogActivityService extends BaseCrudService<LogActivityEntity> {
    private readonly userRepository;
    constructor(repository: Repository<LogActivityEntity>, userRepository: Repository<UserEntity>);
    private sanitizeLog;
    findAll(): Promise<{
        user: any;
        id: number;
        action: string | null;
        dateAction: Date;
    }[]>;
    findOne(id: number): Promise<{
        user: any;
        id: number;
        action: string | null;
        dateAction: Date;
    }>;
    create(dto: CreateLogActivityDto): Promise<{
        user: any;
        id: number;
        action: string | null;
        dateAction: Date;
    }>;
    update(id: number, dto: UpdateLogActivityDto): Promise<{
        user: any;
        id: number;
        action: string | null;
        dateAction: Date;
    }>;
}
