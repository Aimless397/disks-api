import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Disk, User } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import * as faker from 'faker';
import { NotFound } from 'http-errors';
import { FilesService } from '../../files/files.service';
import { clearDatabase, prisma } from '../../prisma';
import { DiskFactory } from '../../utils/factories/disk.factory';
import { UserFactory } from '../../utils/factories/user.factory';
import { CreateDiskDto } from '../dtos/request/create-disk.dto';
import { CreateReactionDto } from '../dtos/request/create-reaction.dto';
import { GetDisksFilterDto } from '../dtos/request/get-disks-filter.dto';
import { ImageType } from '../enums/image-type.enum';
import { DisksService } from './disks.service';

describe('DisksService', () => {
  let disksService: DisksService;
  let filesService: FilesService;
  let disks: Disk[];
  let disk: Disk;
  let diskFactory: DiskFactory;
  let userFactory: UserFactory;

  beforeAll(() => {
    userFactory = new UserFactory(prisma);
    diskFactory = new DiskFactory(prisma);
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '24h' },
        }),
        ConfigModule,
      ],
      providers: [DisksService, FilesService],
    }).compile();

    disksService = module.get<DisksService>(DisksService);
    /* filesService = module.get<FilesService>(FilesService); */
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('findAll', () => {
    it('should return an array of disks', async () => {
      disks = await diskFactory.makeMany(5);

      const result = await disksService.getAll({
        limit: 10,
        page: 0,
      } as GetDisksFilterDto);

      expect(typeof result).toBe(typeof disks);
    });
  });

  describe('diskDetail', () => {
    it('should return a disk detail', async () => {
      disk = await diskFactory.make();

      const result = await disksService.findOne(disk.uuid);

      expect(typeof result).toBe(typeof disk);
    });

    it(`should return a notFound exception if the disk doesn't exist`, async () => {
      const fakeUuid = faker.datatype.uuid();

      await expect(disksService.findOne(fakeUuid)).rejects.toThrowError(
        new NotFound(),
      );
    });

    it(`should return a notFound exception if the disk is deleted`, async () => {
      disk = await diskFactory.make({ deleted: true });

      await expect(disksService.findOne(disk.uuid)).rejects.toThrowError(
        new NotFound(),
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const data = plainToClass(CreateDiskDto, {
        name: faker.name.firstName(),
        genre: faker.music.genre(),
        subgenre: 'Alternative',
        year: faker.date.past(50).getFullYear(),
        band: faker.name.lastName(),
        cover: faker.image.imageUrl(),
        price: faker.datatype.number(60),
        stock: faker.datatype.number(10),
        disabled: false,
      });

      const result = await disksService.create(data);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('genre');
      expect(result).toHaveProperty('subgenre');
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('band');
      expect(result).toHaveProperty('cover');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('stock');
      expect(result).toHaveProperty('disabled');
    });
  });

  describe('update', () => {
    let disks = [];
    beforeAll(async () => {
      disks = await diskFactory.makeMany(2);
    });

    it('should throw a notFound exception', async () => {
      const fakeUuid = faker.datatype.uuid();

      await expect(
        disksService.update(fakeUuid, plainToInstance(CreateDiskDto, disks[1])),
      ).rejects.toThrowError(new NotFound());
    });

    it('should update a disk', async () => {
      const result = await disksService.update(
        disks[0].uuid,
        plainToInstance(CreateDiskDto, disks[1]),
      );

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('genre');
      expect(result).toHaveProperty('subgenre');
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('band');
      expect(result).toHaveProperty('cover');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('stock');
      expect(result).toHaveProperty('disabled');
    });
  });

  describe('disable', () => {
    let disk: Disk;
    beforeAll(async () => {
      disk = await diskFactory.make();
    });

    it('should disable a disk', async () => {
      const result = await disksService.disable(disk.uuid);

      expect(result.disabled).toBeTruthy();
    });

    it('should throw a notFound exception', async () => {
      const fakeUuid = faker.datatype.uuid();

      await expect(disksService.disable(fakeUuid)).rejects.toThrowError(
        new NotFound(),
      );
    });
  });

  describe('delete', () => {
    let disks = [];
    beforeAll(async () => {
      disks = await diskFactory.makeMany(2);
    });

    it('should throw a notFound exception', async () => {
      const fakeUuid = faker.datatype.uuid();

      await expect(disksService.delete(fakeUuid)).rejects.toThrowError(
        new NotFound(),
      );
    });

    it('should delete a disk', async () => {
      const uuid = disks[1].uuid;

      const result = await disksService.delete(uuid);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('genre');
      expect(result).toHaveProperty('subgenre');
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('band');
      expect(result).toHaveProperty('cover');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('stock');
      expect(result).toHaveProperty('disabled');
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('uploadPublicFile', () => {
    it(`should throw a NotFoundException if the disk doesn't exist`, async () => {
      await expect(
        disksService.uploadPublicFile(faker.datatype.uuid(), {
          type: ImageType.png,
        }),
      ).rejects.toThrowError(new NotFoundException());
    });
  });

  describe('like', () => {
    let user: User;
    let disk: Disk;

    beforeAll(async () => {
      user = await userFactory.make();
      disk = await diskFactory.make();
    });

    it('should like a disk', async () => {
      const createReactionDto: CreateReactionDto = {
        userUuid: user.uuid,
        diskUuid: disk.uuid,
      };

      const result = await disksService.like(createReactionDto);

      expect(result).toHaveProperty('uuid');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('diskId');
      expect(result).toHaveProperty('like');
      expect(result).toHaveProperty('likedAt');
      expect(result.like).toBeTruthy();
      expect(result.likedAt).toBeInstanceOf(Date);
    });
  });
});
