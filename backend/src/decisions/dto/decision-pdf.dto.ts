import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateDecisionPdfDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  decisionId: number;

  @ApiProperty({ example: '/uploads/pv-1.pdf' })
  @IsString()
  @MaxLength(255)
  pdfPath: string;

  @ApiPropertyOptional({ example: 'pv-1.pdf', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  pdfName?: string | null;
}

export class UpdateDecisionPdfDto extends PartialType(CreateDecisionPdfDto) {}

export class DecisionPdfResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  decisionId: number;

  @ApiProperty({ example: '/uploads/pv-1.pdf' })
  pdfPath: string;

  @ApiPropertyOptional({ example: 'pv-1.pdf', nullable: true })
  pdfName?: string | null;
}
