import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@Exclude()
export class CreateCartProductDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  readonly orderId?: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly diskUuid: string;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly amount: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  readonly state?: boolean;
}
