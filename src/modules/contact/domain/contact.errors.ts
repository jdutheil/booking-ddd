import { ExceptionBase } from '@src/libs/exceptions';

export class ContactError extends ExceptionBase {
  static readonly message: string = 'Contact error';
  public readonly code: string = 'CONTACT.ERROR';

  constructor(message?: string, cause?: unknown) {
    super(message || ContactError.message, cause);
  }
}
