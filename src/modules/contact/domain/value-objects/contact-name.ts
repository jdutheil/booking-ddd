import { Guard } from '@src/libs/core/guard';
import { ValueObject } from '@src/libs/ddd';
import { Err, Ok, Option, Result } from 'oxide.ts';
import { ContactError } from '../contact.errors';

type FirstName = string;
type LastName = string;

export interface ContactNameProps {
  firstName: Option<FirstName>;
  lastName: LastName;
}

export class ContactName extends ValueObject<ContactNameProps> {
  get firstName(): Option<FirstName> {
    return this.props.firstName;
  }

  get lastName(): LastName {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName.unwrapOr('')} ${this.props.lastName}`.trim();
  }

  private constructor(props: ContactNameProps) {
    super(props);
  }

  public static create(
    props: ContactNameProps,
  ): Result<ContactName, ContactError> {
    const lastNameResult = Guard.againstNullOrUndefined(
      props.lastName,
      'lastName',
    );
    if (lastNameResult.isErr()) {
      return Err(new ContactError(lastNameResult.unwrapErr()));
    }

    if (!this.isLastNameValid(props.lastName)) {
      return Err(new ContactError('Last name is required'));
    }
    return Ok(new ContactName(props));
  }

  private static isLastNameValid(lastName: LastName): boolean {
    return lastName.trim().length > 0;
  }
}
