import { None, Some } from 'oxide.ts';
import {
  ContactName,
  ContactNameProps,
} from '../../value-objects/contact-name';

describe('ContactName Value Object', () => {
  it('should create a contact', () => {
    const contactNameProps: ContactNameProps = {
      firstName: Some('John'),
      lastName: Some('Doe'),
    };

    const result = ContactName.create(contactNameProps);
    expect(result.isOk()).toBe(true);
  });

  it('should return error if firstName and lastName are None', () => {
    const contactNameProps: ContactNameProps = {
      firstName: None,
      lastName: None,
    };

    const result = ContactName.create(contactNameProps);
    expect(result.isErr()).toBe(true);
  });

  it('should return error if firstName and lastName are empty', () => {
    const contactNameProps: ContactNameProps = {
      firstName: Some(''),
      lastName: Some(''),
    };

    const result = ContactName.create(contactNameProps);
    expect(result.isErr()).toBe(true);
  });
});
