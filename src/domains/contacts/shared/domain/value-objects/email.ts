import { Guard } from '@src/libs/core/guard';
import { ValueObject } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { InvalidEmailError } from '../errors';

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Result<Email, InvalidEmailError> {
    const emailResult = Guard.againstNullOrUndefined(email, 'email');
    if (emailResult.isErr()) {
      return Err(new InvalidEmailError(emailResult.unwrapErr()));
    }

    if (!this.isValidEmail(email)) {
      return Err(new InvalidEmailError('Invalid email'));
    }

    return Ok(new Email({ value: this.format(email) }));
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }
}
