import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCommitteeSessionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  comiteId: number;

  @ApiPropertyOptional({ example: '2026-04-10T09:00:00Z', nullable: true })
  @IsOptional()
  @IsDateString()
  dateSession?: string | null;

  @ApiPropertyOptional({ example: 'Board room', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  lieu?: string | null;

  @ApiPropertyOptional({ example: 'planned', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  statut?: string | null;
}

export class UpdateCommitteeSessionDto extends PartialType(CreateCommitteeSessionDto) {}

export class CommitteeSessionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  comiteId: number;

  @ApiPropertyOptional({ nullable: true, example: '2026-04-10T09:00:00Z' })
  dateSession?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Board room' })
  lieu?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'planned' })
  statut?: string | null;
}
