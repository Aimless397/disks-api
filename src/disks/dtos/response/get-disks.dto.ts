import { Exclude, Expose } from 'class-transformer';

// get disks response
@Exclude()
export class DiskDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly genre: string;

  @Expose()
  readonly subgenre: string;

  @Expose()
  readonly year: number;

  @Expose()
  readonly band: string;

  @Expose()
  readonly cover: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly disabled: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
