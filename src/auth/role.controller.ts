import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';

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
  async createRole(@Body() role: RoleDto): Promise<RoleDto> {
    let roleToCreate: RoleDto;

    try {
      roleToCreate = await this.roleService.createRole(role);
    } catch(e) {
      console.error('CREATE__ROLE___ERROR___', JSON.stringify(e));
    }

    return roleToCreate;
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
  async editRole(@Body() role: RoleDto): Promise<RoleDto> {
    let roleToEdit: RoleDto;

    try {
      roleToEdit = await this.roleService.editRole(role);
    } catch(e) {
        console.error('EDIT__ROLE___ERROR___', JSON.stringify(e));
    }

    return roleToEdit;
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
