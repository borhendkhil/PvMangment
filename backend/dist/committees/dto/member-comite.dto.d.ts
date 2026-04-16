export declare class CreateMemberComiteDto {
    comiteId: number;
    employeId: number;
    roleComiteId?: number | null;
}
declare const UpdateMemberComiteDto_base: import("@nestjs/common").Type<Partial<CreateMemberComiteDto>>;
export declare class UpdateMemberComiteDto extends UpdateMemberComiteDto_base {
}
export declare class MemberComiteResponseDto {
    comiteId: number;
    employeId: number;
    roleComiteId?: number | null;
}
export {};
