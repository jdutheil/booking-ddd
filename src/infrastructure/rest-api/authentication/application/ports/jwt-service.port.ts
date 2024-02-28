import { EntityID } from '@src/libs/ddd';

export type AccessToken = string;
export type RefreshToken = string;

export type Tokens = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

export interface JwtServicePort {
  getTokens(id: EntityID): Promise<Tokens>;
}

export const JWT_SERVICE = Symbol('JWT_SERVICE');
