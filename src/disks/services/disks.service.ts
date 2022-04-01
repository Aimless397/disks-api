import { Injectable, NotFoundException } from '@nestjs/common';
import { GetDisksFilterDto } from '../dtos/request/get-disks-filter.dto';
import { prisma } from '../../prisma';
import { plainToInstance } from 'class-transformer';
import { DiskDto } from '../dtos/response/get-disks.dto';
import { CreateDiskDto } from '../dtos/request/create-disk.dto';
import { PublicFileDto } from '../dtos/request/public-file.dto';
import { FilesService } from '../../files/files.service';
import { ImageType } from '../enums/image-type.enum';
import { CreateReactionDto } from '../dtos/request/create-reaction.dto';
import { UserReactionDto } from '../dtos/response/user-reaction.dto';
import { UpdateDiskDto } from '../dtos/request/update-disk.dto';

@Injectable()
export class DisksService {
  constructor(private readonly filesService: FilesService) {}

  async getAll(filterDto?: GetDisksFilterDto): Promise<DiskDto[]> {
    const { limit = 10, page = 0, genre }: GetDisksFilterDto = filterDto;
    const offset = page * limit;
    const disks = await prisma.disk.findMany({
      where: { genre, disabled: false, deleted: false },
      skip: offset,
      take: limit,
    });

    disks.forEach(async (disk) => {
      disk.cover = disk.cover
        ? await this.filesService.generatePresignedUrl(
            disk.uuid,
            disk.mimetype as ImageType,
          )
        : null;

      await prisma.disk.update({
        where: { uuid: disk.uuid },
        data: { cover: disk.cover },
      });
    });

    return plainToInstance(DiskDto, disks);
  }

  async findOne(uuid: string): Promise<DiskDto> {
    try {
      let disk = await prisma.disk.findUnique({
        where: { uuid },
        rejectOnNotFound: false,
      });

      if (disk.deleted) {
        throw new NotFoundException();
      }

      disk.cover = await this.filesService.generatePresignedUrl(
        disk.uuid,
        disk.mimetype as ImageType,
      );

      disk = await prisma.disk.update({
        where: { uuid },
        data: { cover: disk.cover },
      });

      return plainToInstance(DiskDto, disk);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async create(input: CreateDiskDto): Promise<DiskDto> {
    const disk = await prisma.disk.create({
      data: {
        ...input,
      },
    });

    return plainToInstance(DiskDto, disk);
  }

  async update(uuid: string, diskDto: UpdateDiskDto): Promise<DiskDto> {
    try {
      const disk = await prisma.disk.update({
        data: {
          ...diskDto,
        },
        where: {
          uuid,
        },
      });

      return plainToInstance(DiskDto, disk);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async disable(uuid: string) {
    try {
      const disk = await prisma.disk.update({
        data: {
          disabled: true,
        },
        where: {
          uuid,
        },
      });

      return plainToInstance(DiskDto, disk);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async delete(uuid: string): Promise<DiskDto> {
    try {
      const deleted = await prisma.disk.update({
        data: { deleted: true },
        where: { uuid },
      });

      return plainToInstance(DiskDto, deleted);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async uploadPublicFile(
    uuid: string,
    publicFileDto: PublicFileDto,
  ): Promise<DiskDto> {
    try {
      const disk = await prisma.disk.findUnique({
        where: { uuid },
        rejectOnNotFound: false,
      });

      if (!disk) {
        throw new NotFoundException();
      }

      // signed url to upload file
      const newImage = await this.filesService.uploadPublicFile(
        disk.uuid,
        publicFileDto.type,
      );

      const diskUpdated = await prisma.disk.update({
        where: { uuid },
        data: {
          cover: newImage,
          mimetype: publicFileDto.type,
        },
      });

      return plainToInstance(DiskDto, diskUpdated);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async like(
    { userUuid, diskUuid }: CreateReactionDto /* userUuid: string,
    diskUuid: string, */,
  ): Promise<UserReactionDto> {
    try {
      const user = await prisma.user.findUnique({ where: { uuid: userUuid } });
      const disk = await prisma.disk.findUnique({
        where: { uuid: diskUuid },
      });

      const reactionsFound = await prisma.userReaction.findMany({
        where: {
          userId: user.id,
          diskId: disk.id,
        },
      });

      if (reactionsFound.length) {
        return plainToInstance(UserReactionDto, reactionsFound[0]);
      }

      const reactionCreated = await prisma.userReaction.create({
        data: {
          userId: user.id,
          diskId: disk.id,
          like: true,
          likedAt: new Date(),
        },
      });

      return plainToInstance(UserReactionDto, reactionCreated);
    } catch (error) {
      throw new Error(error);
    }
  }

  // UNUSED
  /* async getPublicFile(uuid: string): Promise<string> {
    try {
      const disk = await prisma.disk.findUnique({ where: { uuid } });
      const imageUrl = await this.filesService.generatePresignedUrl(
        uuid,
        disk.mimetype as ImageType,
      );

      return imageUrl;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  } */
}
