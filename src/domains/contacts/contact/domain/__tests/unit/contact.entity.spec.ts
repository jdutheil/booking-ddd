import { randomUUID } from 'crypto';
import { None, Some } from 'oxide.ts';
import { Contact, ContactProps } from '../../contact.entity';
import { ContactCreatedEvent } from '../../events/contact-created.event';
import { ContactEmail } from '../../value-objects/contact-email';
import { ContactName } from '../../value-objects/contact-name';

describe('Contact Entity', () => {
  const contactProps: ContactProps = {
    bookerId: randomUUID(),
    name: Some(
      ContactName.create({
        firstName: Some('John'),
        lastName: Some('Doe'),
      }).unwrap(),
    ),
    email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
    phone: Some('1234567890'),
  };

  it('should create a new contact', async () => {
    // Act
    const result = await Contact.create(contactProps);

    // Assert
    expect(result.isOk()).toBe(true);

    const contact = result.unwrap();
    expect(contact).toBeInstanceOf(Contact);
    expect(contact.id).not.toBeNull();

    const createdEventExists = contact.domainEvents.some(
      (event) => event instanceof ContactCreatedEvent,
    );
    expect(createdEventExists).toBe(true);
  });

  it('should create a contact entity, but not raise a ContactCreated event', async () => {
    // Arrange
    const existingId = randomUUID();

    // Act
    const result = await Contact.create(contactProps, existingId);

    // Assert
    expect(result.isOk()).toBe(true);
    const contact = result.unwrap();
    expect(contact.id).toBe(existingId);

    const createdEventExists = contact.domainEvents.some(
      (event) => event instanceof ContactCreatedEvent,
    );
    expect(createdEventExists).toBe(false);
  });

  it('should return error if name and email are None', async () => {
    // Arrange
    const props: ContactProps = {
      bookerId: randomUUID(),
      name: None,
      email: None,
      phone: Some('1234567890'),
    };

    // Act
    const result = await Contact.create(props);

    // Assert
    expect(result.isErr()).toBe(true);
  });
});
