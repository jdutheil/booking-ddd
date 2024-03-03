import { ExceptionBase } from '@src/libs/exceptions';

export class ContactError extends ExceptionBase {
  static readonly message: string = 'Contact error';
  public readonly code: string = 'CONTACT.ERROR';

  constructor(message?: string, cause?: unknown) {
    super(message || ContactError.message, cause);
  }
}

export class ContactEmailAlreadyExistsError extends ContactError {
  static readonly message: string = 'Contact email already exists';
  public readonly code: string = 'CONTACT.EMAIL_ALREADY_EXISTS';

  constructor(cause?: unknown) {
    super(ContactEmailAlreadyExistsError.message, cause);
  }
}
