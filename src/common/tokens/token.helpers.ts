// src/common/redis/token.helpers.ts
import { Request } from 'express';
import { Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';

export class TokenHelpers {
  // Для REST API
  static async validateRestToken(tokenService: TokenService, request: Request) {
    const authHeader = request.headers.authorization;
    const token = tokenService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return tokenService.validateAccessToken(token);
  }

  // Для WebSocket
  static async validateWsToken(tokenService: TokenService, client: Socket) {
    const token = tokenService.extractTokenFromWsHandshake(client.handshake);

    if (!token) {
      throw new UnauthorizedException('No token provided for WebSocket');
    }

    return tokenService.validateAccessToken(token);
  }

  // Проверка, что токен еще действителен
  static isTokenExpired(payload: any): boolean {
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  }

  // Проверка, что токен уже активен
  static isTokenActive(payload: any): boolean {
    if (!payload.nbf) return true;
    return Date.now() >= payload.nbf * 1000;
  }

  // Извлечение userId из различных источников
  static extractUserId(source: any, tokenService: TokenService): string | null {
    // Если уже есть userId
    if (source?.userId) return source.userId;
    if (source?.user?.id) return source.user.id;

    // Если есть токен
    const token = this.extractToken(source, tokenService);
    if (token) {
      const payload = tokenService.decodeToken(token);
      return payload?.sub || null;
    }

    return null;
  }

  private static extractToken(
    source: any,
    tokenService: TokenService,
  ): string | null {
    if (source instanceof Socket) {
      return tokenService.extractTokenFromWsHandshake(source.handshake);
    }

    if (source.headers) {
      return tokenService.extractTokenFromHeader(source.headers.authorization);
    }

    return null;
  }
}
