import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserReactionDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userId: number;

  @Expose()
  readonly diskId: number;

  @Expose()
  readonly like: boolean;

  @Expose()
  readonly likedAt: Date;
}
