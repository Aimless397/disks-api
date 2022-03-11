import { Test } from '@nestjs/testing';
import { prisma } from '../../prisma';
import { UserFactory } from '../../utils/factories/user.factory';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

describe('UsersService', () => {
  let userFactory: UserFactory;
  let usersService: UsersService;

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
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should return a user found by UUID', async () => {
    const user = await userFactory.make();

    const result = await usersService.findByUuid(user.uuid);

    expect(result).toHaveProperty('uuid');
    expect(result).toHaveProperty('uuid');
    expect(result).toHaveProperty('role');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('username');
    expect(result).toHaveProperty('password');
    expect(result).toHaveProperty('firstName');
    expect(result).toHaveProperty('lastName');
    expect(result).toHaveProperty('securityQuestion');
    expect(result).toHaveProperty('securityAnswer');
  });

  it('should return a user found by username', async () => {
    const user = await userFactory.make();

    const result = await usersService.findByUsername(user.username);

    expect(result).toHaveProperty('uuid');
    expect(result).toHaveProperty('uuid');
    expect(result).toHaveProperty('role');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('username');
    expect(result).toHaveProperty('password');
    expect(result).toHaveProperty('firstName');
    expect(result).toHaveProperty('lastName');
    expect(result).toHaveProperty('securityQuestion');
    expect(result).toHaveProperty('securityAnswer');
  });
});
