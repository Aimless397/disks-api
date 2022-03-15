import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { TokenDto } from '../dtos/response/token.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login a user with username and password' })
  @ApiResponse({ status: 200, description: 'Login' })
  @UseGuards(LocalAuthGuard)
  login(@Request() req): Promise<TokenDto> {
    return this.authService.login(req.user);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout a user from API' })
  @ApiResponse({ status: 200, description: 'Logout' })
  logout(@Query('token') token: string) {
    return this.authService.logout(token);
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, description: 'Signup' })
  async signup(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return await this.authService.create(createUserDto);
  }
}
