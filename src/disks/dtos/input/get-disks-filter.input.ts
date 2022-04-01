import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class GetDisksFilterInput {
  @Field()
  @IsOptional()
  @IsString()
  genre?: string;

  @Field()
  @IsNumber()
  page: number;

  @Field()
  @IsNumber()
  limit: number;
}
