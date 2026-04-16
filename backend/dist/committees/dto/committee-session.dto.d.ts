export declare class CreateCommitteeSessionDto {
    comiteId: number;
    dateSession?: string | null;
    lieu?: string | null;
    statut?: string | null;
}
declare const UpdateCommitteeSessionDto_base: import("@nestjs/common").Type<Partial<CreateCommitteeSessionDto>>;
export declare class UpdateCommitteeSessionDto extends UpdateCommitteeSessionDto_base {
}
export declare class CommitteeSessionResponseDto {
    id: number;
    comiteId: number;
    dateSession?: string | null;
    lieu?: string | null;
    statut?: string | null;
}
export {};
