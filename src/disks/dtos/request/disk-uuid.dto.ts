import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

@Exclude()
export class DiskUUidDto {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  readonly uuid: string;
}
