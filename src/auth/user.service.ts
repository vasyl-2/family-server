import { UserServiceInterface } from './models/user.service.interface';
import { UserDTO } from './dto/user-dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schem';

@Injectable()
export class UserService implements UserServiceInterface {

  constructor(
    @InjectModel('Auth') private readonly user: Model<UserDocument>
  ) {

  }

  async createUser(user: UserDTO): Promise<UserDTO> {
    console.log('USER_WILLBE__ADDED___', user);
    let newUser;

    try {
      const newUserToAdd = new this.user(user);
      console.log('TO__ADD___', newUserToAdd)
      newUser = await newUserToAdd.save();
      console.log('NEW___USER____1', newUser)
      // const galleryE = new this.gallery(addPhotoDto);
      // const result = await galleryE.save()
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
      throw new Error('no id')
    }
    let resp: Partial<UserDTO>;

    let updateBody: any = {};

    if (role) {
      updateBody.$set = { role };
    }

    if (email) {
      updateBody.$rename = { email };
    }

    console.log('UPDATED____BODY____', updateBody)
    try {
      resp = await this.user.findByIdAndUpdate(_id, updateBody,{ new: true });
    } catch(err) {
      console.error('UPDATE_ERROR___', err);
    }
    console.log('RESP_EDITED___USER_____', resp)
    return resp;
  }

  async getUsers(): Promise<UserDTO[]> {
    let users;

    try {
      users = await this.user.find().exec();
    } catch (e) {

    }

    console.log('FOUND USERS__________', users);
    return users;
  }
}
