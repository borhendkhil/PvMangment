import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEmployeDto {
  @ApiPropertyOptional({ example: 'A123', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  matricule?: string | null;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @MaxLength(100)
  nom: string;

  @ApiProperty({ example: 'Nadia' })
  @IsString()
  @MaxLength(100)
  prenom: string;

  @ApiPropertyOptional({ example: '12345678', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string | null;

  @ApiPropertyOptional({ example: 'Tunis', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  directionId?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;
}

export class UpdateEmployeDto extends PartialType(CreateEmployeDto) {}

export class EmployeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ nullable: true, example: 'A123' })
  matricule?: string | null;

  @ApiProperty({ example: 'Dupont' })
  nom: string;

  @ApiProperty({ example: 'Nadia' })
  prenom: string;

  @ApiPropertyOptional({ nullable: true, example: '12345678' })
  telephone?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Tunis' })
  address?: string | null;
}
