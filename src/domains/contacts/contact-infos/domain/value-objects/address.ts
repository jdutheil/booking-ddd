import { Guard } from '@src/libs/core/guard';
import { Err, None, Ok, Option, Result } from 'oxide.ts';
import { AddressError } from '../contact-infos.errors';

export type Street = string;
export type City = string;
export type ZipCode = string;
export type Country = string;

export interface AddressProps {
  street: Option<Street>;
  city: City;
  zipCode: ZipCode;
  country: Option<Country>;
}

export class Address {
  private constructor(public props: AddressProps) {}

  static create(props: AddressProps): Result<Address, AddressError> {
    const propsResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.city, argumentName: 'city' },
      { argument: props.zipCode, argumentName: 'zipCode' },
    ]);

    if (propsResult.isErr()) {
      return Err(new AddressError(propsResult.unwrapErr()));
    }

    return Ok(
      new Address({
        street: props.street ?? None,
        city: props.city,
        zipCode: props.zipCode,
        country: props.country ?? None,
      }),
    );
  }
}
