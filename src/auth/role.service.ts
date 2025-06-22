import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RoleServiceInterface } from './models/role.service.interface';
import { Role, RoleDocument } from './schemas/role.schema';
import { RoleDto } from './dto/role-dto';

@Injectable()
export class RoleService implements RoleServiceInterface {

  constructor(
    @InjectModel(Role.name) private readonly role: Model<RoleDocument>
  ) {
  }

  async createRole(role: RoleDto): Promise<RoleDto> {
    console.log('NEW___ROLE_____', role);
    let createdRole;
    let createdRoleTOAdd;
    try {
      createdRoleTOAdd = new this.role(role);
    } catch(e) {
      console.error('CREATE_ERROR___1', JSON.stringify(e));
    }

    try {
      createdRole = await createdRoleTOAdd.save();
    } catch (e) {
      console.error('CREATE___ROLE____2', JSON.stringify(e));
    }

    console.log('RESULT_______', createdRole);
    return createdRole;
  }

  async deleteRole(): Promise<string> {
    return Promise.resolve('');
  }

  async editRole(role: RoleDto): Promise<RoleDto> {
    return Promise.resolve(undefined);
  }

  async getRoles(): Promise<RoleDto[]> {
    // let roles: RoleDto[];
    let roles: any;

    try {
      roles = await this.role.find().exec();
      console.log('ROLES____', roles);
    } catch(e) {

    }
    return roles;
  }

  async getRoleById(roleId: string): Promise<RoleDto> {
    // let roles: RoleDto[];
    let role: any;

    try {
      role = await this.role.findById(roleId).exec();
      console.log('ROLES____', role);
    } catch(e) {
      console.error(`during get role by id: ${JSON.stringify(e)}`);
    }
    return role;
  }

  async getRolesByIds(ids: string[]): Promise<any[]> {
    return this.role.find({
      _id: { $in: ids },
    }).exec();
  }

}
