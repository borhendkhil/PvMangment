import { CreateDirectionDto, UpdateDirectionDto } from './dto/direction.dto';
import { DirectionsService } from './directions.service';
export declare class DirectionsController {
    private readonly directionsService;
    constructor(directionsService: DirectionsService);
    findAll(): Promise<import("../database/entities/direction.entity").DirectionEntity[]>;
    findOne(id: number): Promise<import("../database/entities/direction.entity").DirectionEntity>;
    create(dto: CreateDirectionDto): Promise<import("../database/entities/direction.entity").DirectionEntity>;
    update(id: number, dto: UpdateDirectionDto): Promise<import("../database/entities/direction.entity").DirectionEntity>;
    remove(id: number): Promise<void>;
}
