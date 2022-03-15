import { Prisma, PrismaClient, Order } from '@prisma/client';
import { AbstractFactory } from './abstract.factory';

type OrderInput = Prisma.OrderCreateInput;

export class OrderFactory extends AbstractFactory<Order> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: OrderInput): Promise<Order> {
    return this.prismaClient.order.create({
      data: {
        ...input,
      },
    });
  }
  async makeMany(factorial: number, input?: OrderInput): Promise<Order[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
