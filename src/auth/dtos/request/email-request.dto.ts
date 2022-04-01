import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

@Exclude()
export class EmailRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
