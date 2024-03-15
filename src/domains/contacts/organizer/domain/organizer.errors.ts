import { ExceptionBase } from '@src/libs/exceptions';

export class OrganizerError extends ExceptionBase {
  static readonly message: string = 'Organizer error';
  public readonly code: string = 'ORGANIZER.ERROR';

  constructor(message?: string, cause?: unknown) {
    super(message || OrganizerError.message, cause);
  }
}
