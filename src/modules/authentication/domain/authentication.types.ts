import { AggregateID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';

export interface AuthenticationProps {
  bookerId: AggregateID;
  email: string;
  password: string;
  accessToken: Option<string>;
  refreshToken: Option<string>;
}

export interface CreateAuthenticationProps {
  bookerId: AggregateID;
  email: string;
  password: string;
}

export type Jwt = string;
