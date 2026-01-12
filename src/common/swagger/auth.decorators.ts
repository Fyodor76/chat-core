import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { AuthDto, RefreshTokenDto } from 'src/auth/dto/auth.dto';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Authenticate user and return access/refresh tokens',
    }),
    ApiBody({ type: AuthDto }),
    ApiResponse({
      status: 201,
      description: 'Successfully authenticated',
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials or too many attempts',
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'User logout',
      description: 'Logout user and invalidate refresh token',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully logged out',
      schema: {
        example: { message: 'Logged out successfully' },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description: 'Get new access token using refresh token',
    }),
    ApiBody({ type: RefreshTokenDto }),
    ApiResponse({
      status: 200,
      description: 'Tokens successfully refreshed',
      schema: {
        example: {
          data: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid or expired refresh token',
    }),
  );
}

export function ApiLogoutAll() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Logout from all devices',
      description: 'Invalidate all refresh tokens for user',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully logged out from all devices',
      schema: {
        example: {
          data: { message: 'Logged out from all devices' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}
