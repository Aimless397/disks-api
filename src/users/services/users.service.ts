import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { prisma } from '../../prisma';

@Injectable()
export class UsersService {
  async findByUuid(uuid: string): Promise<User> {
    const userFound = await prisma.user.findUnique({
      where: { uuid },
    });

    return userFound;
  }

  async findByUsername(username: string): Promise<User> {
    const userFound = await prisma.user.findUnique({
      where: { username },
    });

    return userFound;
  }
}
