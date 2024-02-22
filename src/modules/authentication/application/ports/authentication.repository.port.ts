import { RepositoryPort } from '@src/libs/ddd';
import { AuthenticationEntity } from '../../domain/authentication.entity';

export interface AuthenticationRepositoryPort
  extends RepositoryPort<AuthenticationEntity> {}

export const AUTHENTICATION_REPOSITORY = Symbol('AUTHENTICATION_REPOSITORY');
