import { Option } from 'oxide.ts';
import { Authentication } from '../../domain/authentication.entity';

export interface AuthenticationRepository {
  save(entity: Authentication): Promise<void>;
  update(entity: Authentication): Promise<void>;
  findOneById(id: string): Promise<Option<Authentication>>;
  findOneByEmail(email: string): Promise<Option<Authentication>>;
}

export const AUTHENTICATION_REPOSITORY = Symbol('AUTHENTICATION_REPOSITORY');
