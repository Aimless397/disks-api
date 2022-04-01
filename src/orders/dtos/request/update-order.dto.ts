import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class UpdateOrderDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly uuid: string; // orderId
}
