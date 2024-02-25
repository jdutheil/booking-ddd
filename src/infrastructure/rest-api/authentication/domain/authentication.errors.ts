import { ExceptionBase } from '@src/libs/exceptions';

export class AuthenticationError extends ExceptionBase {
  static readonly message: string = 'Authentication error';
  public readonly code: string = 'AUTHENTICATION.ERROR';

  constructor(message?: string, cause?: Error, metadata?: unknown) {
    super(message || AuthenticationError.message, cause, metadata);
  }
}

export class AuthenticationAlreadyExistsError extends AuthenticationError {
  static readonly message: string = 'Authentication already exists';
  public readonly code: string = 'AUTHENTICATION.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(AuthenticationAlreadyExistsError.message, cause, metadata);
  }
}

export class AuthenticationNotFoundError extends AuthenticationError {
  static readonly message: string = 'Authentication not found';
  public readonly code: string = 'AUTHENTICATION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(AuthenticationNotFoundError.message, cause, metadata);
  }
}

export class AuthenticationInvalidEmailError extends AuthenticationError {
  static readonly message: string = 'Authentication invalid email';
  public readonly code: string = 'AUTHENTICATION.INVALID_EMAIL';

  constructor(cause?: Error, metadata?: unknown) {
    super(AuthenticationInvalidEmailError.message, cause, metadata);
  }
}

export class AuthenticationInvalidPasswordError extends AuthenticationError {
  static readonly message = 'Authentication invalid password';
  public readonly code = 'AUTHENTICATION.INVALID_PASSWORD';

  constructor(cause?: Error, metadata?: unknown) {
    super(AuthenticationInvalidPasswordError.message, cause, metadata);
  }
}
