export declare class CreateRoleComiteDto {
    name: string;
    label_ar: string;
}
declare const UpdateRoleComiteDto_base: import("@nestjs/common").Type<Partial<CreateRoleComiteDto>>;
export declare class UpdateRoleComiteDto extends UpdateRoleComiteDto_base {
}
export declare class RoleComiteResponseDto {
    id: number;
    name: string;
    label_ar: string;
}
export {};
