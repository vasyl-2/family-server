import { PermissionDto } from '../dto/permission-dto';

export interface PermissionsServiceInterface {
  getPermissions(): Promise<PermissionDto[]>;
  createPermission(): Promise<PermissionDto>;
  editPermission(): Promise<PermissionDto>;
  deletePermission(): Promise<string>;
}
