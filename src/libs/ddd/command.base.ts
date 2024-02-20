import { randomUUID } from 'crypto';

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>;

type CommandMetadata = {
  readonly correlationId: string;
  readonly causationId?: string;
  readonly bookerId?: string;
  readonly timestamp: number;
};

export class Command {
  readonly id: string;
  readonly metadata: CommandMetadata;

  constructor(props: CommandProps<unknown>) {
    this.id = props.id || randomUUID();
    this.metadata = {
      correlationId: props.metadata?.correlationId || randomUUID(),
      causationId: props.metadata?.causationId,
      bookerId: props.metadata?.bookerId,
      timestamp: props.metadata?.timestamp || Date.now(),
    };
  }
}
