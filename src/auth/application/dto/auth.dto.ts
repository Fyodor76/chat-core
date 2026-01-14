import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'User login',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Login can only contain letters, numbers and underscores',
  })
  login: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'User password',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Refresh token',
    minLength: 100,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(100, 500)
  refreshToken: string;
}
