import { ExceptionBase } from './exception.base';

export class ArgumentInvalidException extends ExceptionBase {
  readonly code = 'ARGUMENT_INVALID';

  constructor(message: string, cause?: Error, metadata?: unknown) {
    super(message, cause, metadata);
  }
}

export class ArgumentNotProvidedException extends ExceptionBase {
  readonly code = 'ARGUMENT_NOT_PROVIDED';

  constructor(message: string, cause?: Error, metadata?: unknown) {
    super(message, cause, metadata);
  }
}
