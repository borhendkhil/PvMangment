export declare class CreateDirectionDto {
    code?: string | null;
    lib: string;
    address?: string | null;
}
declare const UpdateDirectionDto_base: import("@nestjs/common").Type<Partial<CreateDirectionDto>>;
export declare class UpdateDirectionDto extends UpdateDirectionDto_base {
}
export declare class DirectionResponseDto {
    id: number;
    code?: string | null;
    lib: string;
    address?: string | null;
}
export {};
