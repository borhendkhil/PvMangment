import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubjectDecisionDto {
  @ApiProperty({ example: 'Sécurité informatique' })
  @IsString()
  @MaxLength(255)
  sujet: string;

  @ApiPropertyOptional({ example: 'Sujet détaillé', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}

export class UpdateSubjectDecisionDto extends PartialType(CreateSubjectDecisionDto) {}

export class SubjectDecisionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sécurité informatique' })
  sujet: string;

  @ApiPropertyOptional({ nullable: true, example: 'Sujet détaillé' })
  description?: string | null;
}
