import { Inject, Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, LoggerService } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user-dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
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
    let user;

    this.logger.log('creds__________', creds);

    try {
      user = await this.authService.signIn({ email: creds.email, password: creds.password });
    } catch (e) {
      this.logger.error('incorrect password / user', e);
      throw e;
    }

    return user;
  }
}
