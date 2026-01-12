import { UserEntity } from '../../domain/entities/user.entity';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static async toEntity(dto: UserCreateDto): Promise<UserEntity> {
    return UserEntity.create(dto.login, dto.password);
  }

  static toResponse(user: UserEntity): UserResponseDto {
    return new UserResponseDto(user.id, user.login);
  }
}
