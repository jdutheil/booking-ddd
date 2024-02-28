import { Some } from 'oxide.ts';
import { Contact } from '../../contact.entity';
import { ContactEmail } from '../../value-objects/contact-email';
import { ContactName } from '../../value-objects/contact-name';

describe('Contact Entity', () => {
  it('should create a new contact', async () => {
    // Arrange
    const contactProps = {
      name: ContactName.create({
        firstName: Some('John'),
        lastName: Some('Doe'),
      }).unwrap(),
      email: Some(ContactEmail.create('john.doe@mail.com').unwrap()),
      phone: Some('1234567890'),
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
