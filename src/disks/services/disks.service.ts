import { Injectable, NotFoundException } from '@nestjs/common';
import { GetDisksFilterDto } from '../dtos/request/get-disks-filter.dto';
import { prisma } from '../../prisma';
import { plainToInstance } from 'class-transformer';
import { DiskDto } from '../dtos/response/get-disks.dto';
import { CreateDiskDto } from '../dtos/request/create-disk.dto';
import { NotFound } from 'http-errors';

@Injectable()
export class DisksService {
  async getAll(filterDto?: GetDisksFilterDto): Promise<DiskDto[]> {
    const disks = await prisma.disk.findMany({
      where: { genre: filterDto?.category, disabled: false },
    });

    return plainToInstance(DiskDto, disks);
  }

  async create({ ...input }: CreateDiskDto): Promise<DiskDto> {
    const disk = await prisma.disk.create({
      data: {
        ...input,
      },
    });

    return plainToInstance(DiskDto, disk);
  }

  async update(uuid: string, diskDto: CreateDiskDto): Promise<DiskDto> {
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

  async delete(uuid: string): Promise<boolean> {
    try {
      const deleted = await prisma.disk.delete({ where: { uuid } });

      if (deleted) return true;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
