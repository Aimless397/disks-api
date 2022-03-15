import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CartProductDto {
  @Expose()
  readonly orderId: number;

  @Expose()
  readonly diskId: number;

  @Expose()
  readonly amount: number;

  @Expose()
  readonly selectionPrice: number;

  @Expose()
  readonly state: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
