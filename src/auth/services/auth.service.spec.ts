import { User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { prisma } from '../../prisma';
import * as faker from 'faker';
import { UsersService } from '../../users/services/users.service';
import { UserFactory } from '../../utils/factories/user.factory';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { AuthService } from './auth.service';
import { Role } from '../../users/enums/user-role.enum';
import { hashSync } from 'bcryptjs';
import { UnprocessableEntity } from 'http-errors';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';

describe('AuthService', () => {
  let userFactory: UserFactory;
  let authService: AuthService;

  beforeAll(() => {
    userFactory = new UserFactory(prisma);
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
      providers: [AuthService, UsersService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should throw an error if the user already exists', async () => {
      const user = await userFactory.make();

      await expect(authService.create(user)).rejects.toThrowError(
        new UnprocessableEntity('Email already taken'),
      );
    });

    it('should create an user and return his token', async () => {
      const spyCreateToken = jest.spyOn(authService, 'createToken');
      const spyGenerateAccessToken = jest.spyOn(
        authService,
        'generateAccessToken',
      );
      const data = plainToClass(CreateUserDto, {
        role: Role.CLIENT,
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashSync(faker.internet.password(), 10),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        securityQuestion: '',
        securityAnswer: '',
      });

      const result = await authService.create(data);

      expect(result).toHaveProperty('accessToken');
      expect(spyCreateToken).toHaveBeenCalledTimes(1);
      expect(spyGenerateAccessToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should throw an error if the user does not exist', async () => {
      const data = plainToClass(CreateUserDto, {
        id: faker.datatype.number(1500),
        username: faker.internet.userName(),
        password: faker.internet.password(6),
      });

      await expect(authService.login(data as User)).rejects.toThrowError(
        new InternalServerErrorException(),
      );
    });
  });

  describe('logout', () => {
    it('should return false if the token was not provided', async () => {
      const result = await authService.logout();

      expect(result).toBeFalsy();
    });

    it('should throw an error if the token was invalid', async () => {
      const spyConsole = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());

      await authService.logout(faker.lorem.word());

      expect(spyConsole).toBeCalledWith(new JsonWebTokenError('jwt malformed'));
    });
  });

  describe('generateAccessToken', () => {
    it('should return an object with accessToken property', async () => {
      const uuid = faker.datatype.uuid();

      const result = authService.generateAccessToken(uuid);

      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('validateUser', () => {
    it('should throw new unauthorizedException if username is invalid', async () => {
      const username = faker.internet.userName();
      const password = hashSync(faker.internet.password(), 10);

      await expect(
        authService.validateUser(username, password),
      ).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });
  });
});
