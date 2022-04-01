import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

@InputType()
export class UpdateDiskInput {
  @Field()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly genre?: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly subgenre?: string;

  @Field()
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly year?: number;

  @Field()
  @IsOptional()
  @IsString()
  readonly band?: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly cover?: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly mimetype?: string;

  @Field()
  @IsOptional()
  @IsPositive()
  readonly price?: number;

  @Field()
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly stock?: number;

  @Field()
  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;

  @Field()
  @IsOptional()
  @IsBoolean()
  readonly deleted?: boolean;
}
