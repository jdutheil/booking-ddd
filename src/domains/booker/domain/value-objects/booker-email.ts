import { Guard } from '@src/libs/core/guard';
import { ValueObject } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { BookerError } from '../booker.errors';

export interface BookerEmailProps {
  value: string;
}

export class BookerEmail extends ValueObject<BookerEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: BookerEmailProps) {
    super(props);
  }

  public static create(email: string): Result<BookerEmail, BookerError> {
    const emailResult = Guard.againstNullOrUndefined(email, 'email');
    if (emailResult.isErr()) {
      return Err(new BookerError(emailResult.unwrapErr()));
    }

    if (!this.isValidEmail(email)) {
      return Err(new BookerError('Invalid email'));
    }

    return Ok(new BookerEmail({ value: this.format(email) }));
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
