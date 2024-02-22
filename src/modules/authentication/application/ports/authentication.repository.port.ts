import { RepositoryPort } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { AuthenticationEntity } from '../../domain/authentication.entity';

export interface AuthenticationRepositoryPort
  extends RepositoryPort<AuthenticationEntity> {
  findOneByEmail(email: string): Promise<Option<AuthenticationEntity>>;
}

export const AUTHENTICATION_REPOSITORY = Symbol('AUTHENTICATION_REPOSITORY');
