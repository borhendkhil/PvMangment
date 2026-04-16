import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/services/base-crud.service';
import { DirectionEntity } from '../database/entities/direction.entity';
import { EmployeEntity } from '../database/entities/employe.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateEmployeDto, UpdateEmployeDto } from './dto/employe.dto';
export declare class EmployesService extends BaseCrudService<EmployeEntity> {
    private readonly directionRepository;
    private readonly userRepository;
    constructor(repository: Repository<EmployeEntity>, directionRepository: Repository<DirectionEntity>, userRepository: Repository<UserEntity>);
    private sanitizeEmploye;
    findAll(): Promise<{
        user: any;
        id: number;
        matricule: string | null;
        nom: string;
        prenom: string;
        telephone: string | null;
        address: string | null;
        direction: DirectionEntity | null;
        employeFonctions: import("../database/entities/employe-fonction.entity").EmployeFonctionEntity[];
        memberComites: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    }[]>;
    findOne(id: number): Promise<{
        user: any;
        id: number;
        matricule: string | null;
        nom: string;
        prenom: string;
        telephone: string | null;
        address: string | null;
        direction: DirectionEntity | null;
        employeFonctions: import("../database/entities/employe-fonction.entity").EmployeFonctionEntity[];
        memberComites: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    }>;
    create(dto: CreateEmployeDto): Promise<EmployeEntity>;
    update(id: number, dto: UpdateEmployeDto): Promise<{
        user: any;
        id: number;
        matricule: string | null;
        nom: string;
        prenom: string;
        telephone: string | null;
        address: string | null;
        direction: DirectionEntity | null;
        employeFonctions: import("../database/entities/employe-fonction.entity").EmployeFonctionEntity[];
        memberComites: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    } & EmployeEntity>;
}
