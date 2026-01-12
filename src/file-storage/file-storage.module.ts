import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileStorageService } from './file-storage.service';
import { S3StorageService } from './infrastructure/s3-storage.service';
import { FileStorageController } from './file-storage.controller';

@Module({
  imports: [ConfigModule],
  controllers: [FileStorageController],
  providers: [FileStorageService, S3StorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
