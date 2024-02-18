import { Entity } from './entity.base';

export interface Mapper<DomainEntity extends Entity<any>, DbRecord> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: DbRecord): DomainEntity;
}
