import { CreateEmployeFonctionDto, UpdateEmployeFonctionDto } from './dto/employe-fonction.dto';
import { EmployeFonctionsService } from './employe-fonctions.service';
export declare class EmployeFonctionsController {
    private readonly employeFonctionsService;
    constructor(employeFonctionsService: EmployeFonctionsService);
    getCurrentFunction(employeId: number): Promise<import("../database/entities/employe-fonction.entity").EmployeFonctionEntity | null>;
    findAll(): Promise<import("../database/entities/employe-fonction.entity").EmployeFonctionEntity[]>;
    findOne(id: number): Promise<import("../database/entities/employe-fonction.entity").EmployeFonctionEntity>;
    create(dto: CreateEmployeFonctionDto): Promise<import("../database/entities/employe-fonction.entity").EmployeFonctionEntity>;
    update(id: number, dto: UpdateEmployeFonctionDto): Promise<import("../database/entities/employe-fonction.entity").EmployeFonctionEntity>;
    remove(id: number): Promise<void>;
}
