// src/common/redis/guards/token.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../tokens/token.service';
import { TokenHelpers } from '../tokens/token.helpers';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const payload = await TokenHelpers.validateRestToken(
        this.tokenService,
        request,
      );

      // Добавляем пользователя к запросу
      request['user'] = {
        id: payload.sub,
        type: payload.type,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Authentication failed');
    }
  }
}
