import { RoleDto } from '../dto/role-dto';

export interface RoleServiceInterface {
  getRoles(): Promise<RoleDto[]>;
  createRole(): Promise<RoleDto>;
  editRole(): Promise<RoleDto>;
  deleteRole(): Promise<string>;
}
