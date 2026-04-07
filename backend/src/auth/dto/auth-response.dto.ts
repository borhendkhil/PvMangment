import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW4iLCJyb2xlcyI6WyJhZG1pbl9pbmZvcm1hdGlxdWUiXSwicGVybWlzc2lvbnMiOlsiTUFOQUdFX1VTRVJTIiJdfQ.example',
  })
  accessToken: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'admin@example.com',
      roles: ['admin_informatique'],
      permissions: ['MANAGE_USERS'],
    },
  })
  user: {
    id: number;
    email: string;
    roles: string[];
    permissions: string[];
  };
}
