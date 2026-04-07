import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ type: [Number], example: [1] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  roleIds?: number[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class SetUserRolesDto {
  @ApiProperty({ type: [Number], example: [1, 4] })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  roleIds: number[];
}

class UserRoleShape {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'directeur' })
  name: string;

  @ApiProperty({ example: 'مدير' })
  labelAr: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ example: '12345678', nullable: true })
  telephone?: string | null;

  @ApiProperty({ example: true })
  enabled: boolean;

  @ApiPropertyOptional({ type: [UserRoleShape] })
  roles?: UserRoleShape[];
}
