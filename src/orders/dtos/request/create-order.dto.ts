import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@Exclude()
export class CreateOrderDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly uuid: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  readonly total?: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  readonly paid?: boolean;
}
