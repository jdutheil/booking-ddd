import { Email } from '@src/domains/contacts/shared/domain/value-objects/email';
import { randomUUID } from 'crypto';
import { OrganizerCreatedEvent } from '../../events/organizer-created.event';
import {
  Organizer,
  OrganizerProps,
  OrganizerType,
} from '../../organizer.entity';

describe('Organizer Entity', () => {
  const organizerProps: OrganizerProps = {
    bookerId: randomUUID(),
    name: 'John Doe',
    type: OrganizerType.OTHER,
    emails: [Email.create('john.doe@mail.com').unwrap()],
    phones: ['+33612345678'],
    contactIds: [],
  };

  it('should create a new Organizer', async () => {
    // Act
    const result = Organizer.create(organizerProps);

    // Assert
    expect(result.isOk()).toBe(true);

    const organizer = result.unwrap();
    expect(organizer).toBeInstanceOf(Organizer);
    expect(organizer.id).not.toBeNull();

    const createdEventExists = organizer.domainEvents.some(
      (event) => event instanceof OrganizerCreatedEvent,
    );
    expect(createdEventExists).toBe(true);
  });

  it('should create an Organizer entity, but not raise an OrganizerCreated event', async () => {
    // Arrange
    const existingId = randomUUID();

    // Act
    const result = Organizer.create(organizerProps, existingId);

    // Assert
    expect(result.isOk()).toBe(true);
    const organizer = result.unwrap();
    expect(organizer.id).toBe(existingId);

    const createdEventExists = organizer.domainEvents.some(
      (event) => event instanceof OrganizerCreatedEvent,
    );
    expect(createdEventExists).toBe(false);
  });

  it('should throw if name is empty', async () => {
    // Arrange
    const props: OrganizerProps = {
      bookerId: randomUUID(),
      name: '',
      type: OrganizerType.OTHER,
      emails: [],
      phones: [],
      contactIds: [],
    };

    // Act
    const result = Organizer.create(props);

    // Assert
    expect(result.isErr()).toBe(true);
  });

  it('should throw if name is too long', async () => {
    // Arrange
    const props: OrganizerProps = {
      bookerId: randomUUID(),
      name: 'a'.repeat(256),
      type: OrganizerType.OTHER,
      emails: [],
      phones: [],
      contactIds: [],
    };

    // Act
    const result = Organizer.create(props);

    // Assert
    expect(result.isErr()).toBe(true);
  });

  it('should add an email', async () => {
    // Arrange
    const organizer = Organizer.create(organizerProps).unwrap();
    const email = Email.create('john.doe2@mail.com').unwrap();

    // Act
    organizer.addEmail(email);

    // Assert
    expect(organizer.props.emails).toHaveLength(2);
    expect(organizer.props.emails).toContain(email);
  });

  it('should not add an email if it already exists', async () => {
    // Arrange
    const organizer = Organizer.create(organizerProps).unwrap();
    const email = Email.create('john.doe@mail.com').unwrap();
    const email2 = Email.create('john.doe2@mail.com').unwrap();

    // Act
    organizer.addEmail(email);
    organizer.addEmail(email2);

    // Assert
    expect(organizer.props.emails).toHaveLength(2);
    expect(organizer.props.emails).toContain(email);
    expect(organizer.props.emails).toContain(email2);
  });
});
