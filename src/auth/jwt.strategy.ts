import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { jwtConstants } from './constant';

import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)  {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      // passReqToCallback: true // for refresh token
    });
  }

  async validate(payload: CustomJwtPayload): Promise<any> {
    console.log('PAYLOAD_________________________', payload)
    const { sub } = payload;
    const user = await this.authService.validateUser(sub);

    console.log('USER_______________', user)
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
