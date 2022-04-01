import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class OrderUUidDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;
}
