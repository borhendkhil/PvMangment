import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateMemberComiteDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  comiteId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  employeId: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  roleComiteId?: number | null;
}

export class UpdateMemberComiteDto extends PartialType(CreateMemberComiteDto) {}

export class MemberComiteResponseDto {
  @ApiProperty({ example: 1 })
  comiteId: number;

  @ApiProperty({ example: 1 })
  employeId: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  roleComiteId?: number | null;
}
