import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { GetUserDto } from '../dtos/response/get-user.dto';
import { Role } from '../enums/user-role.enum';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get profile from authenticated user' })
  @ApiResponse({ status: 200, description: 'Profile detail' })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CLIENT)
  getProfile(@Request() req): GetUserDto {
    const { uuid } = req.user;
    const userFound = this.usersService.findByUuid(uuid);

    return plainToInstance(GetUserDto, userFound);
  }
}
