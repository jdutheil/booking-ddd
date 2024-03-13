// TODO : move in shared !

import { Guard } from '@src/libs/core/guard';
import { ValueObject } from '@src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { OrganizerError } from '../organizer.errors';

export interface OrganizerEmailProps {
  value: string;
}

export class OrganizerEmail extends ValueObject<OrganizerEmailProps> {
  private constructor(props: OrganizerEmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(email: string): Result<OrganizerEmail, OrganizerError> {
    const emailResult = Guard.againstNullOrUndefined(email, 'email');
    if (emailResult.isErr()) {
      return Err(new OrganizerError(emailResult.unwrapErr()));
    }

    if (!this.isValidEmail(email)) {
      return Err(new OrganizerError('Invalid email'));
    }

    return Ok(new OrganizerEmail({ value: this.format(email) }));
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
