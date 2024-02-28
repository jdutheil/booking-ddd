import { ValueObject } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { ContactError } from '../contact.errors';

export interface ContactEmailProps {
  value: string;
}

export class ContactEmail extends ValueObject<ContactEmailProps> {
  private constructor(props: ContactEmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(email: string): Result<ContactEmail, ContactError> {
    if (!this.isValidEmail(email)) {
      return Err(new ContactError('Invalid email'));
    }

    return Ok(new ContactEmail({ value: this.format(email) }));
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
