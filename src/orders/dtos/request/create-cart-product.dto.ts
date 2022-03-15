import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

@Exclude()
export class CreateCartProductDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  diskId: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  selectionPrice: number;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  state: boolean;
}
