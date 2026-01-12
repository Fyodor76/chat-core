// src/cdn/application/dto/dto/file-url-query.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FileUrlQueryDto {
  @ApiProperty({
    description: 'Папка, в которой находится файл',
    example: 'products',
    required: false,
  })
  @IsString()
  @IsOptional()
  folder?: string;
}
