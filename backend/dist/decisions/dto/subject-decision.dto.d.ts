export declare class CreateSubjectDecisionDto {
    sujet: string;
    description?: string | null;
}
declare const UpdateSubjectDecisionDto_base: import("@nestjs/common").Type<Partial<CreateSubjectDecisionDto>>;
export declare class UpdateSubjectDecisionDto extends UpdateSubjectDecisionDto_base {
}
export declare class SubjectDecisionResponseDto {
    id: number;
    sujet: string;
    description?: string | null;
}
export {};
