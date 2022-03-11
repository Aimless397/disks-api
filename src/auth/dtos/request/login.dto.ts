import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class LoginDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
