import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions } from '@nestjs-modules/ioredis';

export const createRedisConfig = (
  configService: ConfigService,
): RedisModuleOptions => ({
  type: 'single',
  url: configService.get<string>('REDIS_URL'),
});
