// TODO : try to create it !

// import { Inject } from '@nestjs/common';
// import { Prisma, PrismaClient } from '@prisma/client';
// import { Entity, RepositoryPort } from '@src/libs/ddd';
// import { Mapper } from '@src/libs/ddd/mapper.interface';
// import { PrismaService } from '../prisma.service';

// type PrismaOption = PrismaClient<Prisma.PrismaClientOptions, never>;

// export type PrismaModel = keyof Omit<
//   PrismaOption,
//   | '$connect'
//   | '$disconnect'
//   | '$executeRaw'
//   | '$executeRawUnsafe'
//   | '$on'
//   | '$queryRaw'
//   | '$queryRawUnsafe'
//   | '$transaction'
//   | '$use'
//   | '$extends'
//   | symbol
// >;

// type PrismaCreateInputs = Prisma.BookerCreateInput | Prisma.ContactCreateInput;

// export class PrismaRepository<
//   DomainEntity extends Entity<any>,
//   DbModel extends PrismaCreateInputs,
// > implements RepositoryPort<DomainEntity>
// {
//   @Inject(PrismaService)
//   private prisma!: PrismaService;

//   constructor(
//     protected readonly modelName: PrismaModel,
//     protected readonly mapper: Mapper<DomainEntity, DbModel>,
//   ) {}

//   async save(entity: DomainEntity | DomainEntity[]): Promise<void> {
//     const entities = Array.isArray(entity) ? entity : [entity];
//     const records = entities.map((entity) => this.mapper.toPersistence(entity));
//     try {
//       await this.prisma[this.modelName].createMany({ data: records });
//     } catch (error: any) {}
//   }
// }
