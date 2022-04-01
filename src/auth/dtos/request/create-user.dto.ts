import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// create user body
@Exclude()
export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly role: string;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  readonly username: string;

  @Expose()
  @IsString()
  @Length(5, 20)
  readonly password: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly securityQuestion: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly securityAnswer: string;
}
