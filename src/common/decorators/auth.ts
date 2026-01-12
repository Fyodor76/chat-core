// src/common/redis/decorators/token.decorators.ts
import {
  applyDecorators,
  UseGuards,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { TokenGuard } from '../guards/token.guard';
import { WsTokenGuard } from '../guards/ws-token.guard';

export function Auth() {
  return applyDecorators(UseGuards(TokenGuard));
}
export function WsAuth() {
  return applyDecorators(UseGuards(WsTokenGuard));
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

export const WsUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    return {
      userId: (client as any).userId,
      tokenType: (client as any).tokenType,
    };
  },
);
