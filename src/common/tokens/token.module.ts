// src/common/redis/token.module.ts
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { TokenGuard } from '../guards/token.guard';
import { WsTokenGuard } from '../guards/ws-token.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  providers: [TokenService, TokenGuard, WsTokenGuard],
  exports: [TokenService, TokenGuard, WsTokenGuard],
})
export class TokenModule {}
