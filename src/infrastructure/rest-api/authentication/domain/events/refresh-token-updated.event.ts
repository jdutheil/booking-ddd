import { EntityID } from '@src/libs/ddd';
import { RefreshToken } from '../../application/ports/jwt-service.port';

export class RefreshTokenUpdatedEvent {
  static readonly eventName = 'authentication.refresh-token-updated' as const;

  authenticationId: EntityID;
  refreshToken: RefreshToken;

  constructor(props: RefreshTokenUpdatedEvent) {
    this.authenticationId = props.authenticationId;
    this.refreshToken = props.refreshToken;
  }
}
