import { NotFoundException } from '@nestjs/common';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { NotFound, UnprocessableEntity } from 'http-errors';
import { SendgridService } from '../../email/services/sendgrid.service';
import { clearDatabase, prisma } from '../../prisma';
import { Role } from '../../users/enums/user-role.enum';
import { UsersService } from '../../users/services/users.service';
import { UserFactory } from '../../utils/factories/user.factory';
import { ChangePasswordDto } from '../dtos/request/change-password.dto';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let userFactory: UserFactory;
  let authService: AuthService;
  let sendgridService: SendgridService;
  let user: User;

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
        ConfigModule,
      ],
      providers: [AuthService, UsersService, SendgridService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    sendgridService = module.get<SendgridService>(SendgridService);
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
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
      const fakeToken = faker.lorem.word();

      await expect(authService.logout(fakeToken)).rejects.toThrowError(
        new NotFound(),
      );
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

  describe('passwordRecovery', () => {
    it('should send an email to the user who request the password recovery', async () => {
      const user = await userFactory.make();
      const spySendEmail = jest.spyOn(sendgridService, 'sendEmail');

      const result = await authService.passwordRecovery(user.email);

      expect(result).toBeUndefined();
      expect(spySendEmail).toBeCalledTimes(1);
    });

    it(`should throw a notFound exception if the user's email doesn't exist`, async () => {
      await expect(
        authService.passwordRecovery(faker.internet.email()),
      ).rejects.toThrowError(new NotFoundException());
    });
  });

  describe('changePassword', () => {
    let user: User;
    let password: string;
    let changePasswordDto: ChangePasswordDto;

    beforeEach(async () => {
      user = await userFactory.make();
      password = faker.internet.password();
      changePasswordDto = {
        securityQuestion: user.securityQuestion,
        securityAnswer: user.securityAnswer,
        newPassword: password,
        confirmPassword: password,
      } as ChangePasswordDto;
    });

    it('should reset password and send email', async () => {
      const spySendEmail = jest.spyOn(sendgridService, 'sendEmail');
      const result = await authService.changePassword(
        user.uuid,
        changePasswordDto,
      );

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result.status).toBe('200');
      expect(result.message).toBe(`Password changed successfully`);
      expect(spySendEmail).toBeCalledTimes(1);
    });

    it(`should return status 400 and a message if the passwords doesn't match`, async () => {
      const result = await authService.changePassword(user.uuid, {
        securityQuestion: changePasswordDto.securityQuestion,
        securityAnswer: changePasswordDto.securityAnswer,
        newPassword: changePasswordDto.newPassword,
        confirmPassword: faker.internet.password(),
      });

      expect(result.status).toBe('400');
      expect(result.message).toBe(`Passwords doesn't match`);
    });

    it(`should return status 400 and a message if the security question doesn't match`, async () => {
      const result = await authService.changePassword(user.uuid, {
        securityQuestion: changePasswordDto.securityQuestion,
        securityAnswer: `${changePasswordDto.securityAnswer} answer`,
        newPassword: changePasswordDto.newPassword,
        confirmPassword: changePasswordDto.confirmPassword,
      });

      expect(result.status).toBe('400');
      expect(result.message).toBe(
        `Security answer doesn't match with security question`,
      );
    });
  });
});
