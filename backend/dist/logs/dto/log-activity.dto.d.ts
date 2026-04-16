export declare class CreateLogActivityDto {
    userId?: number | null;
    action: string;
}
declare const UpdateLogActivityDto_base: import("@nestjs/common").Type<Partial<CreateLogActivityDto>>;
export declare class UpdateLogActivityDto extends UpdateLogActivityDto_base {
}
export declare class LogActivityResponseDto {
    id: number;
    userId?: number | null;
    action?: string | null;
    dateAction: Date;
}
export {};
