import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schemas/user.schem';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel('Auth') private readonly auth: Model<UserDocument>,
    private jwtService: JwtService
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

  async signIn(creds: { email: string; password: string; } ): Promise<{ access_token: string; } | null> {

    const resp = await this.auth.findOne({ email: creds.email }).exec();


    if (resp.password !== creds.password) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = resp;

    const payload = { sub: resp._id, username: resp.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
