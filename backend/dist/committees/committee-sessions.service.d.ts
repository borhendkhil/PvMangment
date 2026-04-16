import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { CommitteeSessionEntity } from '../database/entities/committee-session.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateCommitteeSessionDto, UpdateCommitteeSessionDto } from './dto/committee-session.dto';
export declare class CommitteeSessionsService extends BaseCrudService<CommitteeSessionEntity> {
    private readonly committeeRepository;
    private readonly userRepository;
    constructor(repository: Repository<CommitteeSessionEntity>, committeeRepository: Repository<CommitteeEntity>, userRepository: Repository<UserEntity>);
    findAll(): Promise<CommitteeSessionEntity[]>;
    findOne(id: number): Promise<CommitteeSessionEntity>;
    create(dto: CreateCommitteeSessionDto): Promise<CommitteeSessionEntity>;
    update(id: number, dto: UpdateCommitteeSessionDto): Promise<CommitteeSessionEntity>;
    findAssignedToUser(userId: number): Promise<CommitteeSessionEntity[]>;
    updateAssignedReport(userId: number, sessionId: number, dto: UpdateCommitteeSessionDto): Promise<CommitteeSessionEntity>;
}
