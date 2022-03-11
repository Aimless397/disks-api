import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { prisma } from '../../prisma';
import { UnprocessableEntity, NotFound } from 'http-errors';
import { UsersService } from '../../users/services/users.service';
import { ValidateUserResponse } from '../dtos/response/validate-user-response';
import { compareSync, hashSync } from 'bcryptjs';
import { Token, User } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { TokenDto } from '../dtos/response/token.dto';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dtos/request/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  static usersService: UsersService;
  constructor(
    private usersService: UsersService,
    private jwtService?: JwtService,
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
      console.error(error);
    }

    return false;
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
}
