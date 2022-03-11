import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { TokenDto } from '../dtos/response/token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): Promise<TokenDto> {
    return this.authService.login(req.user);
  }

  @Post('/logout')
  logout(@Query('token') token: string) {
    return this.authService.logout(token);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return await this.authService.create(createUserDto);
  }
}
