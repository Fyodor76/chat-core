import { Injectable } from '@nestjs/common';
import { S3StorageService } from './infrastructure/s3-storage.service';

export interface UploadResult {
  fileId: string;
  url: string;
  originalName: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class FileStorageService {
  constructor(private s3Storage: S3StorageService) {}

  async uploadFile(file: any, folder: string = ''): Promise<UploadResult> {
    const result = await this.s3Storage.uploadFile(file, folder);

    return {
      fileId: result.fileId,
      url: this.s3Storage.getFileUrl(result.fileId, folder),
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(fileId: string, folder?: string): Promise<void> {
    const key = folder ? `${folder}/${fileId}` : fileId;
    await this.s3Storage.deleteFile(key);
  }

  getFileUrl(fileId: string, folder?: string): string {
    return this.s3Storage.getFileUrl(fileId, folder);
  }
}
