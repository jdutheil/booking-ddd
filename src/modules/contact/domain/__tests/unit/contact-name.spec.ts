import {
  ContactName,
  ContactNameProps,
} from '../../value-objects/contact-name';

describe('ContactName Value Object', () => {
  it('should create a contact', () => {
    const contactNameProps: ContactNameProps = {
      firstName: 'John',
      lastName: 'Doe',
    };

    const result = ContactName.create(contactNameProps);
    expect(result.isOk()).toBe(true);
  });

  it('should return error if lastName is empty', () => {
    const contactNameProps: ContactNameProps = {
      firstName: 'John',
      lastName: '',
    };

    const result = ContactName.create(contactNameProps);
    expect(result.isErr()).toBe(true);
  });
});
