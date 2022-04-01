import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

@InputType()
export class CreateDiskInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  readonly genre: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  readonly subgenre: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly year: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  readonly band: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly cover?: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly mimetype?: string;

  @Field()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly stock: number;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  readonly disabled: boolean;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  readonly deleted: boolean;
}
