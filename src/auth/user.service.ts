import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDocument } from './schemas/user.schem';
import { UserServiceInterface } from './models/user.service.interface';
import { UserDTO } from './dto/user-dto';

@Injectable()
export class UserService implements UserServiceInterface {

  constructor(
    @InjectModel('Auth') private readonly user: Model<UserDocument>
  ) {

  }

  async createUser(user: UserDTO): Promise<UserDTO> {
    let newUser;

    try {
      const newUserToAdd = new this.user(user);
      newUser = await newUserToAdd.save();
    } catch (e) {

    }
    return newUser;
  }

  async deleteUser( userId: { id: string }): Promise<string> {
    return Promise.resolve('');
  }

  async editUser(user: Partial<UserDTO>): Promise<Partial<UserDTO>> {
    const { _id, role = undefined, email = undefined } = user;

    if (!_id) {
      throw new Error('No user id in DB!');
    }
    let resp: Partial<UserDTO>;

    let updateBody: any = {};

    if (role) {
      updateBody.$set = { role };
    }

    if (email) {
      updateBody.$rename = { email };
    }

    try {
      resp = await this.user.findByIdAndUpdate(_id, updateBody,{ new: true });
    } catch(err) {
      console.error('UPDATE_ERROR___', err);
    }

    return resp;
  }

  async getUsers(): Promise<UserDTO[]> {
    let users;

    try {
      users = await this.user.find().exec();
    } catch (e) {
      console.error('GET_USERS_ERROR____', JSON.stringify(e));
    }

    return users;
  }
}
