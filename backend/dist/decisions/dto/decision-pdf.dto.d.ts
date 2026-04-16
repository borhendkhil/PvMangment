export declare class CreateDecisionPdfDto {
    decisionId: number;
    pdfPath: string;
    pdfName?: string | null;
}
declare const UpdateDecisionPdfDto_base: import("@nestjs/common").Type<Partial<CreateDecisionPdfDto>>;
export declare class UpdateDecisionPdfDto extends UpdateDecisionPdfDto_base {
}
export declare class DecisionPdfResponseDto {
    id: number;
    decisionId: number;
    pdfPath: string;
    pdfName?: string | null;
}
export {};
