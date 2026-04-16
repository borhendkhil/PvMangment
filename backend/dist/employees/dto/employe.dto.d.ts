export declare class CreateEmployeDto {
    matricule?: string | null;
    nom: string;
    prenom: string;
    telephone?: string | null;
    address?: string | null;
    directionId?: number | null;
    userId?: number | null;
}
declare const UpdateEmployeDto_base: import("@nestjs/common").Type<Partial<CreateEmployeDto>>;
export declare class UpdateEmployeDto extends UpdateEmployeDto_base {
}
export declare class EmployeResponseDto {
    id: number;
    matricule?: string | null;
    nom: string;
    prenom: string;
    telephone?: string | null;
    address?: string | null;
}
export {};
