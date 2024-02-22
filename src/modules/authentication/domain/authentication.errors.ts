import { ExceptionBase } from '@src/libs/exceptions';

export class AuthenticationAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Authentication already exists';
  public readonly code = 'AUTHENTICATION.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(AuthenticationAlreadyExistsError.message, cause, metadata);
  }
}

export class AuthenticationNotFoundError extends ExceptionBase {
  static readonly message = 'Authentication not found';
  public readonly code = 'AUTHENTICATION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(AuthenticationNotFoundError.message, cause, metadata);
  }
}
