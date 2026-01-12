import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';

export function ApiUploadFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload file to CDN',
      description: 'Upload a file to CDN storage and get back file ID and URL',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload (images only: JPEG, PNG, WebP, GIF)',
          },
          folder: {
            type: 'string',
            description: 'Optional folder path for organization',
            example: 'products',
            default: '',
          },
        },
        required: ['file'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'File successfully uploaded',
      schema: {
        example: {
          success: true,
          data: {
            fileId: '1701234567890-abc123def456',
            url: 'https://cdn.example.com/products/1701234567890-abc123def456',
          },
          message: 'File uploaded successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'File is required',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 415,
      description: 'Invalid file type',
      schema: {
        example: {
          success: false,
          statusCode: 415,
          message: 'Invalid file type. Only images are allowed',
          error: 'Unsupported Media Type',
        },
      },
    }),
    ApiResponse({
      status: 413,
      description: 'File too large',
      schema: {
        example: {
          success: false,
          statusCode: 413,
          message: 'File size too large. Max 5MB allowed',
          error: 'Payload Too Large',
        },
      },
    }),
  );
}

export function ApiDeleteFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete file by ID',
      description: 'Permanently delete a file from CDN storage',
    }),
    ApiParam({
      name: 'fileId',
      type: String,
      description: 'File ID (without folder path)',
      example: '1701234567890-abc123def456',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          folder: {
            type: 'string',
            description:
              'Folder path if file was uploaded to a specific folder',
            example: 'products',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'File successfully deleted',
      schema: {
        example: {
          success: true,
          data: {
            message: 'File deleted successfully',
          },
          message: 'File deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'File deletion failed',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'File deletion failed',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'File not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'File not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiGetFileUrl() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get file URL by ID',
      description: 'Generate CDN URL for a file by its ID',
    }),
    ApiParam({
      name: 'fileId',
      type: String,
      description: 'File ID (without folder path)',
      example: '1701234567890-abc123def456',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          folder: {
            type: 'string',
            description:
              'Folder path if file was uploaded to a specific folder',
            example: 'products',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'File URL generated successfully',
      schema: {
        example: {
          success: true,
          data: {
            fileId: '1701234567890-abc123def456',
            url: 'https://cdn.example.com/products/1701234567890-abc123def456',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'File not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'File not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
