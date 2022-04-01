import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ChangePasswordDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly securityQuestion: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly securityAnswer: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly confirmPassword: string;
}
