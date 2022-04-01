import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderDto {
  @Expose()
  readonly id?: number;

  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userId: number;

  @Expose()
  total: number;

  @Expose()
  paid: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
