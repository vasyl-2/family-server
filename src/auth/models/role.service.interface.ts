import { RoleDto } from '../dto/role-dto';

export interface RoleServiceInterface {
  getRoles(): Promise<RoleDto[]>;
  createRole(role: RoleDto): Promise<RoleDto>;
  editRole(role: RoleDto): Promise<RoleDto>;
  deleteRole(): Promise<string>;
}
