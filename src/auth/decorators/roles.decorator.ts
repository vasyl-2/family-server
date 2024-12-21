
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (roles: string[]) => SetMetadata(ROLES_KEY, roles);

// export const Roles = Reflector.createDecorator<string[]>('', '');
