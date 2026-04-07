import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin_informatique' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'مسؤول المعلوماتية' })
  @IsString()
  @MaxLength(255)
  label_ar: string;

  @ApiPropertyOptional({ type: [Number], example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  permissionIds?: number[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class AssignPermissionsDto {
  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  permissionIds: number[];
}

class PermissionResponseShape {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'MANAGE_USERS' })
  name: string;
}

export class RoleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin_informatique' })
  name: string;

  @ApiProperty({ example: 'مسؤول المعلوماتية' })
  label_ar: string;

  @ApiPropertyOptional({ type: [PermissionResponseShape] })
  permissions?: PermissionResponseShape[];
}
