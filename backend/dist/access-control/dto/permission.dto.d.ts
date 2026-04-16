export declare class CreatePermissionDto {
    name: string;
}
declare const UpdatePermissionDto_base: import("@nestjs/common").Type<Partial<CreatePermissionDto>>;
export declare class UpdatePermissionDto extends UpdatePermissionDto_base {
}
export declare class PermissionResponseDto {
    id: number;
    name: string;
}
export {};
