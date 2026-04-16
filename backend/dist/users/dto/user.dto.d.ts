export declare class CreateUserDto {
    email: string;
    password: string;
    telephone?: string | null;
    enabled?: boolean;
    roleIds?: number[];
}
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export declare class SetUserRolesDto {
    roleIds: number[];
}
declare class UserRoleShape {
    id: number;
    name: string;
    labelAr: string;
}
export declare class UserResponseDto {
    id: number;
    email: string;
    telephone?: string | null;
    enabled: boolean;
    roles?: UserRoleShape[];
}
export {};
