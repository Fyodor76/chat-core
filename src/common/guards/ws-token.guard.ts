// src/common/redis/guards/ws-token.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TokenService } from '../tokens/token.service';
import { TokenHelpers } from '../tokens/token.helpers';

@Injectable()
export class WsTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client = context.switchToWs().getClient<Socket>();

    try {
      const payload = await TokenHelpers.validateWsToken(
        this.tokenService,
        client,
      );

      // Добавляем данные к сокету
      (client as any).userId = payload.sub;
      (client as any).tokenType = payload.type;

      return true;
    } catch (error) {
      throw new WsException(error.message || 'WebSocket authentication failed');
    }
  }
}
