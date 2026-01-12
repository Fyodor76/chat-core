import { InjectModel } from '@nestjs/sequelize';
import { UserRepository } from 'src/users/domain/repository/user.repository';
import { UserModel } from '../orm/user.entity';
import { UserEntity } from 'src/users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';

Injectable();
export class SequilizeUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    try {
      const created = await this.userModel.create({
        id: user.id,
        login: user.login,
        password: user.getPasswordHash(),
      });

      return this.buildUserEntity(created);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User with this login already exists');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<UserEntity> {
    const found = await this.userModel.findByPk(id);

    if (!found) return;
    return this.buildUserEntity(found);
  }

  async findByLogin(login: string): Promise<UserEntity> {
    const found = await this.userModel.findOne({ where: { login } });

    if (!found) return;

    return this.buildUserEntity(found);
  }

  private buildUserEntity(model: UserModel): UserEntity {
    return new UserEntity({
      id: model.id,
      login: model.login,
      passwordHash: model.password,
    });
  }
}
