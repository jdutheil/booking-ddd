import { None } from 'oxide.ts';
import { ContactInfos } from '../../contact-infos.entity';

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
});
