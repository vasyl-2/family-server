import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user-dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getUsers() {
    let users;

    try {
      users = await this.authService.getUsers();
    } catch (e) {

    }

    return users;
  }


  @HttpCode(HttpStatus.OK)
  @Post()
  async addUser(user: UserDTO): Promise<{ userId: string }> {

    let userId: string;
    try {

    } catch(err) {

    }

    return { userId };
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
