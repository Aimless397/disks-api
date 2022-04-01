import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field()
  uuid: string;

  @Field()
  userId: number;

  @Field()
  total: number;

  @Field()
  paid: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
