import { ExceptionBase } from '@src/libs/exceptions';

export class BookerError extends ExceptionBase {
  static readonly message: string = 'Booker error';
  public readonly code: string = 'BOOKER.ERROR';

  constructor(message?: string, cause?: Error) {
    super(message || BookerError.message, cause);
  }
}

export class BookerAlreadyExistsError extends BookerError {
  static readonly message = 'Booker already exists';
  public readonly code = 'BOOKER.ALREADY_EXISTS';

  constructor(cause?: Error) {
    super(BookerAlreadyExistsError.message, cause);
  }
}

export class BookerNotFoundError extends BookerError {
  static readonly message = 'Booker not found';
  public readonly code = 'BOOKER.NOT_FOUND';

  constructor(cause?: Error) {
    super(BookerNotFoundError.message, cause);
  }
}
