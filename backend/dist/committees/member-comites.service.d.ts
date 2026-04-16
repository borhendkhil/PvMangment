import { Repository } from 'typeorm';
import { CommitteeEntity } from '../database/entities/comite.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { MemberComiteEntity } from '../database/entities/member-comite.entity';
import { RoleComiteEntity } from '../database/entities/role-comite.entity';
import { CreateMemberComiteDto, UpdateMemberComiteDto } from './dto/member-comite.dto';
export declare class MemberComitesService {
    private readonly repository;
    private readonly committeeRepository;
    private readonly employeRepository;
    private readonly roleComiteRepository;
    constructor(repository: Repository<MemberComiteEntity>, committeeRepository: Repository<CommitteeEntity>, employeRepository: Repository<EmployeEntity>, roleComiteRepository: Repository<RoleComiteEntity>);
    findAll(): Promise<MemberComiteEntity[]>;
    findOne(comiteId: number, employeId: number): Promise<MemberComiteEntity>;
    create(dto: CreateMemberComiteDto): Promise<MemberComiteEntity>;
    update(comiteId: number, employeId: number, dto: UpdateMemberComiteDto): Promise<MemberComiteEntity>;
    remove(comiteId: number, employeId: number): Promise<void>;
}
