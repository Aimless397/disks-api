import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class DiskUUidDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;
}
