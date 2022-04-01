import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// get disks filter request
export class GetDisksFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly genre?: string;

  @IsNumber()
  @IsNotEmpty()
  readonly page: number;

  @IsNumber()
  @IsNotEmpty()
  readonly limit: number;
}
