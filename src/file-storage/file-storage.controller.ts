import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  BadRequestException,
  Get,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorageService } from './file-storage.service';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiDeleteFile,
  ApiGetFileUrl,
  ApiUploadFile,
} from 'src/common/swagger/file-uploads.decorators';
import {
  FileOperationDto,
  FileUploadResponseDto,
  FileUrlResponseDto,
} from './application/dto/dto/file-operations.dto';
import {
  BaseResponseDeleteDto,
  BaseResponseDto,
} from 'src/common/dto/base-response.dto';
import { FileUrlQueryDto } from './application/dto/dto/file-url-query.dto';

@ApiTags('cdn')
@Controller('cdn')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadFile()
  async uploadFile(
    @UploadedFile() file: any,
    @Body() dto: FileOperationDto,
  ): Promise<BaseResponseDto<FileUploadResponseDto>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const result = await this.fileStorageService.uploadFile(file, dto.folder);

    return new BaseResponseDto(
      new FileUploadResponseDto(result.fileId, result.url),
      undefined,
      'File uploaded successfully',
    );
  }

  @Delete(':fileId')
  @ApiDeleteFile()
  async deleteFile(
    @Param('fileId') fileId: string,
    @Body() dto: FileOperationDto,
  ): Promise<BaseResponseDeleteDto> {
    await this.fileStorageService.deleteFile(fileId, dto.folder);

    return new BaseResponseDeleteDto(fileId, 'Deletion was successful');
  }

  @Get('url/:fileId')
  @ApiGetFileUrl()
  async getFileUrl(
    @Param('fileId') fileId: string,
    @Query() query: FileUrlQueryDto,
  ): Promise<BaseResponseDto<FileUrlResponseDto>> {
    const url = this.fileStorageService.getFileUrl(fileId, query.folder);

    return new BaseResponseDto(new FileUrlResponseDto(fileId, url));
  }
}
