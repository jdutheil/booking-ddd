import { ExceptionBase } from '@src/libs/exceptions';

export class AuthenticationError extends ExceptionBase {
  static readonly message: string = 'Authentication error';
  public readonly code: string = 'AUTHENTICATION.ERROR';

  constructor(message?: string, cause?: Error) {
    super(message || AuthenticationError.message, cause);
  }
}

export class AuthenticationAlreadyExistsError extends AuthenticationError {
  static readonly message: string = 'Authentication already exists';
  public readonly code: string = 'AUTHENTICATION.ALREADY_EXISTS';

  constructor(cause?: Error) {
    super(AuthenticationAlreadyExistsError.message, cause);
  }
}

export class AuthenticationNotFoundError extends AuthenticationError {
  static readonly message: string = 'Authentication not found';
  public readonly code: string = 'AUTHENTICATION.NOT_FOUND';

  constructor(cause?: Error) {
    super(AuthenticationNotFoundError.message, cause);
  }
}

export class AuthenticationInvalidEmailError extends AuthenticationError {
  static readonly message: string = 'Authentication invalid email';
  public readonly code: string = 'AUTHENTICATION.INVALID_EMAIL';

  constructor(cause?: Error) {
    super(AuthenticationInvalidEmailError.message, cause);
  }
}

export class AuthenticationInvalidPasswordError extends AuthenticationError {
  static readonly message = 'Authentication invalid password';
  public readonly code = 'AUTHENTICATION.INVALID_PASSWORD';

  constructor(cause?: Error) {
    super(AuthenticationInvalidPasswordError.message, cause);
  }
}
