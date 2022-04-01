import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ImageType } from '../disks/enums/image-type.enum';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadPublicFile(key: string, format: ImageType): Promise<string> {
    const s3 = new S3();

    return s3.getSignedUrlPromise('putObject', {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: `${key}.${format}`,
      Expires: parseInt(this.configService.get('AWS_EXPIRE_TIME'), 10),
      ContentType: `image/${format}`,
    });
  }

  public async generatePresignedUrl(
    key: string,
    format: ImageType,
  ): Promise<string> {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: `${key}.${format}`,
      Expires: parseInt(this.configService.get('AWS_EXPIRE_TIME'), 10),
    });
  }
}
