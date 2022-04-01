import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@Exclude()
export class SendEmailDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  readonly userUuid?: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly securityQuestion?: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly objective: string;

  /* @Expose()
  @IsOptional()
  readonly order?: Order; */
  @Expose()
  @IsOptional()
  @IsString()
  readonly diskImage?: string;
}
