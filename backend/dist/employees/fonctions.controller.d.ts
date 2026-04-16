import { CreateFonctionDto, UpdateFonctionDto } from './dto/fonction.dto';
import { FonctionsService } from './fonctions.service';
import { SetRoleIdsDto } from './users-role-mapping.dto';
export declare class FonctionsController {
    private readonly fonctionsService;
    constructor(fonctionsService: FonctionsService);
    findAll(): Promise<import("../database/entities/fonction.entity").FonctionEntity[]>;
    findOne(id: number): Promise<import("../database/entities/fonction.entity").FonctionEntity>;
    create(dto: CreateFonctionDto): Promise<import("../database/entities/fonction.entity").FonctionEntity>;
    update(id: number, dto: UpdateFonctionDto): Promise<import("../database/entities/fonction.entity").FonctionEntity>;
    setRoles(id: number, dto: SetRoleIdsDto): Promise<import("../database/entities/fonction.entity").FonctionEntity>;
    remove(id: number): Promise<void>;
}
