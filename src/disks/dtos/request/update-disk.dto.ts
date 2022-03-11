import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateDiskDto {
  @Expose()
  @IsOptional()
  @IsString()
  readonly name: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly genre: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly subgenre: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  readonly year: number;

  @Expose()
  @IsOptional()
  @IsString()
  readonly band: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  readonly stock: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  readonly disabled: boolean;
}
