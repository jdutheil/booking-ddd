import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordEncrypter {
  async encrypt(plainPassword: string): Promise<string> {
    return argon2.hash(plainPassword);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, plainPassword);
  }
}
