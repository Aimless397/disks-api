import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Disk {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  genre: string;

  @Field()
  subgenre: string;

  @Field()
  year: number;

  @Field()
  band: string;

  @Field({ nullable: true })
  cover: string;

  @Field({ nullable: true })
  mimetype: string;

  @Field()
  price: number;

  @Field()
  stock: number;

  @Field()
  disabled: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
