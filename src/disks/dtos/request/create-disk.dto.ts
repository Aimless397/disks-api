import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
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
  @IsInt()
  @IsPositive()
  readonly year: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly band: string;

  @Expose()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly stock: number;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  readonly disabled: boolean;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  readonly deleted: boolean;
}
