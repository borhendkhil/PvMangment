import { CreateLogActivityDto, UpdateLogActivityDto } from './dto/log-activity.dto';
import { LogActivityService } from './log-activity.service';
export declare class LogsController {
    private readonly logActivityService;
    constructor(logActivityService: LogActivityService);
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
    remove(id: number): Promise<void>;
}
