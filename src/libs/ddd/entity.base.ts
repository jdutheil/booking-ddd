import { randomUUID } from 'crypto';

export type EntityID = string;

export abstract class Entity<EntityProps> {
  protected readonly _id: EntityID;
  public readonly props: EntityProps;

  constructor(props: EntityProps, id?: EntityID) {
    this._id = id ?? randomUUID();
    this.props = props;
  }

  get id(): EntityID {
    return this._id;
  }

  public equals(entity?: Entity<EntityProps>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!(entity instanceof Entity)) {
      return false;
    }

    return this._id === entity._id;
  }
}
