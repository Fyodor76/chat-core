// src/common/redis/token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface TokenPayload {
  sub: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccess(userId: string) {
    return this.jwtService.sign(
      { sub: userId, type: 'access' },
      { expiresIn: '15m' },
    );
  }

  generateRefresh(userId: string) {
    return this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: '7d' },
    );
  }

  generateTokens(userId: string) {
    return {
      accessToken: this.generateAccess(userId),
      refreshToken: this.generateRefresh(userId),
    };
  }

  verifyToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token) as TokenPayload;
    } catch (error) {
      this.handleTokenError(error);
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  validateAccessToken(token: string): TokenPayload {
    const payload = this.verifyToken(token);

    if (payload.type && payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    return payload;
  }

  validateRefreshToken(token: string): TokenPayload {
    const payload = this.verifyToken(token);

    if (payload.type && payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    return payload;
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  extractTokenFromWsQuery(query: any): string | null {
    const token = query?.token;
    return token && typeof token === 'string' ? token : null;
  }

  extractTokenFromWsAuth(auth: any): string | null {
    const token = auth?.token;
    return token && typeof token === 'string' ? token : null;
  }

  extractTokenFromWsHandshake(handshake: any): string | null {
    return (
      this.extractTokenFromWsAuth(handshake.auth) ||
      this.extractTokenFromWsQuery(handshake.query) ||
      this.extractTokenFromHeader(handshake.headers?.authorization)
    );
  }

  validateWsToken(handshake: any): TokenPayload {
    const token = this.extractTokenFromWsHandshake(handshake);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return this.validateAccessToken(token);
  }

  private handleTokenError(error: any): never {
    switch (error.name) {
      case 'TokenExpiredError':
        throw new UnauthorizedException('Token expired');
      case 'JsonWebTokenError':
        throw new UnauthorizedException('Invalid token');
      case 'NotBeforeError':
        throw new UnauthorizedException('Token not active');
      default:
        throw new UnauthorizedException('Token validation failed');
    }
  }
}
