import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SaveSessionReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  context?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discussion?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rowsJson?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  statut?: string; // DRAFT or COMPLETED
}

export class FeedbackDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;
}
