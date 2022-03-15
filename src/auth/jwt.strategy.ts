import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { prisma } from '../prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    // return the user uuid from token table using payload.sub as token.jti
    const token = await prisma.token.findUnique({
      where: {
        jti: payload.sub,
      },
      select: {
        user: { select: { uuid: true, role: true } },
      },
      rejectOnNotFound: false,
    });
    const { user } = token;

    return user;
  }
}
