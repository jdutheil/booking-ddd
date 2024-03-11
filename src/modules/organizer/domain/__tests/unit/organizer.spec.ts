import { randomUUID } from 'crypto';
import { OrganizerCreatedEvent } from '../../events/organizer-created.event';
import { Organizer, OrganizerProps } from '../../organizer.entity';

describe('Organizer Entity', () => {
  const organizerProps: OrganizerProps = {
    bookerId: randomUUID(),
    name: 'John Doe',
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
      contactIds: [],
    };

    // Act
    const result = Organizer.create(props);

    // Assert
    expect(result.isErr()).toBe(true);
  });
});
