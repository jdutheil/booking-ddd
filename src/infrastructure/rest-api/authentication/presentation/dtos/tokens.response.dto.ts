import { ApiProperty } from '@nestjs/swagger';
import {
  AccessToken,
  RefreshToken,
} from '../../application/ports/jwt-service.port';

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
