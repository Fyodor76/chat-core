import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './infrastructure/orm/user.entity';
import { tryCatch } from '../common/utils/try-catch.helper';
import { throwNotFound } from '../common/exceptions/http-exception.helper';
import { ApiProperty } from '@nestjs/swagger';
import { SenderType } from './types';

export class RequestUserDto {
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: 'operator' })
  role: SenderType;

  @ApiProperty({ example: 'StrongPassword123!' })
  password: string;
}

export class ResponseUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'operator' })
  role: SenderType;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  async create(createDto: RequestUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.userModel.findOne({
      where: { login: createDto.username },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }

    const user = await tryCatch(
      () => this.userModel.create(createDto),
      'UsersService:create',
    );

    return user.toJSON() as any;
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await tryCatch(
      () => this.userModel.findAll(),
      'UsersService:findAll',
    );
    return users.map((u) => u.toJSON() as any);
  }

  async findById(id: string): Promise<ResponseUserDto> {
    const user = await tryCatch(
      () => this.userModel.findByPk(id),
      'UsersService:findById',
    );
    if (!user) throwNotFound(`User with id ${id} not found`);
    return user.toJSON() as any;
  }

  async update(
    id: string,
    updateDto: RequestUserDto,
  ): Promise<ResponseUserDto> {
    const [affectedCount] = await tryCatch(
      () => this.userModel.update(updateDto, { where: { id } }),
      'UsersService:update',
    );
    if (affectedCount === 0) throwNotFound(`User with id ${id} not found`);

    const updatedUser = await this.userModel.findByPk(id);
    return updatedUser.toJSON() as any;
  }

  async remove(id: string): Promise<{ id: string }> {
    const deleted = await tryCatch(
      () => this.userModel.destroy({ where: { id } }),
      'UsersService:remove',
    );
    if (!deleted) throwNotFound(`User with id ${id} not found`);
    return { id };
  }

  async createGuestUser() {
    // return tryCatchWs(async () => {
    //   const guestUser = await this.userModel.create({
    //     username: `guest_${Date.now()}`,
    //     login: null,
    //     password: null,
    //     role: Sender.GUEST,
    //   });
    //   return guestUser;
    // }, 'ChatService:createGuestUser');
  }
}
