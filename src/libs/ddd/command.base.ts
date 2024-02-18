import { randomUUID } from 'crypto';

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>;

type CommandMetadata = {
  readonly correlationId: string;
  readonly causationId?: string;
  readonly userId?: string;
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
      userId: props.metadata?.userId,
      timestamp: props.metadata?.timestamp || Date.now(),
    };
  }
}
