import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginDto } from '../dtos/request/login.dto';
import { AuthService } from '../services/auth.service';
import { NotFound } from 'http-errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username, password): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    return user;
  }
}
