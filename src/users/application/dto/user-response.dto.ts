import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'User login',
  })
  login: string;

  constructor(id: string, login: string) {
    this.id = id;
    this.login = login;
  }
}
