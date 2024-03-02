import { DomainEvent } from '@src/libs/ddd';
import { Authentication } from '../authentication.entity';

export class AuthenticationCreatedEvent extends DomainEvent {
  constructor(public readonly authentication: Authentication) {
    super({ aggregateId: authentication.id });
  }
}
