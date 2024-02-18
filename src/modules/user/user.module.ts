import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserService } from './commands/create-user/create-user.service';
import { UserPrismaRepository } from './database/user.prisma-repository';
import { USER_REPOSITORY } from './database/user.repository.port';
import { UserMapper } from './domain/user.mapper';

const commandHandlers: Provider[] = [CreateUserService];
const mappers: Provider[] = [UserMapper];
const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserPrismaRepository,
  },
];

@Module({
  imports: [CqrsModule],
  providers: [...mappers, ...repositories, ...commandHandlers],
})
export class UserModule {}
