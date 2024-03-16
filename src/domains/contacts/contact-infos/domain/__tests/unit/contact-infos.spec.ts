import { None } from 'oxide.ts';
import { ContactInfos } from '../../contact-infos.entity';
import { Email } from '../../value-objects/email';

describe('Contact Infos', () => {
  it('should create a new ContactInfos entity, and generate an ID', () => {
    const contactInfosResult = ContactInfos.create({
      emails: [],
      phones: [],
      website: None,
      address: None,
    });

    expect(contactInfosResult.isOk()).toBe(true);
    expect(contactInfosResult.unwrap().id).not.toBeNull();
  });

  it('should create a new ContactInfos entity, and use the provided ID', () => {
    const contactInfosResult = ContactInfos.create(
      {
        emails: [],
        phones: [],
        website: None,
        address: None,
      },
      '123',
    );

    expect(contactInfosResult.isOk()).toBe(true);
    expect(contactInfosResult.unwrap().id).toBe('123');
  });

  describe('Emails', () => {
    it('should add an email', () => {
      const contactInfosResult = ContactInfos.create({
        emails: [],
        phones: [],
        website: None,
        address: None,
      });

      const contactInfos = contactInfosResult.unwrap();
      const email = Email.create('john.doe@mail.com').unwrap();

      contactInfos.addEmail(email);

      expect(contactInfos.emails).toHaveLength(1);
      expect(contactInfos.emails[0]).toBe(email);
    });

    it('should not add an email if it already exists', async () => {
      const contactInfosResult = ContactInfos.create({
        emails: [],
        phones: [],
        website: None,
        address: None,
      });

      const contactInfos = contactInfosResult.unwrap();
      const email = Email.create('john.doe@mail.com');

      contactInfos.addEmail(email.unwrap());
      contactInfos.addEmail(email.unwrap());

      expect(contactInfos.emails).toHaveLength(1);
    });

    it('should remove an email', () => {
      const contactInfosResult = ContactInfos.create({
        emails: [],
        phones: [],
        website: None,
        address: None,
      });

      const contactInfos = contactInfosResult.unwrap();
      const email = Email.create('john.doe@mail.com').unwrap();

      contactInfos.addEmail(email);
      contactInfos.removeEmail(email);

      expect(contactInfos.emails).toHaveLength(0);
    });
  });
});
