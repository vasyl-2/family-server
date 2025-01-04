import { PermissionsServiceInterface } from './models/permissions.service.interface';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Headers } from '@nestjs/common';

import { PermissionDto } from './dto/permission-dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController implements PermissionsServiceInterface {

  constructor(
    private permissionsService: PermissionsService
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Get('user')
  async getPermissionsByUser(@Headers('authorization') authorizationString: string): Promise<PermissionDto[]> {

    console.log('START_____________1', authorizationString.split(' ')[1]);
    const user: string = authorizationString.split(' ')[1];

    const { role = undefined }: { role: string[] | undefined } = JSON.parse(atob(user.split('.')[1]));

    if (!role) {
      return []; // @TODO refactor
    }
    console.log('PARSED___USER_____', role);

    let permissions: PermissionDto[];

    try {
      permissions = await this.permissionsService.getPermissionsByRolesIds(role);
    } catch (e) {
      console.error('get permissions by user error:', JSON.stringify(e));
    }
    console.log('PERMISSIONS___BY__USER_________:  ', permissions);
    return permissions;
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async createPermission(): Promise<PermissionDto> {

    let permission: PermissionDto;

    try {
      permission = await this.permissionsService.createPermission();
    } catch (e) {

    }
    return permission;
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deletePermission(): Promise<string> {
    let permission: string;

    try {
      permission = await this.permissionsService.deletePermission();
    } catch (e) {

    }
    return permission;
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async editPermission(): Promise<PermissionDto> {
    let permission: PermissionDto;

    try {
      permission = await this.permissionsService.editPermission();
    } catch (e) {

    }
    return permission;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getPermissions(): Promise<PermissionDto[]> {

    console.log('START_____________');
    let permissions: PermissionDto[];

    try {
      permissions = await this.permissionsService.getPermissions();
    } catch (e) {

    }
    return permissions;
  }
}
