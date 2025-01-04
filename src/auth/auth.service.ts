import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { UserDocument } from './schemas/user.schem';
import { UserDTO } from './dto/user-dto';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission-dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel('Auth') private readonly auth: Model<UserDocument>,
    private jwtService: JwtService, private permissionService: PermissionsService
  ) {
  }

  async getUsers() {
    let users;

    try {
      users = await this.auth.find().exec();
    } catch (e) {

    }

    console.log('FOUND USERS__________', users);
    return users;
  }



  async addUser(userDto: UserDTO) {
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

    console.log('RESPPPPP_________________', resp)

    const roleIds = resp.role.map((r) => r.toString());

    let permissions: PermissionDto[];
    try {
      permissions = await this.permissionService.getPermissionsByRolesIds(roleIds);
      console.log('PERMS_________', permissions);
    } catch (err) {
      console.error('ROLES_ERROR_______', JSON.stringify(err));
    }

    const permissionIds = permissions.map(p => p._id.toString());


    const payload = { sub: resp._id, email: resp.email, role: resp.role, permissions: permissionIds };
    let access_token;
    try {
      access_token = await this.jwtService.signAsync(payload);
      console.log('ACCES_TOKEN_TO_SEBN', access_token)
    } catch (e) {
      console.error('ACCESS_TOKEN__ERRPAYLOAD_________________________OR____', JSON.stringify(e));
    }

    return { access_token };
  }

  async validateUser(id :string): Promise<{ }> {
    const resp = await this.auth.findById(id).exec();

    if (!resp) {
      throw new UnauthorizedException();
    }

    const { password, ...rest } = resp;
    return rest;
  }
}
