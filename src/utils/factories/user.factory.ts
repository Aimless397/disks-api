import { Prisma, PrismaClient, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import * as faker from 'faker';
import { Role } from '../../users/enums/user-role.enum';
import { AbstractFactory } from './abstract.factory';

type UserInput = Partial<Prisma.UserCreateInput>;

export class UserFactory extends AbstractFactory<User> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: UserInput = {}): Promise<User> {
    return this.prismaClient.user.create({
      data: {
        ...input,
        role: input.role ?? Role.CLIENT,
        email: input.email ?? faker.internet.email(),
        username: input.username ?? faker.internet.userName(),
        password: hashSync(input.password ?? faker.internet.password(), 10),
        firstName: input.firstName ?? faker.name.firstName(),
        lastName: input.lastName ?? faker.name.lastName(),
        securityQuestion: input.securityQuestion ?? '',
        securityAnswer: input.securityAnswer ?? '',
      },
    });
  }
  async makeMany(factorial: number, input: UserInput = {}): Promise<User[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
