import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthApplication } from './application/auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenModule } from 'src/common/tokens/token.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [UsersModule, TokenModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthApplication],
})
export class AuthModule {}
