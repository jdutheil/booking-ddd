import { ExceptionBase } from '@src/libs/exceptions';

export class InvalidEmailError extends ExceptionBase {
  static readonly message: string = 'Invalid email';
  public readonly code: string = 'EMAIL.INVALID';

  constructor(cause?: unknown) {
    super(InvalidEmailError.message, cause);
  }
}
