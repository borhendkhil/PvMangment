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
    const committeeRoles = new Set<string>();

    for (const role of user.roles ?? []) {
      for (const permission of role.permissions ?? []) {
        permissions.add(permission.name);
      }
    }

    for (const membership of user.employe?.memberComites ?? []) {
      const committeeRole = membership.roleComite?.labelAr || membership.roleComite?.name;
      if (committeeRole) {
        committeeRoles.add(committeeRole);
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles,
      permissions: [...permissions],
      committeeRoles: [...committeeRoles],
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
        committeeRoles: [...committeeRoles],
      },
    };
  }
}
