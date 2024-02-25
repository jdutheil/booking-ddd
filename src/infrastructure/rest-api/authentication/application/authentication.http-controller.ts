import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/routes';
import { AggregateID } from '@src/libs/ddd';
import { RefreshTokenUpdatedEvent } from '../domain/events/refresh-token-updated.event';
import { Public } from '../infrastructure/security/is-public';
import { JwtRefreshAuthenticationGuard } from '../infrastructure/security/jwt-refresh-authentication.guard';
import { LocalAuthenticationGuard } from '../infrastructure/security/local-authentication.guard';
import { TokensResponse } from '../interface/dtos/tokens.response.dto';
import { JwtQuery } from '../queries/jwt-query/jwt-query';
import { ValidateRefreshTokenQuery } from '../queries/validate-refresh-token/valiate-refresh-token.query';
import { Tokens } from './ports/jwt-service.port';

@Controller(routesV1.version)
@ApiTags('Authentication')
export class AuthenticationHttpController {
  constructor(
    private queryBus: QueryBus,
    private eventEmitter: EventEmitter2,
  ) {}

  @ApiOperation({ summary: 'Sign in', tags: ['Authentication'] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TokensResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong credentials',
  })
  @Public()
  @UseGuards(LocalAuthenticationGuard)
  @Post(routesV1.auth.signin)
  async signin(@Request() req: any): Promise<TokensResponse> {
    // Request has been handled by LocalAuthenticationGuard
    // We're sure the user has been validated
    // We just need to send the JWT
    const tokens = await this.getTokens(req.user.id);
    return new TokensResponse(tokens);
  }

  @Public()
  @UseGuards(JwtRefreshAuthenticationGuard)
  @Get('refresh')
  async refreshTokens(@Request() req: any): Promise<TokensResponse> {
    const validateRefreshToken: boolean = await this.queryBus.execute(
      new ValidateRefreshTokenQuery({
        authenticationId: req.user.id,
        refreshToken: req.user.refreshToken,
      }),
    );

    if (!validateRefreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(req.user.id);
    return new TokensResponse(tokens);
  }

  private async getTokens(authenticationId: AggregateID): Promise<Tokens> {
    const tokens: Tokens = await this.queryBus.execute(
      new JwtQuery(authenticationId),
    );

    this.eventEmitter.emit(
      RefreshTokenUpdatedEvent.eventName,
      new RefreshTokenUpdatedEvent({
        authenticationId: authenticationId,
        refreshToken: tokens.refreshToken,
      }),
    );

    return tokens;
  }

  @Get('test-auth')
  async test(): Promise<string> {
    return 'You are authenticated';
  }
}
