import { Contact } from '../../contact.entity';
import { ContactEmail } from '../../value-objects/contact-email';

describe('Contact Entity', () => {
  it('should create a new contact', async () => {
    // Arrange
    const contactProps = {
      firstName: 'John',
      lastName: 'Doe',
      email: ContactEmail.create('john.doe@mail.com').unwrap(),
      phone: '1234567890',
    };

    // Act
    const result = await Contact.create(contactProps);

    // Assert
    expect(result.isOk()).toBe(true);

    const contact = result.unwrap();
    expect(contact).toBeInstanceOf(Contact);
    expect(contact.id).not.toBeNull();

    // TODO : test events !
  });
});
