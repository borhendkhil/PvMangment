export declare class CreateDecisionDto {
    sujetId?: number | null;
    sessionId?: number | null;
    comiteId?: number | null;
    numAdmin?: string | null;
    titre?: string | null;
    description?: string | null;
    recommendationText?: string | null;
    executionStructure?: string | null;
    deadlineText?: string | null;
    fichierPath?: string | null;
    fichierName?: string | null;
    statut?: string | null;
    current?: boolean;
    dateUpload?: string | null;
}
declare const UpdateDecisionDto_base: import("@nestjs/common").Type<Partial<CreateDecisionDto>>;
export declare class UpdateDecisionDto extends UpdateDecisionDto_base {
}
export declare class DecisionResponseDto {
    id: number;
    sujetId?: number | null;
    subject?: {
        id: number;
        sujet: string;
    } | null;
    sessionId?: number | null;
    comiteId?: number | null;
    numAdmin?: string | null;
    titre?: string | null;
    description?: string | null;
    recommendationText?: string | null;
    executionStructure?: string | null;
    deadlineText?: string | null;
    current?: boolean;
    fichierPath?: string | null;
    fichierName?: string | null;
    dateUpload?: Date | null;
}
export declare class UpdateDecisionAssignedReportDto {
    recommendationText?: string | null;
    executionStructure?: string | null;
    deadlineText?: string | null;
}
export {};
