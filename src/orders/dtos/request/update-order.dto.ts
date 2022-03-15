import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

@Exclude()
export class UpdateOrderDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id: number; // orderId

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  paid: boolean;
}
