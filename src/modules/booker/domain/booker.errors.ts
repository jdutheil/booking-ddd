import { ExceptionBase } from '@src/libs/exceptions';

export class BookerAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Booker already exists';
  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(BookerAlreadyExistsError.message, cause, metadata);
  }
}

export class BookerNotFoundError extends ExceptionBase {
  static readonly message = 'Booker not found';
  public readonly code = 'USER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(BookerNotFoundError.message, cause, metadata);
  }
}
