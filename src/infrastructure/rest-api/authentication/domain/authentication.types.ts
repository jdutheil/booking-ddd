import { EntityID } from '@src/libs/ddd';
import { Option } from 'oxide.ts';

export interface AuthenticationProps {
  bookerId: EntityID;
  email: string;
  password: string;
  accessToken: Option<string>;
  refreshToken: Option<string>;
}

export interface CreateAuthenticationProps {
  bookerId: EntityID;
  email: string;
  password: string;
}
