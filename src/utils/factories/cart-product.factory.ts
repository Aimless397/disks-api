import { Prisma, PrismaClient, CartProduct } from '@prisma/client';
import { AbstractFactory } from './abstract.factory';

type CartProductInput = Prisma.CartProductCreateInput;

export class CartProductFactory extends AbstractFactory<CartProduct> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: CartProductInput): Promise<CartProduct> {
    return this.prismaClient.cartProduct.create({
      data: {
        ...input,
      },
    });
  }
  async makeMany(
    factorial: number,
    input?: CartProductInput,
  ): Promise<CartProduct[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
