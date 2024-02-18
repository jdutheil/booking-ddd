export abstract class ExceptionBase extends Error {
  abstract code: string;

  constructor(
    readonly message: string,
    readonly cause?: Error,
    readonly metadata?: unknown,
  ) {
    super(message);
  }
}
