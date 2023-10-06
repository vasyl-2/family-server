import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {
  }

  @Post()
  async addUser() {

  }

  @HttpCode(HttpStatus.OK)
  @Post('authenticate')
  async authenticate(
    @Body() creds: { email: string; password: string; }
  ) {

    try {
      const user = await this.authService.signIn({ email: creds.email, password: creds.password });

      console.log('USER_FOUND_____', user);

      return user;
    } catch (e) {
      console.error('НЕМОЖЛИВО ОТРИМАТИ КОРИСТУВАЧА', e);
    }
  }
}
