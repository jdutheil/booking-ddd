import { AggregateID } from '@src/libs/ddd';

export interface AuthenticationProps {
  bookerId: AggregateID;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface CreateAuthenticationProps {
  bookerId: AggregateID;
  email: string;
  password: string;
}
