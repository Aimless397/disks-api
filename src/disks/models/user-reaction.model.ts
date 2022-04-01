import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserReaction {
  @Field()
  uuid: string;

  @Field()
  userId: number;

  @Field()
  diskId: number;

  @Field()
  like: boolean;

  @Field()
  likedAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
