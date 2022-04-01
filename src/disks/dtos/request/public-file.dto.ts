import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ImageType } from '../../enums/image-type.enum';

// upload files request
@Exclude()
export class PublicFileDto {
  @Expose()
  @IsEnum(ImageType)
  readonly type: ImageType;
}
