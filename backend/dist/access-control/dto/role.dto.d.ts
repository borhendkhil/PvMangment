export declare class CreateRoleDto {
    name: string;
    label_ar: string;
    permissionIds?: number[];
}
declare const UpdateRoleDto_base: import("@nestjs/common").Type<Partial<CreateRoleDto>>;
export declare class UpdateRoleDto extends UpdateRoleDto_base {
}
export declare class AssignPermissionsDto {
    permissionIds: number[];
}
declare class PermissionResponseShape {
    id: number;
    name: string;
}
export declare class RoleResponseDto {
    id: number;
    name: string;
    label_ar: string;
    permissions?: PermissionResponseShape[];
}
export {};
