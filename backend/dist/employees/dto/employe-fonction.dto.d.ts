export declare class CreateEmployeFonctionDto {
    employeId?: number | null;
    fonctionId?: number | null;
    dateDebut: string;
    dateFin?: string | null;
    isActive?: boolean;
}
declare const UpdateEmployeFonctionDto_base: import("@nestjs/common").Type<Partial<CreateEmployeFonctionDto>>;
export declare class UpdateEmployeFonctionDto extends UpdateEmployeFonctionDto_base {
}
export declare class EmployeFonctionResponseDto {
    id: number;
    employeId?: number | null;
    fonctionId?: number | null;
    dateDebut: string;
    dateFin?: string | null;
    isActive: boolean;
}
export {};
