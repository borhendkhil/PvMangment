import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDirectionDto {
  @ApiPropertyOptional({ example: '07', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  code?: string | null;

  @ApiProperty({ example: 'Direction centrale' })
  @IsString()
  @MaxLength(255)
  lib: string;

  @ApiPropertyOptional({ example: 'Tunis', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string | null;
}

export class UpdateDirectionDto extends PartialType(CreateDirectionDto) {}

export class DirectionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ nullable: true, example: '07' })
  code?: string | null;

  @ApiProperty({ example: 'Direction centrale' })
  lib: string;

  @ApiPropertyOptional({ nullable: true, example: 'Tunis' })
  address?: string | null;
}
