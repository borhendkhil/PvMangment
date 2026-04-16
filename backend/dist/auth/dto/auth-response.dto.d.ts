export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: number;
        email: string;
        roles: string[];
        permissions: string[];
        committeeRoles?: string[];
    };
}
