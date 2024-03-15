import { Email } from '../../value-objects/email';

describe('Email Value Object', () => {
  it('should return an error if email is not valid', () => {
    const email = Email.create('wrong-format');
    expect(email.isErr()).toBe(true);
  });

  it('should create an email', () => {
    const emailValue = 'john.doe@mail.com';
    const email = Email.create(emailValue);
    expect(email.isOk()).toBe(true);
    expect(email.unwrap().value).toBe(emailValue);
  });

  it('should format email', () => {
    const plainEmailValue = 'John.Doe@Mail.com';
    const formattedEmailValue = 'john.doe@mail.com';

    const email = Email.create(plainEmailValue);
    expect(email.isOk()).toBe(true);
    expect(email.unwrap().value).toBe(formattedEmailValue);
  });
});
