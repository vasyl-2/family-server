import { PermissionDto } from './dto/permission-dto';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';

import { PermissionsDocument } from './schemas/permissions.scheme';
import { PermissionsServiceInterface } from './models/permissions.service.interface';
import { FilterOperators } from 'mongodb';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


@Injectable()
export class PermissionsService implements PermissionsServiceInterface {

  constructor(
    @InjectModel('Permissions')
    private readonly permissions: Model<PermissionsDocument>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
  }

  async getPermissionsByRolesIds(rolesIds: string[]): Promise<PermissionDto[]> {
    let permissions: PermissionDto[];

    try {
      permissions = await this.permissions.find({
        roles: {
          $in: rolesIds
        }
      })
    } catch (err) {
      console.error(
        'during receiving permissions by role id',
        JSON.stringify(err),
      );
    }

    return permissions;
  }

  async createPermission(): Promise<PermissionDto> {
    return Promise.resolve(undefined);
  }

  async deletePermission(): Promise<string> {
    return Promise.resolve('');
  }

  async editPermission(): Promise<PermissionDto> {
    return Promise.resolve(undefined);
  }

  async getPermissions(): Promise<PermissionDto[]> {
    let permissions: PermissionDto[];

    try {
      permissions = await this.permissions.find();
    } catch (err) {
      this.logger.error('getPermissions', JSON.stringify(err));
    }

    return permissions;
  }
}
