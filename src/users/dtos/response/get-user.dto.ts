import { Exclude, Expose } from 'class-transformer';

// get user response
@Exclude()
export class GetUserDto {
  @Expose()
  readonly role: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly username: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly securityQuestion: string;

  @Expose()
  readonly securityAnswer: string;
}
