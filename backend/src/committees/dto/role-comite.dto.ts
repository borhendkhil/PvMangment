import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateRoleComiteDto {
  @ApiProperty({ example: 'Président' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'رئيس' })
  @IsString()
  @MaxLength(255)
  label_ar: string;
}

export class UpdateRoleComiteDto extends PartialType(CreateRoleComiteDto) {}

export class RoleComiteResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Président' })
  name: string;

  @ApiProperty({ example: 'رئيس' })
  label_ar: string;
}
