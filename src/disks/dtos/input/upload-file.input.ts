import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ImageType } from '../../enums/image-type.enum';

@InputType()
export class UploadFileInput {
  @Field()
  @IsEnum(ImageType)
  type: ImageType;
}
