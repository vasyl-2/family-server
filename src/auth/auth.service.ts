import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schemas/user.schem';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel('Auth') private readonly auth: Model<UserDocument>,
  ) {
  }

  async addUser(userDto) {
    try {
      const user = new this.auth(userDto);

      const result = await user.save();

      return result;
    } catch (e) {
      console.log('AUTH____ERROR______________');
    }
  }
}
