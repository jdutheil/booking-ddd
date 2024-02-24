import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { JwtAuthenticationGuard } from '../infrastructure/security/jwt-authentication.guard';
import { LocalAuthenticationGuard } from '../infrastructure/security/local-authentication.guard';
import { TokensResponse } from '../interface/dtos/tokens.response.dto';
import { JwtQuery } from '../queries/jwt-query/jwt-query';
import { Tokens } from './ports/jwt-service.port';

@Controller(routesV1.version)
@ApiTags('Authentication')
export class AuthenticationHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: 'Sign in', tags: ['Authentication'] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TokensResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong credentials',
  })
  @UseGuards(LocalAuthenticationGuard)
  @Post(routesV1.auth.signin)
  async signin(@Request() req: any): Promise<TokensResponse> {
    // Request has been handled by LocalAuthenticationGuard
    // We're sure the user has been validated
    // We just need to send the JWT
    const tokens: Tokens = await this.queryBus.execute(
      new JwtQuery(req.user.id),
    );
    return new TokensResponse(tokens);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('test-auth')
  async test(): Promise<string> {
    return 'You are authenticated';
  }
}
