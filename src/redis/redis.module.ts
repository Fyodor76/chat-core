import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { LoggerModule } from 'src/common/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { createRedisConfig } from 'src/config/redis.config';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createRedisConfig,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
