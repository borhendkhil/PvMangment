import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDecisionDto {
  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  sujetId?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionId?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  comiteId?: number | null;

  @ApiPropertyOptional({ example: 'ADM-2026-001', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numAdmin?: string | null;

  @ApiPropertyOptional({ example: 'Title', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titre?: string | null;

  @ApiPropertyOptional({ example: 'Decision description', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 'التوصية المعتمدة للجلسة', nullable: true })
  @IsOptional()
  @IsString()
  recommendationText?: string | null;

  @ApiPropertyOptional({ example: 'الإدارة العامة ...', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  executionStructure?: string | null;

  @ApiPropertyOptional({ example: 'نهاية شهر أفريل 2026', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  deadlineText?: string | null;

  @ApiPropertyOptional({ example: '/files/decision.pdf', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fichierPath?: string | null;

  @ApiPropertyOptional({ example: 'decision.pdf', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fichierName?: string | null;

  @ApiPropertyOptional({ example: 'approved', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  statut?: string | null;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @ApiPropertyOptional({ example: '2026-04-06T12:00:00Z', nullable: true })
  @IsOptional()
  @IsDateString()
  dateUpload?: string | null;
}

export class UpdateDecisionDto extends PartialType(CreateDecisionDto) {}

export class DecisionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ nullable: true, example: 1 })
  sujetId?: number | null;

  @ApiPropertyOptional({
    nullable: true,
    example: { id: 1, sujet: 'Sécurité informatique' },
  })
  subject?: {
    id: number;
    sujet: string;
  } | null;

  @ApiPropertyOptional({ nullable: true, example: 1 })
  sessionId?: number | null;

  @ApiPropertyOptional({ nullable: true, example: 1 })
  comiteId?: number | null;

  @ApiPropertyOptional({ nullable: true, example: 'ADM-2026-001' })
  numAdmin?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Title' })
  titre?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Decision description' })
  description?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'التوصية المعتمدة للجلسة' })
  recommendationText?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'الإدارة العامة ...' })
  executionStructure?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'نهاية شهر أفريل 2026' })
  deadlineText?: string | null;

  @ApiPropertyOptional({ nullable: true, example: false })
  current?: boolean;

  @ApiPropertyOptional({ nullable: true, example: '/uploads/decision.pdf' })
  fichierPath?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'decision.pdf' })
  fichierName?: string | null;

  @ApiPropertyOptional({ nullable: true, example: '2026-04-07T00:00:00.000Z' })
  dateUpload?: Date | null;
}

export class UpdateDecisionAssignedReportDto {
  @ApiPropertyOptional({ example: 'التوصية المعتمدة للجلسة', nullable: true })
  @IsOptional()
  @IsString()
  recommendationText?: string | null;

  @ApiPropertyOptional({ example: 'الإدارة العامة ...', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  executionStructure?: string | null;

  @ApiPropertyOptional({ example: 'نهاية شهر أفريل 2026', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  deadlineText?: string | null;
}
