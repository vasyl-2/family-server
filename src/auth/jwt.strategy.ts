import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)  {
  constructor(
    private authService: AuthService
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      // passReqToCallback: true
    });
  }

  async validate(payload): Promise<any> {
    const { sub } = payload;
    const user = await this.authService.validateUser(sub);

    console.log('USER_______________', user)
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;

  }
}
