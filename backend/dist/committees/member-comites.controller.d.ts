import { CreateMemberComiteDto, UpdateMemberComiteDto } from './dto/member-comite.dto';
import { MemberComitesService } from './member-comites.service';
export declare class MemberComitesController {
    private readonly memberComitesService;
    constructor(memberComitesService: MemberComitesService);
    findAll(): Promise<import("../database/entities/member-comite.entity").MemberComiteEntity[]>;
    findOne(comiteId: number, employeId: number): Promise<import("../database/entities/member-comite.entity").MemberComiteEntity>;
    create(dto: CreateMemberComiteDto): Promise<import("../database/entities/member-comite.entity").MemberComiteEntity>;
    update(comiteId: number, employeId: number, dto: UpdateMemberComiteDto): Promise<import("../database/entities/member-comite.entity").MemberComiteEntity>;
    remove(comiteId: number, employeId: number): Promise<void>;
}
