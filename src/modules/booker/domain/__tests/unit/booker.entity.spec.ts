import { randomUUID } from 'crypto';
import { Booker, BookerProps } from '../../booker.entity';
import { BookerRegisteredEvent } from '../../events/booker-registered.event';
import { BookerEmail } from '../../value-objects/booker-email';

describe('Booker', () => {
  const bookerProps: BookerProps = {
    email: BookerEmail.create('john.doe@mail.com').unwrap(),
  };

  it('should create a Booker', async () => {
    // Act
    const result = Booker.create(bookerProps);

    // Assert
    expect(result.isOk()).toBe(true);

    const booker = result.unwrap();
    expect(booker).toBeInstanceOf(Booker);
    expect(booker.id).not.toBeNull();
    expect(booker.email).toBe(bookerProps.email);

    const registeredEventExists = booker.domainEvents.some(
      (event) => event instanceof BookerRegisteredEvent,
    );
    expect(registeredEventExists).toBe(true);
  });

  it('should create a Booker, but not raise a BookerRegistered event', async () => {
    // Arrange
    const existingId = randomUUID();

    // Act
    const result = Booker.create(bookerProps, existingId);

    // Assert
    expect(result.isOk()).toBe(true);
    const booker = result.unwrap();
    expect(booker.id).toBe(existingId);

    const registeredEventExists = booker.domainEvents.some(
      (event) => event instanceof BookerRegisteredEvent,
    );
    expect(registeredEventExists).toBe(false);
  });
});
