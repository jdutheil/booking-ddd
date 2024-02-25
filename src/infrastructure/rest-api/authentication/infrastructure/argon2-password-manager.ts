import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PasswordManagerPort } from '../application/ports/password-manager.port';

@Injectable()
export class Argon2PasswordManager implements PasswordManagerPort {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }
}
