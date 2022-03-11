import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { User } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { GetUserDto } from '../dtos/response/get-user.dto';
import { Role } from '../enums/user-role.enum';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.CLIENT)
  @Get('profile')
  getProfile(@Request() req): GetUserDto {
    const { uuid } = req.user;
    const userFound = this.usersService.findByUuid(uuid);

    return plainToInstance(GetUserDto, userFound);
  }
}