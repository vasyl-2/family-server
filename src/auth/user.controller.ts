import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { UserServiceInterface } from './models/user.service.interface';
import { UserDTO } from './dto/user-dto';
import { UserService } from './user.service';
import { User } from './schemas/user.schem';

@Controller('users')
export class UserController implements UserServiceInterface {

  constructor(
    private userService: UserService
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async createUser(@Body() userDto: UserDTO): Promise<UserDTO> {
    let user: UserDTO;

    try {
      user = await this.userService.createUser(userDto);
      console.log('USER_CREATED_____', user)
    } catch(e) {

    }

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteUser(@Body() userId: { id: string }): Promise<string> {
    let removed: string;

    try {
      removed = await this.userService.deleteUser(userId);
    } catch(e) {
      console.error(`deleting error ${JSON.stringify(e)}`);
    }
    return removed;
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async editUser(@Body() userDto: Partial<UserDTO>): Promise<Partial<UserDTO>> {
    console.log('EDIT_USER___!!!!', userDto);
    let user: Partial<UserDTO>;

    try {
      user = await this.userService.editUser(userDto);
    } catch(e) {
      console.log('EDIT___USER___ERROR__', JSON.stringify(e));
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getUsers(): Promise<UserDTO[]> {
    let users: UserDTO[];

    try {
      users = await this.userService.getUsers();
    } catch(e) {
      console.error('GET___USERS___ERROR', JSON.stringify(e));
    }

    return users;
  }
}
