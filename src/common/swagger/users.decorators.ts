import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserCreateDto } from 'src/users/application/dto/user-create.dto';
import { UserResponseDto } from 'src/users/application/dto/user-response.dto';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new user',
      description: 'Register a new user in the system',
    }),
    ApiBody({ type: UserCreateDto }),
    ApiResponse({
      status: 201,
      description: 'User successfully created',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'User with this login already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'User with this login already exist',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'login must be a string',
            'password must be at least 6 characters',
          ],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function ApiGetUserByLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user by login',
      description: 'Retrieve user information by login',
    }),
    ApiParam({
      name: 'login',
      type: String,
      description: 'User login',
      example: 'john_doe',
    }),
    ApiResponse({
      status: 200,
      description: 'User found',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'User with this login not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiGetUserById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user by ID',
      description: 'Retrieve user information by ID (requires authentication)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'User UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'User found',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid or missing token',
    }),
  );
}

export function ApiGetAllUsers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all users',
      description: 'Retrieve list of all users (requires authentication)',
    }),
    ApiResponse({
      status: 200,
      description: 'List of users retrieved successfully',
      type: [UserResponseDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update user',
      description: 'Update user information (requires authentication)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'User UUID',
    }),
    ApiBody({ type: UserCreateDto }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Login already taken',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete user',
      description: 'Delete user from system (requires authentication)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'User UUID',
    }),
    ApiResponse({
      status: 200,
      description: 'User deleted successfully',
      schema: {
        example: {
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}
