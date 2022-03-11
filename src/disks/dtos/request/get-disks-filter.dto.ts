import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// get disks filter request
export class GetDisksFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;
}
