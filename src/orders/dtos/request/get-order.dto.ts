import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class GetOrderDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly orderUuid: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly userUuid: string;
}
