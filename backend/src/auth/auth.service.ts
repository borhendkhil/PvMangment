import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailForAuth(dto.email);
    if (!user || !user.enabled) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = new Set<string>();
    const roles = user.roles?.map((role) => role.name) ?? [];

    for (const role of user.roles ?? []) {
      for (const permission of role.permissions ?? []) {
        permissions.add(permission.name);
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles,
      permissions: [...permissions],
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET', 'change-me'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1d') as any,
      }),
      user: {
        id: user.id,
        email: user.email,
        roles,
        permissions: [...permissions],
      },
    };
  }
}
