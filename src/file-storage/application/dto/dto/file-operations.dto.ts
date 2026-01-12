// file-storage/application/dto/file-operations.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FileOperationDto {
  @ApiProperty({
    description: 'Folder path for organization',
    example: 'products',
    required: false,
  })
  @IsString()
  @IsOptional()
  folder?: string;
}

export class FileUploadResponseDto {
  @ApiProperty({
    example: '1701234567890-abc123def456',
    description: 'Unique file identifier',
  })
  fileId: string;

  @ApiProperty({
    example: 'https://cdn.example.com/products/1701234567890-abc123def456',
    description: 'Public URL to access the file',
  })
  url: string;

  constructor(fileId: string, url: string) {
    this.fileId = fileId;
    this.url = url;
  }
}

export class FileUrlResponseDto {
  @ApiProperty({
    example: '1701234567890-abc123def456',
    description: 'File identifier',
  })
  fileId: string;

  @ApiProperty({
    example: 'https://cdn.example.com/products/1701234567890-abc123def456',
    description: 'Public URL to access the file',
  })
  url: string;

  constructor(fileId: string, url: string) {
    this.fileId = fileId;
    this.url = url;
  }
}
