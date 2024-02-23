import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthenticationGuard } from '../infrastructure/security/local-authentication.guard';
import { TokenResponse } from '../interface/dtos/token.response.dto';
import { JwtQuery } from '../queries/jwt-query/jwt-query';

@Controller()
@ApiTags('Authentication')
export class AuthenticationHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Request() req: any): Promise<TokenResponse> {
    // Request has been handled by LocalAuthenticationGuard
    // We're sure the user has been validated
    // We just need to send the JWT
    return {
      accessToken: await this.queryBus.execute(new JwtQuery(req.user)),
    };
  }
}
