import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/repository/user.repository';
import { UserEntity } from '../domain/entities/user.entity';
import {
  throwConflict,
  throwNotFound,
} from 'src/common/exceptions/http-exception.helper';

@Injectable()
export class UserAplication {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async create(user: UserEntity) {
    const isExisting = await this.userRepository.findByLogin(user.login);
    console.log(isExisting, 'isExisting');

    if (isExisting) {
      throwConflict('User with this login already exist');
    }

    return await this.userRepository.create(user);
  }

  async getUserByLogin(login: string) {
    const found = await this.userRepository.findByLogin(login);

    if (!found) {
      throwNotFound('User with this login not found');
    }

    return found;
  }
}
