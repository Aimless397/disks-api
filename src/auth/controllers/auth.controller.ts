import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '../dtos/request/change-password.dto';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { EmailRequestDto } from '../dtos/request/email-request.dto';
import { ChangePasswordResponseDto } from '../dtos/response/change-password-response.dto';
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
  logout(@Query('token') token: string): Promise<boolean> {
    return this.authService.logout(token);
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, description: 'Signup' })
  async signup(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return await this.authService.create(createUserDto);
  }

  @Post('/password-recovery')
  @ApiOperation({ summary: 'Request to apply for a password recovery' })
  @ApiResponse({
    status: 200,
    description: 'Email sent with steps to recovery password',
  })
  async passwordRecovery(
    @Body() emailRequestDto: EmailRequestDto,
  ): Promise<void> {
    return await this.authService.passwordRecovery(emailRequestDto.email);
  }

  @Post('/:uuid/change-password')
  @ApiOperation({ summary: 'Request to change the password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed',
  })
  async passwordChange(
    @Param('uuid') uuid: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    return await this.authService.changePassword(uuid, changePasswordDto);
  }
}
