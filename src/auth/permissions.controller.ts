import { PermissionsServiceInterface } from './models/permissions.service.interface';
import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';

import { PermissionDto } from './dto/permission-dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController implements PermissionsServiceInterface {

  constructor(
    private permissionsService: PermissionsService
  ) {
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

    let permissions: PermissionDto[];

    try {
      permissions = await this.permissionsService.getPermissions();
    } catch (e) {

    }
    return permissions;
  }
}
