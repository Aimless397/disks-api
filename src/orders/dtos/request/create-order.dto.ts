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
  uuid: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  total?: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  paid?: boolean;
}
