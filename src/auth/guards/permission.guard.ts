import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schem';
import { PermissionsService } from '../permissions.service';
import { PermissionDto } from '../dto/permission-dto';
import { RoleService } from '../role.service';

@Injectable()
export class PermissionGuard implements CanActivate  {

  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('REQUIRED___PERMISSIONS____', requiredPermissions);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest(); // this goes from AuthPassportGuard

    if (!user) {
      return false;
    }
    console.log('USER______________q', user);

    let permissionsByRole: PermissionDto[];

    const { roles } = user;
    try {
      permissionsByRole = await this.roleService.getRoleById(roles);
      console.log('permissionsByRole____________', permissionsByRole);
    } catch(err) {

    }
    return requiredPermissions.some((permission: string) => user.roles?.includes(permission));
  }
}
