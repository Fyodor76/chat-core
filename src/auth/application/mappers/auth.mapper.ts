import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { UserEntity } from 'src/users/domain/entities/user.entity';

export class AuthMapper {
  static toResponse(
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
  ): AuthResponseDto {
    return new AuthResponseDto(accessToken, refreshToken, {
      id: user.id,
      login: user.login,
    });
  }
}
