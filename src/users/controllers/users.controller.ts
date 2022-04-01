import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { GetUserDto } from '../dtos/response/get-user.dto';
import { Role } from '../enums/user-role.enum';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get profile from authenticated user' })
  @ApiResponse({ status: 200, description: 'Profile detail' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  getProfile(@Request() req): GetUserDto {
    const { uuid } = req.user;
    const userFound = this.usersService.findByUuid(uuid);

    return plainToInstance(GetUserDto, userFound);
  }
}
