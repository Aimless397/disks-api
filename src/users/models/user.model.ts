import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  uuid: string;

  @Field()
  role: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  securityQuestion: string;

  @Field()
  securityAnswer: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
