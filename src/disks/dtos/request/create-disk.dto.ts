import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

@Exclude()
export class CreateDiskDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly genre: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly subgenre: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly year: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly band: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  readonly disabled: boolean;
}
