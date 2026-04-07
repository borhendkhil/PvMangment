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

export class CreateFonctionDto {
  @ApiProperty({ example: 'directeur' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'مدير' })
  @IsString()
  @MaxLength(255)
  label_ar: string;

  @ApiPropertyOptional({ type: [Number], example: [1, 4] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  roleIds?: number[];
}

export class UpdateFonctionDto extends PartialType(CreateFonctionDto) {}

export class FonctionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'directeur' })
  name: string;

  @ApiProperty({ example: 'مدير' })
  label_ar: string;
}
