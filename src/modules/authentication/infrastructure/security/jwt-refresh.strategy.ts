import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AggregateID } from '@src/libs/ddd';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      expiresIn: configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async validate(req: Request, id: AggregateID) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    return { id, refreshToken };
  }
}
