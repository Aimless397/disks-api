import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@Exclude()
export class UpdateDiskDto {
  @Expose()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly genre?: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly subgenre?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly year?: number;

  @Expose()
  @IsOptional()
  @IsString()
  readonly band?: string;

  @Expose()
  @IsOptional()
  @IsPositive()
  readonly price?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly stock?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  readonly deleted?: boolean;
}
