import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';

import { RoleServiceInterface } from './models/role.service.interface';
import { RoleDto } from './dto/role-dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController implements RoleServiceInterface {

  constructor(
    private roleService: RoleService
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async createRole(): Promise<RoleDto> {
    let role: RoleDto;

    try {
      role = await this.roleService.createRole();
    } catch(e) {

    }

    return role;
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteRole(): Promise<string> {

    let removed: string;

    try {
      removed = await this.roleService.deleteRole();
    } catch(e) {

    }

    return removed;
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async editRole(): Promise<RoleDto> {
    let role: RoleDto;

    try {
      role = await this.roleService.editRole();
    } catch(e) {

    }

    return role;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getRoles(): Promise<RoleDto[]> {
    let roles: RoleDto[];

    try {
      roles = await this.roleService.getRoles();
    } catch(e) {

    }

    return roles;
  }

}
