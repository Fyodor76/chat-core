import { Inject, Injectable } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { UserRepository } from 'src/users/domain/repository/user.repository';
import { throwUnauthorized } from 'src/common/exceptions/http-exception.helper';
import { TokenService } from 'src/common/tokens/token.service';
import { RedisService } from 'src/redis/redis.service';
import { REFRESH_TTL } from 'src/common/const/refresh.ttl';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class AuthApplication {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_BLOCK_TIME = 15 * 60;

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
    private readonly logger: AppLogger,
  ) {}

  async login(dto: AuthDto) {
    this.logger.log(`Login attempt for user: ${dto.login}`);

    const attemptsKey = `login_attempts_${dto.login}`;
    const attempts = await this.redisService.get(attemptsKey);

    if (parseInt(attempts) >= this.MAX_LOGIN_ATTEMPTS) {
      this.logger.warn(
        `Blocked login attempt for user: ${dto.login} - too many attempts`,
      );
      throwUnauthorized('Too many login attempts. Try again later.');
    }

    const user = await this.userRepository.findByLogin(dto.login);

    if (!user) {
      await this.incrementLoginAttempts(attemptsKey);
      this.logger.warn(`Failed login attempt - user not found: ${dto.login}`);
      throwUnauthorized('Wrong login or password');
    }

    const isPasswordValid = await user.checkPassword(dto.password);

    if (!isPasswordValid) {
      await this.incrementLoginAttempts(attemptsKey);
      this.logger.warn(
        `Failed login attempt - invalid password for user: ${user.id}`,
      );
      throwUnauthorized('Wrong login or password');
    }

    await this.redisService.del(attemptsKey);

    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      user.id,
    );

    await this.redisService.set(
      `refresh_${user.id}`,
      refreshToken,
      REFRESH_TTL,
    );

    this.logger.log(`Successful login for user: ${user.id}`);
    return { accessToken, refreshToken, user };
  }

  async refresh(rToken: string) {
    this.logger.debug('Refresh token attempt');

    if (!rToken || typeof rToken !== 'string') {
      this.logger.warn('Invalid refresh token format');
      throwUnauthorized('Invalid refresh token format');
    }

    let payload: any;
    try {
      payload = this.tokenService.verifyToken(rToken);
    } catch (err) {
      this.logger.warn(`Invalid refresh token: ${err.message}`);
      throwUnauthorized('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      this.logger.warn(`Invalid token type for user: ${payload.sub}`);
      throwUnauthorized('Invalid token type');
    }

    const storedToken = await this.redisService.get(`refresh_${payload.sub}`);

    if (!storedToken || storedToken !== rToken) {
      await this.redisService.del(`refresh_${payload.sub}`);
      this.logger.warn(
        `Stolen or invalid refresh token for user: ${payload.sub}`,
      );
      throwUnauthorized('Refresh token not valid or expired');
    }

    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      payload.sub,
    );

    await this.redisService.set(
      `refresh_${payload.sub}`,
      refreshToken,
      REFRESH_TTL,
    );

    this.logger.log(`Token refreshed for user: ${payload.sub}`);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    this.logger.log(`Logout for user: ${userId}`);

    const keys = await this.redisService.keys(`refresh_${userId}*`);

    for (const key of keys) {
      await this.redisService.del(key);
    }

    this.logger.log(`User logged out from ${keys.length} devices: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  private async incrementLoginAttempts(key: string): Promise<void> {
    const current = await this.redisService.get(key);
    const attempts = current ? parseInt(current) + 1 : 1;
    await this.redisService.set(
      key,
      attempts.toString(),
      this.LOGIN_BLOCK_TIME,
    );

    this.logger.debug(
      `Login attempts incremented for key: ${key}, attempts: ${attempts}`,
    );
  }

  async logoutAllDevices(userId: string) {
    this.logger.log(`Force logout all devices for user: ${userId}`);

    const pattern = `refresh_${userId}*`;
    const keys = await this.redisService.keys(pattern);

    for (const key of keys) {
      await this.redisService.del(key);
    }

    await this.redisService.del(`login_attempts_${userId}`);

    this.logger.log(
      `User logged out from all ${keys.length} devices: ${userId}`,
    );
    return { message: 'Logged out from all devices' };
  }
}
