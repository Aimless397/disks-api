import { Disk, Prisma, PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { AbstractFactory } from './abstract.factory';

type DiskInput = Partial<Prisma.DiskCreateInput>;

export class DiskFactory extends AbstractFactory<Disk> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: DiskInput = {}): Promise<Disk> {
    return this.prismaClient.disk.create({
      data: {
        ...input,
        name: input.name ?? faker.name.firstName(),
        genre: input.genre ?? faker.music.genre(),
        subgenre: input.subgenre ?? 'Alternative',
        year: input.year ?? faker.date.past(50).getFullYear(),
        band: input.band ?? faker.name.lastName(),
        cover: input.cover ?? faker.image.imageUrl(),
        mimetype: input.mimetype ?? 'png',
        price: input.price ?? faker.datatype.number(60),
        stock: input.stock ?? faker.datatype.number(10),
        disabled: input.disabled ?? false,
        deleted: input.deleted ?? false,
      },
    });
  }
  async makeMany(factorial: number, input?: DiskInput): Promise<Disk[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
