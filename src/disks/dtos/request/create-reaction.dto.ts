import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateReactionDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly userUuid: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly diskUuid: string;
}
