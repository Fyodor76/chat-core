import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../infrastructure/orm/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async createUser(data: {
    login: string;
    password: string;
  }): Promise<UserModel> {
    return this.userModel.create(data);
  }

  async findByUsername(login: string): Promise<UserModel | null> {
    return this.userModel.findOne({ where: { login } });
  }
}
