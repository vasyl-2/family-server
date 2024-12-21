import { UserDTO } from '../dto/user-dto';

export interface UserServiceInterface {
  getUsers(): Promise<UserDTO[]>;
  createUser(userDto: UserDTO): Promise<UserDTO>;
  editUser(userDto: Partial<UserDTO>): Promise<Partial<UserDTO>>;
  deleteUser( userId: { id: string }): Promise<string>;
}
