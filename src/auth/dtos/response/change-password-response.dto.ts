import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChangePasswordResponseDto {
  @Expose()
  readonly status: string;

  @Expose()
  readonly message: string;
}
