import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Token, User } from '@prisma/client';
import { compareSync, hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { UnprocessableEntity } from 'http-errors';
import { sign, verify } from 'jsonwebtoken';
import { SendgridService } from '../../email/services/sendgrid.service';
import { prisma } from '../../prisma';
import { UsersService } from '../../users/services/users.service';
import { ChangePasswordDto } from '../dtos/request/change-password.dto';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { ChangePasswordResponseDto } from '../dtos/response/change-password-response.dto';
import { TokenDto } from '../dtos/response/token.dto';
import { ValidateUserResponse } from '../dtos/response/validate-user-response';

@Injectable()
export class AuthService {
  static usersService: UsersService;
  constructor(
    private readonly usersService: UsersService,
    private readonly sendgridService: SendgridService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidateUserResponse> {
    const user = await this.usersService.findByUsername(username);
    const isValid = compareSync(password, user.password);

    if (user && isValid) {
      return plainToInstance(ValidateUserResponse, user);
    }

    throw new UnauthorizedException();
  }

  async login(user: User): Promise<TokenDto> {
    const token = await this.createToken(user.id);
    const accessToken = this.generateAccessToken(token.jti);

    return accessToken;
  }

  async logout(accessToken?: string): Promise<boolean> {
    if (!accessToken) return false;

    try {
      const { sub } = verify(accessToken, process.env.JWT_SECRET_KEY as string);

      await prisma.token.delete({ where: { jti: sub as string } });

      return true;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async create({ password, ...input }: CreateUserDto): Promise<TokenDto> {
    const userFound = await prisma.user.findUnique({
      where: { username: input.username },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (userFound) {
      throw new UnprocessableEntity('Email already taken');
    }

    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashSync(password, 10),
      },
    });

    const token = await this.createToken(user.id);
    const accessToken = this.generateAccessToken(token.jti);

    return accessToken;
  }

  async createToken(userId: number): Promise<Token> {
    try {
      const token = await prisma.token.create({
        data: {
          userId,
        },
      });

      return token;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  generateAccessToken(sub: string): TokenDto {
    const now = new Date().getTime();
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(process.env.JWT_EXPIRATION_TIME as string, 10),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);

    const accessToken = sign(
      {
        sub,
        iat,
        exp,
      },
      process.env.JWT_SECRET_KEY as string,
    );

    return {
      accessToken,
    };
  }

  async passwordRecovery(email: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      return await this.sendgridService.sendEmail({
        email: user.email,
        userUuid: user.uuid,
        objective: 'recover',
        securityQuestion: user.securityQuestion,
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async changePassword(
    uuid: string,
    {
      securityQuestion,
      securityAnswer,
      newPassword,
      confirmPassword,
    }: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    try {
      if (newPassword !== confirmPassword) {
        return plainToInstance(ChangePasswordResponseDto, {
          status: '400',
          message: `Passwords doesn't match`,
        });
      }

      const user = await prisma.user.findUnique({ where: { uuid } });

      if (
        user.securityQuestion !== securityQuestion ||
        user.securityAnswer.toUpperCase() !== securityAnswer.toUpperCase()
      ) {
        return plainToInstance(ChangePasswordResponseDto, {
          status: '400',
          message: `Security answer doesn't match with security question`,
        });
      }

      await prisma.user.update({
        data: {
          password: hashSync(newPassword, 10),
        },
        where: {
          uuid,
        },
      });

      await this.sendgridService.sendEmail({
        email: user.email,
        objective: 'success',
      });

      return plainToInstance(ChangePasswordResponseDto, {
        status: '200',
        message: 'Password changed successfully',
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
