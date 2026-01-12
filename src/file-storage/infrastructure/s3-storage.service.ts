import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3StorageService {
  private s3: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: this.configService.get('S3_ENDPOINT'),
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
    this.bucket = this.configService.get('S3_BUCKET');
    this.cdnUrl = this.configService.get('CDN_URL');
  }

  async uploadFile(file: any, folder?: string): Promise<{ fileId: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed',
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Max 5MB allowed');
    }

    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const key = folder ? `${folder}/${fileId}` : fileId;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3.send(command);

      return { fileId };
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);
    } catch (error) {
      console.error('Failed to delete file from S3:', error);
      throw new BadRequestException('File deletion failed');
    }
  }

  getFileUrl(fileId: string, folder?: string): string {
    const key = folder ? `${folder}/${fileId}` : fileId;
    return `${this.cdnUrl}/${key}`;
  }
}
