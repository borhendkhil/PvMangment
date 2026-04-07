import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateEmployeFonctionDto {
  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  employeId?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  fonctionId?: number | null;

  @ApiProperty({ example: '2026-02-01' })
  @IsDateString()
  dateDebut: string;

  @ApiPropertyOptional({ example: '2026-12-31', nullable: true })
  @IsOptional()
  @IsDateString()
  dateFin?: string | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateEmployeFonctionDto extends PartialType(CreateEmployeFonctionDto) {}

export class EmployeFonctionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  employeId?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  fonctionId?: number | null;

  @ApiProperty({ example: '2026-02-01' })
  dateDebut: string;

  @ApiPropertyOptional({ example: '2026-12-31', nullable: true })
  dateFin?: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;
}
