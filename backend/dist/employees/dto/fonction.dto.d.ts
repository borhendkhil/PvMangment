export declare class CreateFonctionDto {
    name: string;
    label_ar: string;
    roleIds?: number[];
}
declare const UpdateFonctionDto_base: import("@nestjs/common").Type<Partial<CreateFonctionDto>>;
export declare class UpdateFonctionDto extends UpdateFonctionDto_base {
}
export declare class FonctionResponseDto {
    id: number;
    name: string;
    label_ar: string;
}
export {};
