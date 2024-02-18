import { RepositoryPort } from '@src/libs/ddd';
import { Option } from 'oxide.ts';
import { UserEntity } from '../domain/user.entity';

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  findOneByEmail(email: string): Promise<Option<UserEntity>>;
}
