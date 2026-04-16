import { CreateEmployeDto, UpdateEmployeDto } from './dto/employe.dto';
import { EmployesService } from './employes.service';
export declare class EmployeesController {
    private readonly employesService;
    constructor(employesService: EmployesService);
    findAll(): Promise<{
        user: any;
        id: number;
        matricule: string | null;
        nom: string;
        prenom: string;
        telephone: string | null;
        address: string | null;
        direction: import("../database/entities/direction.entity").DirectionEntity | null;
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
        direction: import("../database/entities/direction.entity").DirectionEntity | null;
        employeFonctions: import("../database/entities/employe-fonction.entity").EmployeFonctionEntity[];
        memberComites: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    }>;
    create(dto: CreateEmployeDto): Promise<import("../database/entities/employe.entity").EmployeEntity>;
    update(id: number, dto: UpdateEmployeDto): Promise<{
        user: any;
        id: number;
        matricule: string | null;
        nom: string;
        prenom: string;
        telephone: string | null;
        address: string | null;
        direction: import("../database/entities/direction.entity").DirectionEntity | null;
        employeFonctions: import("../database/entities/employe-fonction.entity").EmployeFonctionEntity[];
        memberComites: import("../database/entities/member-comite.entity").MemberComiteEntity[];
    } & import("../database/entities/employe.entity").EmployeEntity>;
    remove(id: number): Promise<void>;
}
