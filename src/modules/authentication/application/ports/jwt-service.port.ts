import { AggregateID } from '@src/libs/ddd';

export type AccessToken = string;
export type RefreshToken = string;

export type Tokens = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

export interface JwtServicePort {
  getTokens(id: AggregateID): Promise<Tokens>;
}

export const JWT_SERVICE = Symbol('JWT_SERVICE');
