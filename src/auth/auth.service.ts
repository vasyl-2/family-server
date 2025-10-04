import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserDocument } from './schemas/user.schem';
import { UserDTO } from './dto/user-dto';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission-dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel('Auth') private readonly auth: Model<UserDocument>,
    private jwtService: JwtService,
    private permissionService: PermissionsService
  ) {
  }

  async getUsers() {
    let users;

    try {
      users = await this.auth.find().exec();
    } catch (e) {
      console.error('ERR_GET_USERS__', JSON.stringify(e));
    }

    return users;
  }

  async addUser(userDto: UserDTO) {
    try {
      const user = new this.auth(userDto);

      const result = await user.save();

      return result;
    } catch (e) {
      console.error('ERR_ADD__USER___', JSON.stringify(e));
    }
  }

  async signIn(creds: {
    email: string;
    password: string;
  }): Promise<{ access_token: string } | null> {
    const resp = await this.auth.findOne({ email: creds.email }).exec();
    
    if (!resp) {
      console.error('Incorrect user!', creds.email);
    }

    const isPasswordCorrect = await bcrypt.compare(
      creds.password,
      resp.password
    );
    
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const roleIds = resp.role.map((r) => r.toString());

    let permissions: PermissionDto[];

    try {
      permissions =
        await this.permissionService.getPermissionsByRolesIds(roleIds);
    } catch (err) {
      console.error('ROLES_ERROR_______', JSON.stringify(err));
    }

    const permissionIds = permissions.map((p) => p._id.toString());

    const payload = {
      sub: resp._id,
      email: resp.email,
      role: resp.role,
      permissions: permissionIds,
    };

    let access_token;

    try {
      access_token = await this.jwtService.signAsync(payload);
    } catch (e) {
      console.error('ERR_ACCESS_TOKEN__SIGNING__', JSON.stringify(e));
    }

    return { access_token };
  }

  async validateUser(id: string): Promise<{ }> {
    const resp = await this.auth.findById(id).exec();

    if (!resp) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = resp;
    return rest;
  }
}
