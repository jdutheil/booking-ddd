import { ApiProperty } from '@nestjs/swagger';
import { RefreshToken } from '../../application/ports/jwt-service.port';
import { AccessToken } from './../../application/ports/jwt-service.port';

export class TokensResponse {
  @ApiProperty()
  readonly accessToken: AccessToken;

  @ApiProperty()
  readonly refreshToken: RefreshToken;

  constructor(props: TokensResponse) {
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }
}
