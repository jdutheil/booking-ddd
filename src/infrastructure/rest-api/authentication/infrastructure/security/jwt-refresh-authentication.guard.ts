import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthenticationGuard extends AuthGuard('jwt-refresh') {}
