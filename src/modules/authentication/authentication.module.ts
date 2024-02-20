import { Module, Provider } from '@nestjs/common';
import { PasswordEncrypter } from './infrastructure/password-encrypter';

const infrastructureProviders: Provider[] = [PasswordEncrypter];

@Module({
  providers: [...infrastructureProviders],
})
export class AuthenticationModule {}
