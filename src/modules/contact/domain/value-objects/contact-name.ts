import { Guard } from '@src/libs/core/guard';
import { ValueObject } from '@src/libs/ddd';
import { Err, Ok, Option, Result } from 'oxide.ts';
import { ContactError } from '../contact.errors';

type FirstName = string;
type LastName = string;

export interface ContactNameProps {
  firstName: Option<FirstName>;
  lastName: Option<LastName>;
}

export class ContactName extends ValueObject<ContactNameProps> {
  get firstName(): Option<FirstName> {
    return this.props.firstName;
  }

  get lastName(): Option<LastName> {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName.unwrapOr('')} ${this.props.lastName.unwrapOr('')}`.trim();
  }

  private constructor(props: ContactNameProps) {
    super(props);
  }

  public static create(
    props: ContactNameProps,
  ): Result<ContactName, ContactError> {
    const nameResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.firstName, argumentName: 'firstName' },
      { argument: props.lastName, argumentName: 'lastName' },
    ]);
    if (nameResult.isErr()) {
      return Err(new ContactError(nameResult.unwrapErr()));
    }

    if (
      this.isFirstNameEmpty(props.firstName) &&
      this.isLastNameEmpty(props.lastName)
    ) {
      return Err(new ContactError('First name and last name cannot be empty.'));
    }

    return Ok(new ContactName(props));
  }

  private static isFirstNameEmpty(firstName: Option<FirstName>): boolean {
    if (firstName.isNone()) {
      return true;
    } else {
      return firstName.unwrap().trim().length === 0;
    }
  }

  private static isLastNameEmpty(lastName: Option<LastName>): boolean {
    if (lastName.isNone()) {
      return true;
    } else {
      return lastName.unwrap().trim().length === 0;
    }
  }
}
