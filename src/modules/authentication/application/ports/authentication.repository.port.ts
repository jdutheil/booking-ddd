import { Option } from 'oxide.ts';
import { AuthenticationEntity } from '../../domain/authentication.entity';

export interface AuthenticationRepositoryPort {
  save(entity: AuthenticationEntity): Promise<void>;
  update(entity: AuthenticationEntity): Promise<void>;
  findOneById(id: string): Promise<Option<AuthenticationEntity>>;
  findOneByEmail(email: string): Promise<Option<AuthenticationEntity>>;
}

export const AUTHENTICATION_REPOSITORY = Symbol('AUTHENTICATION_REPOSITORY');
