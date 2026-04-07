import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateLogActivityDto {
  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;

  @ApiProperty({ example: 'POST /users' })
  @IsString()
  @MaxLength(255)
  action: string;
}

export class UpdateLogActivityDto extends PartialType(CreateLogActivityDto) {}

export class LogActivityResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  userId?: number | null;

  @ApiPropertyOptional({ example: 'POST /users', nullable: true })
  action?: string | null;

  @ApiProperty({ example: '2026-04-06T12:00:00.000Z' })
  dateAction: Date;
}
