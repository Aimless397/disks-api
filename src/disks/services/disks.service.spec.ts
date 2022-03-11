import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Disk } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import * as faker from 'faker';
import { prisma } from '../../prisma';
import { DiskFactory } from '../../utils/factories/disk.factory';
import { CreateDiskDto } from '../dtos/request/create-disk.dto';
import { DisksService } from './disks.service';
import { NotFound } from 'http-errors';

describe('DisksService', () => {
  let disksService: DisksService;
  let disks: Disk[];
  let diskFactory: DiskFactory;

  beforeAll(() => {
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
      ],
      providers: [DisksService],
    }).compile();

    disksService = module.get<DisksService>(DisksService);
  });

  describe('findAll', () => {
    it('should return an array of disks', async () => {
      disks = await diskFactory.makeMany(5);

      const result = await disksService.getAll();

      expect(typeof result).toBe(typeof disks);
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

  describe('delete', () => {
    it('should throw a notFound exception', async () => {
      const fakeUuid = faker.datatype.uuid();

      await expect(disksService.delete(fakeUuid)).rejects.toThrowError(
        new NotFound(),
      );
    });

    it('should delete a disk', async () => {
      const uuid = disks[1].uuid;

      const result = await disksService.delete(uuid);

      expect(result).toBeTruthy();
    });
  });
});
