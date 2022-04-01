import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartProduct {
  @Field()
  orderId: number;

  @Field()
  diskId: number;

  @Field()
  amount: number;

  @Field()
  selectionPrice: number;

  @Field()
  state: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
