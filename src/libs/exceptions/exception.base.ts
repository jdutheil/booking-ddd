export abstract class ExceptionBase extends Error {
  abstract code: string;

  constructor(
    readonly message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
  }
}
