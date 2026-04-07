import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min, ArrayUnique, IsArray } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'MANAGE_USERS' })
  @IsString()
  @MaxLength(255)
  name: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}

export class PermissionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'MANAGE_USERS' })
  name: string;
}

