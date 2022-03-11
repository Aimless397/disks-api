import { Exclude, Expose } from 'class-transformer';

// get disks response
@Exclude()
export class ValidateUserResponse {
  @Expose()
  readonly id: number;

  @Expose()
  readonly uuid: string;

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

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
