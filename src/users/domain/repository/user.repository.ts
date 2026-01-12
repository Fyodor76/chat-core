import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity>;
  findByLogin(login: string): Promise<UserEntity>;
}
