import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionsService } from '../permissions.service';
import { PermissionDto } from '../dto/permission-dto';
import { RoleService } from '../role.service';

@Injectable()
export class PermissionGuard implements CanActivate  {

  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
    private permissionsService: PermissionsService,
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
    console.log('USER______________q', user._doc);

    let uniquePermissions: string[];

    const { role } = user._doc;
    const rolesAsStrings: string[] = role.map(r => r.toString());
    try {
      const permissionsByRoles: PermissionDto[] = await this.permissionsService.getPermissionsByRolesIds(rolesAsStrings);
      uniquePermissions = [...new Set(permissionsByRoles.map((p: PermissionDto) => p.name))];
      console.log('uniquePermissions________', uniquePermissions);
    } catch(err) {

    }
    return requiredPermissions.some((permission: string) => uniquePermissions.includes(permission));
  }
}
