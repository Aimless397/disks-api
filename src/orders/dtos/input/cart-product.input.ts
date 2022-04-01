import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  IsPositive,
} from 'class-validator';

@InputType()
export class CartProductInput {
  @Field()
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  orderId?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  diskUuid: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amount: number;

  @Field()
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  state?: boolean;
}
