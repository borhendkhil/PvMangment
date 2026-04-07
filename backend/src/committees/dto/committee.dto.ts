import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { DecisionResponseDto } from '../../decisions/dto/decision.dto';

export class CreateCommitteeDto {
  @ApiProperty({ example: 'PV Committee' })
  @IsString()
  @MaxLength(255)
  titre: string;

  @ApiPropertyOptional({ example: 'Direction committee', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}

export class UpdateCommitteeDto extends PartialType(CreateCommitteeDto) {}

export class CommitteeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'PV Committee' })
  titre: string;

  @ApiPropertyOptional({ nullable: true, example: 'Direction committee' })
  description?: string | null;

  @ApiPropertyOptional({ example: 0 })
  totalSessions?: number;

  @ApiPropertyOptional({ example: 0 })
  totalMembres?: number;

  @ApiPropertyOptional({ example: 0 })
  totalDecisions?: number;

  @ApiPropertyOptional({ type: [DecisionResponseDto] })
  decisions?: DecisionResponseDto[];
}
