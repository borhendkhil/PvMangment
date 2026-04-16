import { DecisionResponseDto } from '../../decisions/dto/decision.dto';
export declare class CreateCommitteeDto {
    titre: string;
    description?: string | null;
}
declare const UpdateCommitteeDto_base: import("@nestjs/common").Type<Partial<CreateCommitteeDto>>;
export declare class UpdateCommitteeDto extends UpdateCommitteeDto_base {
}
export declare class CommitteeResponseDto {
    id: number;
    titre: string;
    description?: string | null;
    totalSessions?: number;
    totalMembres?: number;
    totalDecisions?: number;
    decisions?: DecisionResponseDto[];
}
export {};
